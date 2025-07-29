import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('❌ DATABASE_URL no definida');
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
  if (process.env.NODE_ENV === 'production') {
    await client.connect();
    console.log('Conectado con Client serverless');
  } else {
    // Pool se conecta solo al hacer query, no hace falta
    console.log('Pool listo para conexiones');
  }
}

export default client;
