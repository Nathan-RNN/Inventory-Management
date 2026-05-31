import { InternalUsage } from '@/types';

const today = new Date();
const daysAgo = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

export const mockInternalUsages: InternalUsage[] = [
  {
    id: 'iu-001',
    transactionType: 'INTERNAL_USAGE',
    productId: '9',
    productName: 'Riz blanc (5kg)',
    quantity: 2,
    motif: 'usage_maison',
    note: 'Consommation personnelle',
    responsable: 'Propriétaire',
    createdAt: daysAgo(0),
  },
  {
    id: 'iu-002',
    transactionType: 'INTERNAL_USAGE',
    productId: '4',
    productName: 'Vis à bois (50pcs)',
    quantity: 3,
    motif: 'produit_casse',
    note: 'Boîte endommagée à la réception',
    responsable: 'Propriétaire',
    createdAt: daysAgo(1),
  },
  {
    id: 'iu-003',
    transactionType: 'INTERNAL_USAGE',
    productId: '1',
    productName: 'Marteau',
    quantity: 1,
    motif: 'cadeau_client',
    note: 'Client fidèle — anniversaire boutique',
    responsable: 'Propriétaire',
    createdAt: daysAgo(3),
  },
  {
    id: 'iu-004',
    transactionType: 'INTERNAL_USAGE',
    productId: '11',
    productName: 'Huile de cuisine (1L)',
    quantity: 1,
    motif: 'perte',
    note: 'Bouteille cassée en rayon',
    responsable: 'Propriétaire',
    createdAt: daysAgo(5),
  },
  {
    id: 'iu-005',
    transactionType: 'INTERNAL_USAGE',
    productId: '3',
    productName: 'Clous 50mm (100pcs)',
    quantity: 2,
    motif: 'echantillon',
    responsable: 'Propriétaire',
    createdAt: daysAgo(8),
  },
  {
    id: 'iu-006',
    transactionType: 'INTERNAL_USAGE',
    productId: '5',
    productName: 'Peinture blanche (1L)',
    quantity: 1,
    motif: 'usage_maison',
    responsable: 'Propriétaire',
    createdAt: daysAgo(12),
  },
  {
    id: 'iu-007',
    transactionType: 'INTERNAL_USAGE',
    productId: '4',
    productName: 'Vis à bois (50pcs)',
    quantity: 5,
    motif: 'perte',
    note: 'Inventaire — écart constaté',
    responsable: 'Propriétaire',
    createdAt: daysAgo(15),
  },
];
