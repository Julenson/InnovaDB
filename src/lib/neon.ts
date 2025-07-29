// lib/neon.ts
import { neon } from '@netlify/neon'

// Declara la propiedad en el globalThis para que TS no dé error
declare global {
  // Añade una propiedad _neonSql a globalThis de tipo ReturnType de neon()
  // Ajusta el tipo si neon() devuelve otra cosa
  var _neonSql: ReturnType<typeof neon> | undefined
}

let sql: ReturnType<typeof neon>

if (!globalThis._neonSql) {
  globalThis._neonSql = neon(process.env.NETLIFY_DATABASE_URL!)
}

sql = globalThis._neonSql

export default sql
