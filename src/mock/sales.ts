import { Sale } from '@/types';

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split('T')[0];

export const mockSales: Sale[] = [
  {
    id: '1',
    items: [
      { productId: '1', productName: 'Marteau', quantity: 2, unitPrice: 15000, total: 30000 },
      { productId: '3', productName: 'Clous 50mm (100pcs)', quantity: 3, unitPrice: 3500, total: 10500 },
    ],
    total: 40500,
    montantPaye: 50000,
    rendu: 9500,
    date: `${today}T09:30:00Z`,
    status: 'completed',
  },
  {
    id: '2',
    items: [
      { productId: '9', productName: 'Biscuits Petit Beurre', quantity: 5, unitPrice: 2500, total: 12500 },
      { productId: '10', productName: "Jus d'orange 1L", quantity: 3, unitPrice: 4000, total: 12000 },
      { productId: '12', productName: 'Sucre 1kg', quantity: 2, unitPrice: 3200, total: 6400 },
    ],
    total: 30900,
    montantPaye: 31000,
    rendu: 100,
    date: `${today}T10:15:00Z`,
    status: 'completed',
  },
  {
    id: '3',
    items: [
      { productId: '5', productName: 'Pince universelle', quantity: 1, unitPrice: 12000, total: 12000 },
      { productId: '6', productName: 'Mètre ruban 5m', quantity: 2, unitPrice: 6000, total: 12000 },
    ],
    total: 24000,
    montantPaye: 25000,
    rendu: 1000,
    date: `${today}T11:45:00Z`,
    status: 'completed',
  },
  {
    id: '4',
    items: [
      { productId: '14', productName: 'Riz 5kg', quantity: 2, unitPrice: 12000, total: 24000 },
      { productId: '13', productName: 'Huile végétale 1L', quantity: 3, unitPrice: 5500, total: 16500 },
    ],
    total: 40500,
    montantPaye: 50000,
    rendu: 9500,
    date: `${today}T14:20:00Z`,
    status: 'completed',
  },
  {
    id: '5',
    items: [
      { productId: '2', productName: 'Tournevis cruciforme', quantity: 4, unitPrice: 5000, total: 20000 },
      { productId: '4', productName: 'Vis à bois (50pcs)', quantity: 2, unitPrice: 4500, total: 9000 },
    ],
    total: 29000,
    montantPaye: 30000,
    rendu: 1000,
    date: `${yesterday}T09:00:00Z`,
    status: 'completed',
  },
  {
    id: '6',
    items: [
      { productId: '16', productName: 'Café moulu 250g', quantity: 3, unitPrice: 6500, total: 19500 },
      { productId: '11', productName: 'Vinaigre blanc 50cl', quantity: 4, unitPrice: 1800, total: 7200 },
    ],
    total: 26700,
    montantPaye: 27000,
    rendu: 300,
    date: `${yesterday}T12:30:00Z`,
    status: 'completed',
  },
  {
    id: '7',
    items: [
      { productId: '7', productName: 'Scie à main', quantity: 1, unitPrice: 18000, total: 18000 },
      { productId: '8', productName: 'Niveau à bulle', quantity: 1, unitPrice: 8500, total: 8500 },
    ],
    total: 26500,
    montantPaye: 30000,
    rendu: 3500,
    date: `${yesterday}T15:45:00Z`,
    status: 'completed',
  },
  {
    id: '8',
    items: [
      { productId: '15', productName: 'Savon de Marseille', quantity: 10, unitPrice: 2000, total: 20000 },
    ],
    total: 20000,
    montantPaye: 20000,
    rendu: 0,
    date: `${twoDaysAgo}T10:00:00Z`,
    status: 'completed',
  },
  {
    id: '9',
    items: [
      { productId: '1', productName: 'Marteau', quantity: 1, unitPrice: 15000, total: 15000 },
      { productId: '2', productName: 'Tournevis cruciforme', quantity: 2, unitPrice: 5000, total: 10000 },
      { productId: '3', productName: 'Clous 50mm (100pcs)', quantity: 5, unitPrice: 3500, total: 17500 },
    ],
    total: 42500,
    montantPaye: 50000,
    rendu: 7500,
    date: `${twoDaysAgo}T14:20:00Z`,
    status: 'completed',
  },
];
