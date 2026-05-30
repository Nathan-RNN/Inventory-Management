// Product Types
export interface Product {
  id: string;
  nom: string;
  prix: number;
  stock: number;
  categorie: 'quincaillerie' | 'ppn';
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
}

// Sale Types
export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  total: number;
  montantPaye: number;
  rendu: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
}

// Statistics Types
export interface DashboardStats {
  totalVentesJour: number;
  nombreVentes: number;
  nombreProduits: number;
  produitsFaiblesStock: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Filter Types
export interface ProductFilters {
  search: string;
  categorie: 'all' | 'quincaillerie' | 'ppn';
}

export interface SaleFilters {
  search: string;
  dateFrom: string | null;
  dateTo: string | null;
}
