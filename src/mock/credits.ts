import { Credit, CreditPayment, Client } from '@/types';

export const mockClients: Client[] = [
  {
    id: 'client-1',
    nom: 'Jean Rakoto',
    telephone: '+261 34 12 345 67',
    adresse: 'Lot IVG 123 Analakely',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'client-2',
    nom: 'Marie Rabe',
    telephone: '+261 33 98 765 43',
    adresse: 'Villa 45 Ivandry',
    note: 'Cliente fidèle',
    createdAt: '2024-02-20T14:30:00Z',
  },
  {
    id: 'client-3',
    nom: 'Paul Andria',
    telephone: '+261 32 11 222 33',
    createdAt: '2024-03-05T09:15:00Z',
  },
  {
    id: 'client-4',
    nom: 'Hery Razafy',
    telephone: '+261 34 55 666 77',
    adresse: 'Lot II K 78 Ampefiloha',
    note: 'Propriétaire quincaillerie voisine',
    createdAt: '2024-03-10T11:00:00Z',
  },
];

export const mockCredits: Credit[] = [
  {
    id: 'credit-1',
    client: mockClients[0],
    items: [
      { productId: '1', productName: 'Marteau 500g', quantity: 2, unitPrice: 15000, total: 30000 },
      { productId: '3', productName: 'Tournevis plat', quantity: 5, unitPrice: 5000, total: 25000 },
    ],
    montantTotal: 55000,
    montantPaye: 0,
    resteAPayer: 55000,
    status: 'PENDING_PAYMENT',
    dateCreation: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    note: 'À payer fin de mois',
  },
  {
    id: 'credit-2',
    client: mockClients[1],
    items: [
      { productId: '5', productName: 'Riz 25kg', quantity: 2, unitPrice: 75000, total: 150000 },
      { productId: '6', productName: 'Huile 5L', quantity: 3, unitPrice: 35000, total: 105000 },
    ],
    montantTotal: 255000,
    montantPaye: 100000,
    resteAPayer: 155000,
    status: 'PARTIALLY_PAID',
    dateCreation: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'credit-3',
    client: mockClients[2],
    items: [
      { productId: '2', productName: 'Clous 5kg', quantity: 1, unitPrice: 25000, total: 25000 },
    ],
    montantTotal: 25000,
    montantPaye: 25000,
    resteAPayer: 0,
    status: 'PAID',
    dateCreation: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    datePaiement: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'credit-4',
    client: mockClients[3],
    items: [
      { productId: '4', productName: 'Vis assortis', quantity: 10, unitPrice: 2000, total: 20000 },
      { productId: '7', productName: 'Sucre 1kg', quantity: 5, unitPrice: 5000, total: 25000 },
    ],
    montantTotal: 45000,
    montantPaye: 20000,
    resteAPayer: 25000,
    status: 'PARTIALLY_PAID',
    dateCreation: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'credit-5',
    client: mockClients[0],
    items: [
      { productId: '8', productName: 'Peinture 4L', quantity: 2, unitPrice: 45000, total: 90000 },
    ],
    montantTotal: 90000,
    montantPaye: 0,
    resteAPayer: 90000,
    status: 'CANCELLED',
    dateCreation: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    note: 'Annulé - produit retourné',
  },
];

export const mockCreditPayments: CreditPayment[] = [
  {
    id: 'payment-1',
    creditId: 'credit-2',
    montant: 50000,
    modePaiement: 'cash',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'payment-2',
    creditId: 'credit-2',
    montant: 50000,
    modePaiement: 'mobile_money',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    note: 'Paiement via MVola',
  },
  {
    id: 'payment-3',
    creditId: 'credit-3',
    montant: 25000,
    modePaiement: 'cash',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'payment-4',
    creditId: 'credit-4',
    montant: 20000,
    modePaiement: 'cash',
    date: new Date().toISOString(),
    note: 'Premier versement',
  },
];
