// Transaction Types
export type TransactionType = 'SALE' | 'CREDIT' | 'INTERNAL_USAGE';

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

// Credit Types
export type CreditStatus =
  | 'PENDING_PAYMENT'
  | 'PARTIALLY_PAID'
  | 'PAID'
  | 'CANCELLED';

export type PaymentMethod = 'cash' | 'mobile_money' | 'transfer' | 'other';

export interface CreditClient {
  nom: string;
  telephone: string;
  adresse?: string;
}

export interface CreditItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface CreditPayment {
  id: string;
  montant: number;
  modePaiement: PaymentMethod;
  note?: string;
  date: string;
}

export interface ClientCredit {
  id: string;
  transactionType: 'CREDIT';
  client: CreditClient;
  items: CreditItem[];
  montantTotal: number;
  montantPaye: number;
  resteAPayer: number;
  statut: CreditStatus;
  createdAt: string;
  paidAt?: string;
  note?: string;
  paiements: CreditPayment[];
}

export type CreateCreditInput = {
  client: CreditClient;
  items: CreditItem[];
  note?: string;
};

export type RecordCreditPaymentInput = {
  creditId: string;
  montant: number;
  modePaiement: PaymentMethod;
  note?: string;
};

// Internal Usage Types
export type InternalUsageReason =
  | 'usage_maison'
  | 'cadeau_client'
  | 'produit_casse'
  | 'perte'
  | 'echantillon'
  | 'autre';

export interface InternalUsage {
  id: string;
  transactionType: 'INTERNAL_USAGE';
  productId: string;
  productName: string;
  quantity: number;
  motif: InternalUsageReason;
  note?: string;
  responsable: string;
  createdAt: string;
}

export type CreateInternalUsageInput = Omit<
  InternalUsage,
  'id' | 'transactionType' | 'productName' | 'createdAt'
>;

export interface CreditStats {
  totalImpaye: number;
  totalPartiel: number;
  totalSolde: number;
  nombreActifs: number;
}

export interface InternalUsageStats {
  topProducts: { productId: string; productName: string; totalQuantity: number }[];
  totalQuantitySortie: number;
  pertesDuMois: number;
}

// Statistics Types
export interface DashboardStats {
  totalVentesJour: number;
  nombreVentes: number;
  nombreProduits: number;
  produitsFaiblesStock: number;
  totalCreditsImpayes: number;
  nombreCreditsActifs: number;
  montantRecupereJour: number;
  clientsDebiteurs: number;
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

export interface CreditFilters {
  search: string;
  statut: CreditStatus | 'all';
  dateFrom: string | null;
  dateTo: string | null;
}

export interface InternalUsageFilters {
  search: string;
  motif: InternalUsageReason | 'all';
  dateFrom: string | null;
  dateTo: string | null;
}
