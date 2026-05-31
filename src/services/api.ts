import {
  Product,
  ProductFormData,
  Sale,
  DashboardStats,
  ApiResponse,
  ClientCredit,
  CreateCreditInput,
  RecordCreditPaymentInput,
  CreditStatus,
  CreditStats,
  InternalUsage,
  CreateInternalUsageInput,
  InternalUsageStats,
} from '@/types';
import { mockProducts } from '@/mock/products';
import { mockSales } from '@/mock/sales';
import { mockCredits } from '@/mock/credits';
import { mockInternalUsages } from '@/mock/internalUsage';

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory storage for mock data
let products = [...mockProducts];
let sales = [...mockSales];
let credits = [...mockCredits];
let internalUsages = [...mockInternalUsages];

function computeCreditStatus(
  montantTotal: number,
  montantPaye: number,
  currentStatus: CreditStatus,
): CreditStatus {
  if (currentStatus === 'CANCELLED') return 'CANCELLED';
  if (montantPaye <= 0) return 'PENDING_PAYMENT';
  if (montantPaye >= montantTotal) return 'PAID';
  return 'PARTIALLY_PAID';
}

function decreaseProductStock(items: { productId: string; quantity: number }[]) {
  for (const item of items) {
    const productIndex = products.findIndex((p) => p.id === item.productId);
    if (productIndex !== -1) {
      products[productIndex] = {
        ...products[productIndex],
        stock: Math.max(0, products[productIndex].stock - item.quantity),
      };
    }
  }
}

function restoreProductStock(items: { productId: string; quantity: number }[]) {
  for (const item of items) {
    const productIndex = products.findIndex((p) => p.id === item.productId);
    if (productIndex !== -1) {
      products[productIndex] = {
        ...products[productIndex],
        stock: products[productIndex].stock + item.quantity,
      };
    }
  }
}

// Product Services
export const productService = {
  async getAll(): Promise<ApiResponse<Product[]>> {
    await delay(300);
    return { data: products, success: true };
  },

  async getById(id: string): Promise<ApiResponse<Product | null>> {
    await delay(200);
    const product = products.find((p) => p.id === id) || null;
    return { data: product, success: !!product };
  },

  async create(data: ProductFormData): Promise<ApiResponse<Product>> {
    await delay(400);
    const newProduct: Product = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    products = [newProduct, ...products];
    return { data: newProduct, success: true, message: 'Produit créé avec succès' };
  },

  async update(id: string, data: Partial<ProductFormData>): Promise<ApiResponse<Product | null>> {
    await delay(400);
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      return { data: null, success: false, message: 'Produit non trouvé' };
    }
    products[index] = {
      ...products[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return { data: products[index], success: true, message: 'Produit mis à jour avec succès' };
  },

  async delete(id: string): Promise<ApiResponse<boolean>> {
    await delay(300);
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      return { data: false, success: false, message: 'Produit non trouvé' };
    }
    products = products.filter((p) => p.id !== id);
    return { data: true, success: true, message: 'Produit supprimé avec succès' };
  },
};

// Sale Services
export const saleService = {
  async getAll(): Promise<ApiResponse<Sale[]>> {
    await delay(300);
    return { data: sales, success: true };
  },

  async getById(id: string): Promise<ApiResponse<Sale | null>> {
    await delay(200);
    const sale = sales.find((s) => s.id === id) || null;
    return { data: sale, success: !!sale };
  },

  async create(data: Omit<Sale, 'id'>): Promise<ApiResponse<Sale>> {
    await delay(400);
    const newSale: Sale = {
      ...data,
      id: Date.now().toString(),
    };
    sales = [newSale, ...sales];

    // Update product stock
    for (const item of data.items) {
      const productIndex = products.findIndex((p) => p.id === item.productId);
      if (productIndex !== -1) {
        products[productIndex] = {
          ...products[productIndex],
          stock: Math.max(0, products[productIndex].stock - item.quantity),
        };
      }
    }

    return { data: newSale, success: true, message: 'Vente enregistrée avec succès' };
  },
};

// Dashboard Statistics
export const statsService = {
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    await delay(300);
    const today = new Date().toISOString().split('T')[0];

    const todaySales = sales.filter(
      (s) => s.date.startsWith(today) && s.status === 'completed'
    );

    const activeCredits = credits.filter(
      (c) => c.statut === 'PENDING_PAYMENT' || c.statut === 'PARTIALLY_PAID',
    );

    const todayPayments = credits.flatMap((c) =>
      c.paiements.filter((p) => p.date.startsWith(today)),
    );

    const stats: DashboardStats = {
      totalVentesJour: todaySales.reduce((sum, s) => sum + s.total, 0),
      nombreVentes: todaySales.length,
      nombreProduits: products.length,
      produitsFaiblesStock: products.filter((p) => p.stock <= 5).length,
      totalCreditsImpayes: activeCredits.reduce((sum, c) => sum + c.resteAPayer, 0),
      nombreCreditsActifs: activeCredits.length,
      montantRecupereJour: todayPayments.reduce((sum, p) => sum + p.montant, 0),
      clientsDebiteurs: new Set(activeCredits.map((c) => c.client.telephone)).size,
    };

    return { data: stats, success: true };
  },

  async getTodayTotal(): Promise<ApiResponse<number>> {
    await delay(200);
    const today = new Date().toISOString().split('T')[0];
    const total = sales
      .filter((s) => s.date.startsWith(today) && s.status === 'completed')
      .reduce((sum, s) => sum + s.total, 0);
    return { data: total, success: true };
  },
};

// Credit Services — does NOT affect sales/revenue
export const creditService = {
  async getAll(): Promise<ApiResponse<ClientCredit[]>> {
    await delay(300);
    return { data: credits, success: true };
  },

  async getById(id: string): Promise<ApiResponse<ClientCredit | null>> {
    await delay(200);
    const credit = credits.find((c) => c.id === id) || null;
    return { data: credit, success: !!credit };
  },

  async create(input: CreateCreditInput): Promise<ApiResponse<ClientCredit>> {
    await delay(400);
    const montantTotal = input.items.reduce((sum, item) => sum + item.total, 0);
    const newCredit: ClientCredit = {
      id: `cr-${Date.now()}`,
      transactionType: 'CREDIT',
      client: input.client,
      items: input.items,
      montantTotal,
      montantPaye: 0,
      resteAPayer: montantTotal,
      statut: 'PENDING_PAYMENT',
      createdAt: new Date().toISOString(),
      note: input.note,
      paiements: [],
    };
    credits = [newCredit, ...credits];
    decreaseProductStock(input.items);
    return { data: newCredit, success: true, message: 'Crédit client enregistré' };
  },

  async recordPayment(
    input: RecordCreditPaymentInput,
  ): Promise<ApiResponse<ClientCredit | null>> {
    await delay(400);
    const index = credits.findIndex((c) => c.id === input.creditId);
    if (index === -1) {
      return { data: null, success: false, message: 'Crédit non trouvé' };
    }

    const credit = credits[index];
    if (credit.statut === 'CANCELLED' || credit.statut === 'PAID') {
      return { data: null, success: false, message: 'Crédit non modifiable' };
    }

    const payment = {
      id: `pay-${Date.now()}`,
      montant: input.montant,
      modePaiement: input.modePaiement,
      note: input.note,
      date: new Date().toISOString(),
    };

    const montantPaye = credit.montantPaye + input.montant;
    const resteAPayer = Math.max(0, credit.montantTotal - montantPaye);
    const statut = computeCreditStatus(credit.montantTotal, montantPaye, credit.statut);

    credits[index] = {
      ...credit,
      montantPaye,
      resteAPayer,
      statut,
      paidAt: statut === 'PAID' ? new Date().toISOString() : credit.paidAt,
      paiements: [payment, ...credit.paiements],
    };

    return {
      data: credits[index],
      success: true,
      message: 'Paiement enregistré',
    };
  },

  async cancel(id: string): Promise<ApiResponse<ClientCredit | null>> {
    await delay(300);
    const index = credits.findIndex((c) => c.id === id);
    if (index === -1) {
      return { data: null, success: false, message: 'Crédit non trouvé' };
    }

    const credit = credits[index];
    if (credit.statut === 'CANCELLED') {
      return { data: credit, success: false, message: 'Crédit déjà annulé' };
    }

    if (credit.statut !== 'PAID') {
      restoreProductStock(credit.items);
    }

    credits[index] = {
      ...credit,
      statut: 'CANCELLED',
      resteAPayer: 0,
    };

    return { data: credits[index], success: true, message: 'Crédit annulé' };
  },

  async getStats(): Promise<ApiResponse<CreditStats>> {
    await delay(200);
    const impaye = credits.filter((c) => c.statut === 'PENDING_PAYMENT');
    const partiel = credits.filter((c) => c.statut === 'PARTIALLY_PAID');
    const solde = credits.filter((c) => c.statut === 'PAID');

    return {
      data: {
        totalImpaye: impaye.reduce((sum, c) => sum + c.resteAPayer, 0),
        totalPartiel: partiel.reduce((sum, c) => sum + c.resteAPayer, 0),
        totalSolde: solde.reduce((sum, c) => sum + c.montantTotal, 0),
        nombreActifs: impaye.length + partiel.length,
      },
      success: true,
    };
  },
};

// Internal Usage Services — does NOT affect sales/revenue
export const internalUsageService = {
  async getAll(): Promise<ApiResponse<InternalUsage[]>> {
    await delay(300);
    return { data: internalUsages, success: true };
  },

  async create(input: CreateInternalUsageInput): Promise<ApiResponse<InternalUsage>> {
    await delay(400);
    const product = products.find((p) => p.id === input.productId);
    if (!product) {
      return {
        data: null as unknown as InternalUsage,
        success: false,
        message: 'Produit non trouvé',
      };
    }

    if (product.stock < input.quantity) {
      return {
        data: null as unknown as InternalUsage,
        success: false,
        message: 'Stock insuffisant',
      };
    }

    const newUsage: InternalUsage = {
      id: `iu-${Date.now()}`,
      transactionType: 'INTERNAL_USAGE',
      productId: input.productId,
      productName: product.nom,
      quantity: input.quantity,
      motif: input.motif,
      note: input.note,
      responsable: input.responsable,
      createdAt: new Date().toISOString(),
    };

    internalUsages = [newUsage, ...internalUsages];
    decreaseProductStock([{ productId: input.productId, quantity: input.quantity }]);

    return { data: newUsage, success: true, message: 'Sortie interne enregistrée' };
  },

  async getStats(): Promise<ApiResponse<InternalUsageStats>> {
    await delay(200);
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const quantityMap = new Map<string, { productName: string; totalQuantity: number }>();
    for (const usage of internalUsages) {
      const existing = quantityMap.get(usage.productId);
      if (existing) {
        existing.totalQuantity += usage.quantity;
      } else {
        quantityMap.set(usage.productId, {
          productName: usage.productName,
          totalQuantity: usage.quantity,
        });
      }
    }

    const topProducts = Array.from(quantityMap.entries())
      .map(([productId, data]) => ({
        productId,
        productName: data.productName,
        totalQuantity: data.totalQuantity,
      }))
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 5);

    const pertesDuMois = internalUsages
      .filter(
        (u) =>
          u.createdAt >= monthStart &&
          (u.motif === 'perte' || u.motif === 'produit_casse'),
      )
      .reduce((sum, u) => sum + u.quantity, 0);

    return {
      data: {
        topProducts,
        totalQuantitySortie: internalUsages.reduce((sum, u) => sum + u.quantity, 0),
        pertesDuMois,
      },
      success: true,
    };
  },
};
