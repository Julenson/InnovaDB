// db/managedb.ts
import client, { connectClient, endClient } from '@lib/db';
import type { Material, User } from '../types';

export async function getPostById(postId: number) {
  await connectClient();
  const result = await client.query('SELECT * FROM posts WHERE id = $1', [postId]);
  return result.rows[0];
}

export async function initDatabase() {
  await connectClient();

  await client.query(`
    CREATE TABLE IF NOT EXISTS materials (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      category VARCHAR(255)
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      category VARCHAR(255)
    );
  `);

  await client.query(`
    INSERT INTO users (email,password)
    VALUES ('demo@innovasport.com', 'demopassword')
    ON CONFLICT (email) DO NOTHING
  `);
}

export async function getAllMaterials(): Promise<Material[]> {
  await connectClient();
  const result = await client.query('SELECT id, name, quantity, category FROM materials');
  return result.rows as Material[];
}

export async function getMaterialById(id: number): Promise<Material | undefined> {
  await connectClient();
  const result = await client.query(
    'SELECT id, name, quantity, category FROM materials WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

export async function addMaterial(name: string, quantity: number ,category: string | null ): Promise<Material> {
  await connectClient();
  const result = await client.query(
    'INSERT INTO materials (name, quantity, category) VALUES ($1, $2, $3) RETURNING id, name, quantity, category',
    [name, quantity, category]
  );
  return result.rows[0];
}

export async function updateMaterialQuantity(id: number, quantity: number): Promise<Material> {
  await connectClient();
  const result = await client.query(
    'UPDATE materials SET quantity = $1 WHERE id = $2 RETURNING id, name, quantity, category',
    [quantity, id]
  );
  return result.rows[0];
}

export async function deleteMaterial(id: number): Promise<void> {
  await connectClient();
  await client.query('DELETE FROM materials WHERE id = $1', [id]);
}

export async function getUserByEmail(email: string): Promise<User | null> {
  await connectClient();
  const result = await client.query(
    'SELECT id, email, password, category FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
}

export async function getUser(email: string, password: string): Promise<User | null> {
  await connectClient();
  const result = await client.query(
    'SELECT id, email, password, category FROM users WHERE email = $1 AND password = $2',
    [email, password]
  );
  return result.rows[0] || null;
}

export async function createUser(authenticatedUserCategory: string, email: string, password: string, category: string): Promise<void> {
  if (authenticatedUserCategory !== 'admin') {
    throw new Error('Unauthorized: Only admins can create users.');
  }
  await connectClient();
  await client.query(
    'INSERT INTO users (email, password, category) VALUES ($1, $2, $3)',
    [email, password, category]
  );
}

export async function updatePassword(email: string, password: string): Promise<void> {
  await connectClient();
  await client.query(
    'UPDATE users SET password = $1 WHERE email = $2',
    [password, email]
  );
}

export async function deleteUser(email: string): Promise<void> {
  await connectClient();
  await client.query('DELETE FROM users WHERE email = $1', [email]);
}

export async function getAllUsers(): Promise<User[]> {
  await connectClient();
  const result = await client.query('SELECT id, email, password, category FROM users');
  return result.rows as User[];
}
