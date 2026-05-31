import { Product, ProductFormData, Sale, DashboardStats, ApiResponse, Credit, CreditPayment, InternalUsage, ExtendedDashboardStats, CreditItem } from '@/types';
import { mockProducts } from '@/mock/products';
import { mockSales } from '@/mock/sales';
import { mockCredits, mockCreditPayments, mockClients } from '@/mock/credits';
import { mockInternalUsage } from '@/mock/internalUsage';

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory storage for mock data
let products = [...mockProducts];
let sales = [...mockSales];
let credits = [...mockCredits];
let creditPayments = [...mockCreditPayments];
let internalUsages = [...mockInternalUsage];

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

    const stats: DashboardStats = {
      totalVentesJour: todaySales.reduce((sum, s) => sum + s.total, 0),
      nombreVentes: todaySales.length,
      nombreProduits: products.length,
      produitsFaiblesStock: products.filter((p) => p.stock <= 5).length,
    };

    return { data: stats, success: true };
  },

  async getExtendedStats(): Promise<ApiResponse<ExtendedDashboardStats>> {
    await delay(300);
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().toISOString().slice(0, 7);

    const todaySales = sales.filter(
      (s) => s.date.startsWith(today) && s.status === 'completed'
    );

    const activeCredits = credits.filter(
      (c) => c.status === 'PENDING_PAYMENT' || c.status === 'PARTIALLY_PAID'
    );

    const todayPayments = creditPayments.filter(
      (p) => p.date.startsWith(today)
    );

    const monthUsages = internalUsages.filter(
      (u) => u.dateCreation.startsWith(thisMonth)
    );

    const uniqueDebtors = new Set(activeCredits.map((c) => c.client.id));

    const stats: ExtendedDashboardStats = {
      totalVentesJour: todaySales.reduce((sum, s) => sum + s.total, 0),
      nombreVentes: todaySales.length,
      nombreProduits: products.length,
      produitsFaiblesStock: products.filter((p) => p.stock <= 5).length,
      totalCreditsImpayes: activeCredits.reduce((sum, c) => sum + c.resteAPayer, 0),
      nombreCreditsActifs: activeCredits.length,
      montantRecupereAujourdhui: todayPayments.reduce((sum, p) => sum + p.montant, 0),
      clientsDebiteurs: uniqueDebtors.size,
      sortiesInternesMois: monthUsages.reduce((sum, u) => sum + u.quantity, 0),
      pertesTotalesMois: monthUsages
        .filter((u) => u.motif === 'perte' || u.motif === 'produit_casse')
        .reduce((sum, u) => sum + u.quantity, 0),
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

// Credit Services
export const creditService = {
  async getAll(): Promise<ApiResponse<Credit[]>> {
    await delay(300);
    return { data: credits, success: true };
  },

  async getById(id: string): Promise<ApiResponse<Credit | null>> {
    await delay(200);
    const credit = credits.find((c) => c.id === id) || null;
    return { data: credit, success: !!credit };
  },

  async create(data: {
    client: { nom: string; telephone: string; adresse?: string; note?: string };
    items: CreditItem[];
    note?: string;
  }): Promise<ApiResponse<Credit>> {
    await delay(400);

    // Create or find client
    let client = mockClients.find(
      (c) => c.telephone === data.client.telephone
    );
    if (!client) {
      client = {
        id: `client-${Date.now()}`,
        nom: data.client.nom,
        telephone: data.client.telephone,
        adresse: data.client.adresse,
        note: data.client.note,
        createdAt: new Date().toISOString(),
      };
    }

    const montantTotal = data.items.reduce((sum, item) => sum + item.total, 0);

    const newCredit: Credit = {
      id: `credit-${Date.now()}`,
      client,
      items: data.items,
      montantTotal,
      montantPaye: 0,
      resteAPayer: montantTotal,
      status: 'PENDING_PAYMENT',
      dateCreation: new Date().toISOString(),
      note: data.note,
    };

    credits = [newCredit, ...credits];

    // Decrease stock immediately
    for (const item of data.items) {
      const productIndex = products.findIndex((p) => p.id === item.productId);
      if (productIndex !== -1) {
        products[productIndex] = {
          ...products[productIndex],
          stock: Math.max(0, products[productIndex].stock - item.quantity),
        };
      }
    }

    return { data: newCredit, success: true, message: 'Crédit créé avec succès' };
  },

  async addPayment(
    creditId: string,
    payment: { montant: number; modePaiement: 'cash' | 'mobile_money' | 'autre'; note?: string }
  ): Promise<ApiResponse<Credit | null>> {
    await delay(400);

    const creditIndex = credits.findIndex((c) => c.id === creditId);
    if (creditIndex === -1) {
      return { data: null, success: false, message: 'Crédit non trouvé' };
    }

    const credit = credits[creditIndex];
    const newMontantPaye = credit.montantPaye + payment.montant;
    const newResteAPayer = credit.montantTotal - newMontantPaye;

    let newStatus = credit.status;
    if (newResteAPayer <= 0) {
      newStatus = 'PAID';
    } else if (newMontantPaye > 0) {
      newStatus = 'PARTIALLY_PAID';
    }

    credits[creditIndex] = {
      ...credit,
      montantPaye: newMontantPaye,
      resteAPayer: Math.max(0, newResteAPayer),
      status: newStatus,
      datePaiement: newStatus === 'PAID' ? new Date().toISOString() : undefined,
    };

    // Add payment record
    const newPayment: CreditPayment = {
      id: `payment-${Date.now()}`,
      creditId,
      montant: payment.montant,
      modePaiement: payment.modePaiement,
      date: new Date().toISOString(),
      note: payment.note,
    };
    creditPayments = [newPayment, ...creditPayments];

    return { data: credits[creditIndex], success: true, message: 'Paiement enregistré avec succès' };
  },

  async getPaymentHistory(creditId: string): Promise<ApiResponse<CreditPayment[]>> {
    await delay(200);
    const payments = creditPayments.filter((p) => p.creditId === creditId);
    return { data: payments, success: true };
  },

  async cancel(id: string): Promise<ApiResponse<Credit | null>> {
    await delay(300);
    const index = credits.findIndex((c) => c.id === id);
    if (index === -1) {
      return { data: null, success: false, message: 'Crédit non trouvé' };
    }

    credits[index] = {
      ...credits[index],
      status: 'CANCELLED',
    };

    // Restore stock
    for (const item of credits[index].items) {
      const productIndex = products.findIndex((p) => p.id === item.productId);
      if (productIndex !== -1) {
        products[productIndex] = {
          ...products[productIndex],
          stock: products[productIndex].stock + item.quantity,
        };
      }
    }

    return { data: credits[index], success: true, message: 'Crédit annulé' };
  },
};

// Internal Usage Services
export const internalUsageService = {
  async getAll(): Promise<ApiResponse<InternalUsage[]>> {
    await delay(300);
    return { data: internalUsages, success: true };
  },

  async create(data: Omit<InternalUsage, 'id' | 'dateCreation'>): Promise<ApiResponse<InternalUsage>> {
    await delay(400);

    const newUsage: InternalUsage = {
      ...data,
      id: `usage-${Date.now()}`,
      dateCreation: new Date().toISOString(),
    };

    internalUsages = [newUsage, ...internalUsages];

    // Decrease stock immediately
    const productIndex = products.findIndex((p) => p.id === data.productId);
    if (productIndex !== -1) {
      products[productIndex] = {
        ...products[productIndex],
        stock: Math.max(0, products[productIndex].stock - data.quantity),
      };
    }

    return { data: newUsage, success: true, message: 'Sortie interne enregistrée' };
  },

  async delete(id: string): Promise<ApiResponse<boolean>> {
    await delay(300);
    const usage = internalUsages.find((u) => u.id === id);
    if (!usage) {
      return { data: false, success: false, message: 'Sortie non trouvée' };
    }

    // Restore stock
    const productIndex = products.findIndex((p) => p.id === usage.productId);
    if (productIndex !== -1) {
      products[productIndex] = {
        ...products[productIndex],
        stock: products[productIndex].stock + usage.quantity,
      };
    }

    internalUsages = internalUsages.filter((u) => u.id !== id);
    return { data: true, success: true, message: 'Sortie supprimée' };
  },

  async getStats(): Promise<ApiResponse<{ topProducts: { name: string; total: number }[]; totalQuantity: number; lossesThisMonth: number }>> {
    await delay(200);
    const thisMonth = new Date().toISOString().slice(0, 7);
    const monthUsages = internalUsages.filter((u) => u.dateCreation.startsWith(thisMonth));

    // Group by product
    const productCounts: Record<string, { name: string; total: number }> = {};
    for (const usage of internalUsages) {
      if (!productCounts[usage.productId]) {
        productCounts[usage.productId] = { name: usage.productName, total: 0 };
      }
      productCounts[usage.productId].total += usage.quantity;
    }

    const topProducts = Object.values(productCounts)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    const totalQuantity = monthUsages.reduce((sum, u) => sum + u.quantity, 0);
    const lossesThisMonth = monthUsages
      .filter((u) => u.motif === 'perte' || u.motif === 'produit_casse')
      .reduce((sum, u) => sum + u.quantity, 0);

    return {
      data: { topProducts, totalQuantity, lossesThisMonth },
      success: true,
    };
  },
};
