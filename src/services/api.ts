import { Product, ProductFormData, Sale, DashboardStats, ApiResponse } from '@/types';
import { mockProducts } from '@/mock/products';
import { mockSales } from '@/mock/sales';

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory storage for mock data
let products = [...mockProducts];
let sales = [...mockSales];

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

  async getTodayTotal(): Promise<ApiResponse<number>> {
    await delay(200);
    const today = new Date().toISOString().split('T')[0];
    const total = sales
      .filter((s) => s.date.startsWith(today) && s.status === 'completed')
      .reduce((sum, s) => sum + s.total, 0);
    return { data: total, success: true };
  },
};
