// scripts/init-db.ts
import client, { connectClient, endClient } from '@lib/db';
import { initDatabase } from '@db/managedb';

async function main() {
  try {
    await connectClient();
    console.log('Conectado a la base de datos.');

    await initDatabase();
    console.log('Base de datos inicializada correctamente.');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  } finally {
    await endClient();
    console.log('Conexión cerrada.');
  }
}

main();
export { initDatabase };

