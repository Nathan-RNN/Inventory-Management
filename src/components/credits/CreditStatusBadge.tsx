'use client';

import { Tag } from 'antd';
import { CreditStatus } from '@/types';
import { getCreditStatusColor, getCreditStatusLabel } from '@/utils';

interface CreditStatusBadgeProps {
  status: CreditStatus;
}

export function CreditStatusBadge({ status }: CreditStatusBadgeProps) {
  return (
    <Tag color={getCreditStatusColor(status)}>{getCreditStatusLabel(status)}</Tag>
  );
}
