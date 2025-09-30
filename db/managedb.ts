// db/managedb.ts
import client, { connectClient } from '@lib/db';
import type { Material, User, Obra } from '@lib/types';

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
      lastUpdated TIMESTAMP DEFAULT NOW(),
      lastDestiny VARCHAR(255) NULL  -- nueva columna añadida aquí
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
    lastDestiny: row.lastdestiny || row.lastDestiny || null,
  };
}

export async function getAllMaterials(): Promise<Material[]> {
  await connectClient();
  const result = await client.query('SELECT id, name, quantity, valor, factura, category, description, updatedBy, lastUpdated, lastDestiny FROM materials');
  return result.rows.map(parseMaterialRow) as Material[];
}

export async function getMaterialById(id: number): Promise<Material | undefined> {
  await connectClient();
  const result = await client.query(
    'SELECT id, name, quantity, valor, factura, category, description, updatedBy, lastUpdated, lastDestiny FROM materials WHERE id = $1',
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
  lastUpdated?: string,
  lastDestiny?: string | null
): Promise<Material> {
  await connectClient();

  if (quantity !== undefined && quantity !== null) {
    quantity = parseFloat((quantity ?? 0).toFixed(2));
  }
  if (valor !== undefined && valor !== null) {
    valor = parseFloat((valor ?? 0).toFixed(2));
  }

  const result = await client.query(
    `INSERT INTO materials (name, quantity, valor, factura, category, description, updatedBy, lastUpdated, lastDestiny)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id, name, quantity, valor, factura, category, description, updatedBy, lastUpdated, lastDestiny`,
    [name, quantity, valor, factura, category, description, updatedBy, lastUpdated || new Date().toISOString(), lastDestiny || null]
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
     RETURNING id, name, quantity, valor, factura, category, description, updatedBy, lastUpdated, lastDestiny`,
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
  lastDestiny?: string | null;
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
  lastDestiny,
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
  if (lastDestiny !== undefined && lastDestiny !== null) {
    fields.push(`lastDestiny = $${fields.length + 1}`);
    values.push(lastDestiny);
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

function parseObraRow(row: any): Obra {
  return {
    id: row.id,
    obra: row.obra,
    email: row.email,
    provincia: row.provincia,
    localidad: row.localidad,
    importe: parseFloat(row.importe),
    contacto: row.contacto,
    observaciones: row.observaciones,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function getAllObras(): Promise<Obra[]> {
  await connectClient();
  const result = await client.query(`
    SELECT id, obra, email, provincia, localidad, importe, contacto, observaciones, created_at, updated_at
    FROM obras
  `);
  return result.rows.map(parseObraRow);
}

export async function getObraById(id: number): Promise<Obra | undefined> {
  await connectClient();
  const result = await client.query(
    `SELECT id, obra, email, provincia, localidad, importe, contacto, observaciones, created_at, updated_at
     FROM obras WHERE id = $1`,
    [id]
  );
  if (result.rows.length === 0) return undefined;
  return parseObraRow(result.rows[0]);
}

export async function addObra(
  obra: string,
  email: string,
  provincia: string | null,
  localidad: string | null,
  importe: number,
  contacto: string | null,
  observaciones: string | null,
  updatedBy: string,
  lastUpdated?: string
): Promise<Obra> {
  await connectClient();
  importe = parseFloat(importe.toFixed(2));

  const result = await client.query(
    `INSERT INTO obras (obra, email, provincia, localidad, importe, contacto, observaciones, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, obra, email, provincia, localidad, importe, contacto, observaciones, created_at, updated_at`,
    [obra, email, provincia, localidad, importe, contacto, observaciones, lastUpdated || new Date().toISOString()]
  );

  return parseObraRow(result.rows[0]);
}

type UpdateObraArgs = {
  id: number;
  obra?: string | null;
  email?: string | null;
  provincia?: string | null;
  localidad?: string | null;
  importe?: number | null;
  contacto?: string | null;
  observaciones?: string | null;
  updatedBy: string;
  lastUpdated?: string;
};

export async function updateObra({
  id,
  obra,
  email,
  provincia,
  localidad,
  importe,
  contacto,
  observaciones,
  updatedBy,
  lastUpdated,
}: UpdateObraArgs): Promise<Obra> {
  await connectClient();

  const fields: string[] = [];
  const values: any[] = [];

  if (obra !== undefined && obra !== null) {
    fields.push(`obra = $${fields.length + 1}`);
    values.push(obra);
  }
  if (email !== undefined && email !== null) {
    fields.push(`email = $${fields.length + 1}`);
    values.push(email);
  }
  if (provincia !== undefined && provincia !== null) {
    fields.push(`provincia = $${fields.length + 1}`);
    values.push(provincia);
  }
  if (localidad !== undefined && localidad !== null) {
    fields.push(`localidad = $${fields.length + 1}`);
    values.push(localidad);
  }
  if (importe !== undefined && importe !== null) {
    importe = parseFloat(importe.toFixed(2));
    fields.push(`importe = $${fields.length + 1}`);
    values.push(importe);
  }
  if (contacto !== undefined && contacto !== null) {
    fields.push(`contacto = $${fields.length + 1}`);
    values.push(contacto);
  }
  if (observaciones !== undefined && observaciones !== null) {
    fields.push(`observaciones = $${fields.length + 1}`);
    values.push(observaciones);
  }

  fields.push(`updated_at = $${fields.length + 1}`);
  values.push(lastUpdated || new Date().toISOString());

  // updatedBy no está en la tabla obras, si quieres guardar quién actualiza tendrás que añadir ese campo.

  const query = `UPDATE obras SET ${fields.join(', ')} WHERE id = $${values.length + 1} RETURNING *`;
  values.push(id);

  const result = await client.query(query, values);
  return parseObraRow(result.rows[0]);
}

export async function deleteObra(id: number): Promise<void> {
  await connectClient();
  await client.query('DELETE FROM obras WHERE id = $1', [id]);
}
