// Create or update an admin user with a securely hashed password
// Usage (PowerShell):
//   node scripts/create-admin.js --username admin --email admin@example.com --password "StrongP@ssw0rd" --role admin

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not set in environment variables')
  process.exit(1)
}

// Minimal User model for the script (aligned with src/models/User.ts)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model('User', userSchema)

function getArg(flag, fallback) {
  const idx = process.argv.indexOf(flag)
  if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1]
  return fallback
}

async function main() {
  const username = getArg('--username')
  const email = getArg('--email')
  const password = getArg('--password')
  const role = getArg('--role', 'admin')

  if (!username || !email || !password) {
    console.error('Usage: node scripts/create-admin.js --username <name> --email <email> --password <pass> [--role admin|user]')
    process.exit(1)
  }

  await mongoose.connect(MONGODB_URI, {})

  try {
    let user = await User.findOne({ $or: [{ username }, { email }] })
    const hashed = await bcrypt.hash(password, 12)

    if (user) {
      user.username = username
      user.email = email
      user.password = hashed
      user.role = role
      await user.save()
      console.log(`Updated user ${username} (${role}) successfully`)
    } else {
      user = new User({ username, email, password: hashed, role })
      await user.save()
      console.log(`Created user ${username} (${role}) successfully`)
    }
  } catch (err) {
    console.error('Error creating/updating user:', err)
  } finally {
    await mongoose.disconnect()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
