# secure_random_key.py
import secrets

# generate a 64-byte (512-bit) key, returned as 128 hex chars
key = secrets.token_hex(128)
print(key)
node scripts/create-admin.js --username admin2512 --email techtrendinnovation0@gmail.com --password "Admin25121$" --role admin