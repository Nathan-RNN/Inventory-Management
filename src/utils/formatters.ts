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
