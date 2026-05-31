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

// Transaction Type (global concept)
export type TransactionType = 'SALE' | 'CREDIT' | 'INTERNAL_USAGE';

// Credit Status
export type CreditStatus = 'PENDING_PAYMENT' | 'PARTIALLY_PAID' | 'PAID' | 'CANCELLED';

// Client Types
export interface Client {
  id: string;
  nom: string;
  telephone: string;
  adresse?: string;
  note?: string;
  createdAt: string;
}

// Credit Item Types
export interface CreditItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Credit Types
export interface Credit {
  id: string;
  client: Client;
  items: CreditItem[];
  montantTotal: number;
  montantPaye: number;
  resteAPayer: number;
  status: CreditStatus;
  dateCreation: string;
  datePaiement?: string;
  note?: string;
}

// Payment History
export interface CreditPayment {
  id: string;
  creditId: string;
  montant: number;
  modePaiement: 'cash' | 'mobile_money' | 'autre';
  date: string;
  note?: string;
}

// Credit Filters
export interface CreditFilters {
  search: string;
  status: CreditStatus | 'all';
  dateFrom: string | null;
  dateTo: string | null;
}

// Internal Usage Reason
export type InternalUsageReason = 
  | 'usage_maison' 
  | 'cadeau_client' 
  | 'produit_casse' 
  | 'perte' 
  | 'echantillon'
  | 'autre';

// Internal Usage Types
export interface InternalUsage {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  motif: InternalUsageReason;
  note?: string;
  responsable: string;
  dateCreation: string;
}

// Internal Usage Filters
export interface InternalUsageFilters {
  search: string;
  motif: InternalUsageReason | 'all';
  dateFrom: string | null;
  dateTo: string | null;
}

// Extended Dashboard Stats
export interface ExtendedDashboardStats extends DashboardStats {
  totalCreditsImpayes: number;
  nombreCreditsActifs: number;
  montantRecupereAujourdhui: number;
  clientsDebiteurs: number;
  sortiesInternesMois: number;
  pertesTotalesMois: number;
}
