// src/lib/db.ts
import { Pool } from 'pg';

const connectionString = process.env.NETLIFY_DATABASE_URL;

if (!connectionString) {
  throw new Error('❌ NETLIFY_DATABASE_URL no definida');
}

let client: any;

if (process.env.NODE_ENV === 'production') {
  const { Client } = require('@neondatabase/serverless');
  client = new Client({ connectionString });
} else {
  client = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });
}

export async function connectClient() {
  // Pool no necesita manual connect() — se maneja solo
  console.log('Conexión lista con Pool');
}

export default client;
