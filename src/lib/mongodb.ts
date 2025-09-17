import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

// Properly type a global cache to avoid creating multiple connections in dev
declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  } | undefined
}

// Ensure cached is always initialized to a non-undefined value
const cached = (global as any).mongoose as
  | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
  | undefined
;(global as any).mongoose =
  cached || ({ conn: null, promise: null } as {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  })

// From this point on, cachedCache is non-undefined
const cachedCache = (global as any).mongoose as {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

async function dbConnect() {
  if (cachedCache.conn) {
    return cachedCache.conn
  }

  if (!cachedCache.promise) {
    const opts = {
      bufferCommands: false,
    }

    cachedCache.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cachedCache.conn = await cachedCache.promise
  } catch (e) {
    cachedCache.promise = null
    throw e
  }

  return cachedCache.conn
}

export default dbConnect
