export interface Material {
  id: number;
  name: string;
  quantity: number;
  category: string | null;
  valor: number | null;
  factura: string | null; 
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
