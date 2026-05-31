'use client';

import { Tag } from 'antd';
import { CreditStatus } from '@/types';

const statusConfig: Record<CreditStatus, { color: string; label: string }> = {
  PENDING_PAYMENT: { color: 'orange', label: 'En attente' },
  PARTIALLY_PAID: { color: 'blue', label: 'Partiel' },
  PAID: { color: 'green', label: 'Soldé' },
  CANCELLED: { color: 'red', label: 'Annulé' },
};

interface CreditStatusBadgeProps {
  status: CreditStatus;
}

export function CreditStatusBadge({ status }: CreditStatusBadgeProps) {
  const config = statusConfig[status];
  return <Tag color={config.color}>{config.label}</Tag>;
}
