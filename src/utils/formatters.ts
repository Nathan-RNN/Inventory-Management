// Format price in Ariary (MGA) or generic currency
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR').format(price) + ' Ar';
}

// Format date to French locale
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// Format datetime to French locale
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Format time only
export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Get category label in French
export function getCategoryLabel(category: 'quincaillerie' | 'ppn'): string {
  const labels = {
    quincaillerie: 'Quincaillerie',
    ppn: 'PPN',
  };
  return labels[category];
}

// Get status color for Ant Design tags
export function getStatusColor(status: 'completed' | 'pending' | 'cancelled'): string {
  const colors = {
    completed: 'success',
    pending: 'warning',
    cancelled: 'error',
  };
  return colors[status];
}

// Get status label in French
export function getStatusLabel(status: 'completed' | 'pending' | 'cancelled'): string {
  const labels = {
    completed: 'Complétée',
    pending: 'En attente',
    cancelled: 'Annulée',
  };
  return labels[status];
}

// Generate unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Check if stock is low
export function isLowStock(stock: number, threshold: number = 5): boolean {
  return stock <= threshold;
}

// Credit status helpers
export function getCreditStatusColor(
  status: 'PENDING_PAYMENT' | 'PARTIALLY_PAID' | 'PAID' | 'CANCELLED',
): string {
  const colors = {
    PENDING_PAYMENT: 'orange',
    PARTIALLY_PAID: 'blue',
    PAID: 'green',
    CANCELLED: 'red',
  };
  return colors[status];
}

export function getCreditStatusLabel(
  status: 'PENDING_PAYMENT' | 'PARTIALLY_PAID' | 'PAID' | 'CANCELLED',
): string {
  const labels = {
    PENDING_PAYMENT: 'En attente',
    PARTIALLY_PAID: 'Partiellement payé',
    PAID: 'Soldé',
    CANCELLED: 'Annulé',
  };
  return labels[status];
}

export function getPaymentMethodLabel(
  method: 'cash' | 'mobile_money' | 'transfer' | 'other',
): string {
  const labels = {
    cash: 'Espèces',
    mobile_money: 'Mobile Money',
    transfer: 'Virement',
    other: 'Autre',
  };
  return labels[method];
}

export function getInternalUsageReasonLabel(
  reason:
    | 'usage_maison'
    | 'cadeau_client'
    | 'produit_casse'
    | 'perte'
    | 'echantillon'
    | 'autre',
): string {
  const labels = {
    usage_maison: 'Usage maison',
    cadeau_client: 'Cadeau client',
    produit_casse: 'Produit cassé',
    perte: 'Perte',
    echantillon: 'Échantillon',
    autre: 'Autre',
  };
  return labels[reason];
}

export function getInternalUsageReasonColor(
  reason:
    | 'usage_maison'
    | 'cadeau_client'
    | 'produit_casse'
    | 'perte'
    | 'echantillon'
    | 'autre',
): string {
  const colors = {
    usage_maison: 'cyan',
    cadeau_client: 'purple',
    produit_casse: 'orange',
    perte: 'red',
    echantillon: 'geekblue',
    autre: 'default',
  };
  return colors[reason];
}
