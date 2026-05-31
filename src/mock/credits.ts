import { ClientCredit } from '@/types';

const today = new Date();
const daysAgo = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

export const mockCredits: ClientCredit[] = [
  {
    id: 'cr-001',
    transactionType: 'CREDIT',
    client: {
      nom: 'Rakoto Jean',
      telephone: '034 12 345 67',
      adresse: 'Analakely, Antananarivo',
    },
    items: [
      {
        productId: '1',
        productName: 'Marteau',
        quantity: 2,
        unitPrice: 15000,
        total: 30000,
      },
      {
        productId: '3',
        productName: 'Clous 50mm (100pcs)',
        quantity: 5,
        unitPrice: 3500,
        total: 17500,
      },
    ],
    montantTotal: 47500,
    montantPaye: 0,
    resteAPayer: 47500,
    statut: 'PENDING_PAYMENT',
    createdAt: daysAgo(2),
    note: 'Client habituel — paiement fin de semaine',
    paiements: [],
  },
  {
    id: 'cr-002',
    transactionType: 'CREDIT',
    client: {
      nom: 'Rasoa Marie',
      telephone: '032 98 765 43',
    },
    items: [
      {
        productId: '9',
        productName: 'Riz blanc (5kg)',
        quantity: 10,
        unitPrice: 12000,
        total: 120000,
      },
    ],
    montantTotal: 120000,
    montantPaye: 50000,
    resteAPayer: 70000,
    statut: 'PARTIALLY_PAID',
    createdAt: daysAgo(5),
    paiements: [
      {
        id: 'pay-001',
        montant: 50000,
        modePaiement: 'mobile_money',
        note: 'Acompte MVola',
        date: daysAgo(3),
      },
    ],
  },
  {
    id: 'cr-003',
    transactionType: 'CREDIT',
    client: {
      nom: 'Andry Paul',
      telephone: '033 55 123 89',
      adresse: '67 Ha, Antananarivo',
    },
    items: [
      {
        productId: '2',
        productName: 'Tournevis cruciforme',
        quantity: 3,
        unitPrice: 5000,
        total: 15000,
      },
      {
        productId: '5',
        productName: 'Peinture blanche (1L)',
        quantity: 2,
        unitPrice: 25000,
        total: 50000,
      },
    ],
    montantTotal: 65000,
    montantPaye: 65000,
    resteAPayer: 0,
    statut: 'PAID',
    createdAt: daysAgo(10),
    paidAt: daysAgo(7),
    paiements: [
      {
        id: 'pay-002',
        montant: 30000,
        modePaiement: 'cash',
        date: daysAgo(8),
      },
      {
        id: 'pay-003',
        montant: 35000,
        modePaiement: 'cash',
        note: 'Solde',
        date: daysAgo(7),
      },
    ],
  },
  {
    id: 'cr-004',
    transactionType: 'CREDIT',
    client: {
      nom: 'Nirina Solo',
      telephone: '034 77 888 99',
    },
    items: [
      {
        productId: '11',
        productName: 'Huile de cuisine (1L)',
        quantity: 4,
        unitPrice: 8500,
        total: 34000,
      },
    ],
    montantTotal: 34000,
    montantPaye: 0,
    resteAPayer: 0,
    statut: 'CANCELLED',
    createdAt: daysAgo(4),
    note: 'Annulé — erreur de saisie',
    paiements: [],
  },
  {
    id: 'cr-005',
    transactionType: 'CREDIT',
    client: {
      nom: 'Hery Fanja',
      telephone: '032 11 222 33',
      adresse: 'Itaosy',
    },
    items: [
      {
        productId: '6',
        productName: 'Pince multiprise',
        quantity: 1,
        unitPrice: 18000,
        total: 18000,
      },
      {
        productId: '4',
        productName: 'Vis à bois (50pcs)',
        quantity: 10,
        unitPrice: 4500,
        total: 45000,
      },
    ],
    montantTotal: 63000,
    montantPaye: 20000,
    resteAPayer: 43000,
    statut: 'PARTIALLY_PAID',
    createdAt: daysAgo(1),
    paiements: [
      {
        id: 'pay-004',
        montant: 20000,
        modePaiement: 'cash',
        date: daysAgo(0),
      },
    ],
  },
];
