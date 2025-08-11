export interface Material {
  id: number;
  name: string;
  quantity: number;
  category: string | null;
  valor: number | null;
  factura: string | null; 
  lastDestiny?: string | null;
  lastUpdated?: string | null; 
  updatedBy?: string | null;
  description: string | null;
}

export interface User {
  id: number;
  email: string;
  password: string;
  category: string | null;
}

export interface Obra {
  id: number;
  obra: string; 
  email: string;
  provincia: string;
  localidad: string;
  importe: number; 
  contacto: string; 
  observaciones: string;
  created_at: string;
  updated_at: string; 
}
