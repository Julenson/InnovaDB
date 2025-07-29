export interface Material {
    id: number;
    name: string;
    category: string | null;
    quantity: number;
    lastUpdated?: Date | null;
}
  
export interface User {
    id: number;
    mail: string;
    password: string;
    category: string | null;
}
  