// db/managedb.ts
import client, { connectClient } from '@lib/db';
import type { Material, User } from '@lib/types';

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
      quantity NUMERIC(10,2) NOT NULL DEFAULT 0.00,
      valor NUMERIC(10,2) NOT NULL DEFAULT 0.00,
      factura VARCHAR(255), -- nuevo campo para factura
      category VARCHAR(255),
      description VARCHAR(255),
      updatedBy VARCHAR(255),
      lastUpdated TIMESTAMP DEFAULT NOW()
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

    await client.query(`
    CREATE TABLE IF NOT EXISTS obras (
      id INT AUTO_INCREMENT PRIMARY KEY,
      obra VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      provincia VARCHAR(100) DEFAULT NULL,
      localidad VARCHAR(100) DEFAULT NULL,
      importe DECIMAL(10,2) NOT NULL,
      contacto VARCHAR(255) DEFAULT NULL,
      observaciones TEXT DEFAULT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);
}

function parseMaterialRow(row: any): Material {
  return {
    ...row,
    quantity: parseFloat(row.quantity),
    valor: parseFloat(row.valor),
    factura: row.factura || null,
  };
}

export async function getAllMaterials(): Promise<Material[]> {
  await connectClient();
  const result = await client.query('SELECT id, name, quantity, valor, factura, category, description, updatedBy, lastUpdated FROM materials');
  return result.rows.map(parseMaterialRow) as Material[];
}

export async function getMaterialById(id: number): Promise<Material | undefined> {
  await connectClient();
  const result = await client.query(
    'SELECT id, name, quantity, valor, factura, category, description, updatedBy, lastUpdated FROM materials WHERE id = $1',
    [id]
  );
  if (result.rows.length === 0) return undefined;
  return parseMaterialRow(result.rows[0]);
}

export async function addMaterial(
  name: string,
  quantity: number,
  valor: number,
  factura: string | null,
  category: string | null,
  description: string | null,
  updatedBy: string,
  lastUpdated?: string
): Promise<Material> {
  await connectClient();

  quantity = parseFloat(quantity.toFixed(2));
  valor = parseFloat(valor.toFixed(2));

  const result = await client.query(
    `INSERT INTO materials (name, quantity, valor, factura, category, description, updatedBy, lastUpdated)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, name, quantity, valor, factura, category, description, updatedBy, lastUpdated`,
    [name, quantity, valor, factura, category, description, updatedBy, lastUpdated || new Date().toISOString()]
  );

  return parseMaterialRow(result.rows[0]);
}

export async function updateMaterialQuantityAndValor(
  id: number,
  quantity: number,
  valor: number,
  updatedBy: string
): Promise<Material> {
  await connectClient();

  quantity = parseFloat(quantity.toFixed(2));
  valor = parseFloat(valor.toFixed(2));

  const result = await client.query(
    `UPDATE materials 
     SET quantity = $1, valor = $2, updatedBy = $3, lastUpdated = NOW()
     WHERE id = $4
     RETURNING id, name, quantity, valor, factura, category, description, updatedBy, lastUpdated`,
    [quantity, valor, updatedBy, id]
  );
  return parseMaterialRow(result.rows[0]);
}

export async function updateMaterialDescription(id: number, description: string): Promise<Material> {
  await connectClient();
  const result = await client.query(
    'UPDATE materials SET description = $1 WHERE id = $2 RETURNING *',
    [description, id]
  );
  return parseMaterialRow(result.rows[0]);
}

export async function updateMaterialCategory(id: number, category: string): Promise<Material> {
  await connectClient();
  const result = await client.query(
    'UPDATE materials SET category = $1 WHERE id = $2 RETURNING *',
    [category, id]
  );
  return parseMaterialRow(result.rows[0]);
}

type UpdateMaterialArgs = {
  id: number;
  name?: string | null;
  category?: string | null;
  quantity?: number | null;
  valor?: number | null;
  factura?: string | null;
  description?: string | null;
  updatedBy: string;
  lastUpdated?: string;
};

export async function updateMaterial({
  id,
  name,
  category,
  quantity,
  valor,
  factura,
  description,
  updatedBy,
  lastUpdated,
}: UpdateMaterialArgs): Promise<Material> {
  await connectClient();
  const fields = [];
  const values = [];

  if (name !== undefined && name !== null) {
    fields.push(`name = $${fields.length + 1}`);
    values.push(name);
  }
  if (category !== undefined && category !== null) {
    fields.push(`category = $${fields.length + 1}`);
    values.push(category);
  }
  if (quantity !== undefined && quantity !== null) {
    quantity = parseFloat(quantity.toFixed(2));
    fields.push(`quantity = $${fields.length + 1}`);
    values.push(quantity);
  }
  if (valor !== undefined && valor !== null) {
    valor = parseFloat(valor.toFixed(2));
    fields.push(`valor = $${fields.length + 1}`);
    values.push(valor);
  }
  if (factura !== undefined && factura !== null) {
    fields.push(`factura = $${fields.length + 1}`);
    values.push(factura);
  }
  if (description !== undefined && description !== null) {
    fields.push(`description = $${fields.length + 1}`);
    values.push(description);
  }

  fields.push(`updatedBy = $${fields.length + 1}`);
  values.push(updatedBy);

  fields.push(`lastUpdated = $${fields.length + 1}`);
  values.push(lastUpdated || new Date().toISOString());

  const query = `UPDATE materials SET ${fields.join(', ')} WHERE id = $${values.length + 1} RETURNING *`;
  values.push(id);

  const result = await client.query(query, values);
  return parseMaterialRow(result.rows[0]);
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
