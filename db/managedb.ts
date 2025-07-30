// db/managedb.ts
import client, { connectClient } from '@lib/db';
import type { Material, User } from '../types';
import { error } from 'console';

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
      category VARCHAR(255),
      description VARCHAR(255)
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
  try{
    const result = await client.query('SELECT id, name, quantity, category, description FROM materials');
  console.log('🧪 getAllMaterials:', result.rows);
  return result.rows as Material[];
  } catch {
    console.error('❌ Error en getAllMaterials:', error);
    throw error;
  }
}

export async function getMaterialById(id: number): Promise<Material | undefined> {
  await connectClient();
  const result = await client.query(
    'SELECT id, name, quantity, category, description FROM materials WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

export async function getMaterialByName(name: string): Promise<Material | undefined> {
  await connectClient();
  const result = await client.query(
    'SELECT id, name, quantity, category, description FROM materials WHERE name = $1',
    [name]
  );
  return result.rows[0];
}

export async function getMaterialByQuantity(quantity: number): Promise<Material | undefined> {
  await connectClient();
  const result = await client.query(
    'SELECT id, name, quantity, category, description FROM materials WHERE quantity = $1',
    [quantity]
  );
  return result.rows[0];
}

export async function getMaterialByCategory(category: string): Promise<Material | undefined> {
  await connectClient();
  const result = await client.query(
    'SELECT id, name, quantity, category, description FROM materials WHERE category = $1',
    [category]
  );
  return result.rows[0];
}

export async function getMaterialByDescription(description: string): Promise<Material | undefined> {
  await connectClient();
  const result = await client.query(
    'SELECT id, name, quantity, category, description FROM materials WHERE description = $1',
    [description]
  );
  return result.rows[0];
}

export async function addMaterial(name: string, quantity: number ,category: string | null, description: string | null ): Promise<Material> {
  await connectClient();
  const result = await client.query(
    'INSERT INTO materials (name, quantity, category, description) VALUES ($1, $2, $3, $4) RETURNING id, name, quantity, category, description',
    [name, quantity, category, description]
  );
  return result.rows[0];
}

export async function updateMaterialQuantity(id: number, quantity: number): Promise<Material> {
  await connectClient();
  const result = await client.query(
    'UPDATE materials SET quantity = $1 WHERE id = $2 RETURNING id, name, quantity, category, description',
    [quantity, id]
  );
  return result.rows[0];
}

export async function updateMaterialName(id: number, name: string): Promise<Material>{
  await connectClient();
  const result = await client.query(
    'UPDATE materials SET name = $1 WHERE id = $2 RETURNING id, name, quantity, category, description ',
    [name, id]
  );
  return result.rows[0];
}

export async function updateMaterialDescription(id: number, description: string): Promise<Material>{
  await connectClient();
  const result = await client.query(
    'UPDATE materials SET description = $1 WHERE id = $2 RETURNING id, name, quantity, category, description',
    [description, id]
  );
  return result.row[0];
}

export async function updateMaterialCategory(id: number, category: string): Promise<Material>{
  await connectClient();
  const result = await client.query(
    'UPDATE materials SET category = $1 WHERE id = $2 RETURNING id, name, quantity, category, description',
    [category, id]
  );
  return result.row[0];
}

export async function updateMaterial(
  id: number,
  name: string | null,
  category: string | null,
  quantity: number | null,
  description: string | null,
  updatedBy: string // requerido en backend, no editable por el usuario
): Promise<Material> {
  await connectClient();
  const fields = [];
  const values = [];

  if (name !== null) {
    fields.push("name = $" + (fields.length + 1));
    values.push(name);
  }
  if (category !== null) {
    fields.push("category = $" + (fields.length + 1));
    values.push(category);
  }
  if (quantity !== null) {
    fields.push("quantity = $" + (fields.length + 1));
    values.push(quantity);
  }
  if (description !== null) {
    fields.push("description = $" + (fields.length + 1));
    values.push(description);
  }

  fields.push("updated_by = $" + (fields.length + 1));
  values.push(updatedBy);

  fields.push("last_updated = NOW()");

  const query = `UPDATE materials SET ${fields.join(", ")} WHERE id = $$${
    values.length + 1
  } RETURNING *`;
  values.push(id);

  const result = await client.query(query, values);
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
