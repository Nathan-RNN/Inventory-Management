'use client';

import {
  Drawer,
  Descriptions,
  Table,
  Typography,
  Divider,
  Timeline,
  Button,
  Space,
  Popconfirm,
  App,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DollarOutlined, StopOutlined } from '@ant-design/icons';
import { ClientCredit, CreditItem } from '@/types';
import {
  formatPrice,
  formatDateTime,
  getPaymentMethodLabel,
} from '@/utils';
import { CreditStatusBadge } from './CreditStatusBadge';
import { useCancelCredit } from '@/hooks';

const { Title, Text } = Typography;

interface CreditDetailDrawerProps {
  credit: ClientCredit | null;
  open: boolean;
  onClose: () => void;
  onPayment: (credit: ClientCredit) => void;
}

export function CreditDetailDrawer({
  credit,
  open,
  onClose,
  onPayment,
}: CreditDetailDrawerProps) {
  const { message } = App.useApp();
  const cancelCredit = useCancelCredit();

  if (!credit) return null;

  const canPay =
    credit.statut === 'PENDING_PAYMENT' || credit.statut === 'PARTIALLY_PAID';
  const canCancel = credit.statut !== 'CANCELLED' && credit.statut !== 'PAID';

  const itemColumns: ColumnsType<CreditItem> = [
    {
      title: 'Produit',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Qté',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 60,
      align: 'center',
    },
    {
      title: 'Prix unit.',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (price: number) => formatPrice(price),
      responsive: ['sm'],
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => (
        <span className="font-medium">{formatPrice(total)}</span>
      ),
    },
  ];

  const handleCancel = async () => {
    try {
      const response = await cancelCredit.mutateAsync(credit.id);
      if (response.success) {
        message.success('Crédit annulé');
        onClose();
      } else {
        message.error(response.message || 'Erreur');
      }
    } catch {
      message.error("Erreur lors de l'annulation");
    }
  };

  return (
    <Drawer
      title={`Crédit #${credit.id}`}
      open={open}
      onClose={onClose}
      size={520}
      extra={
        <Space>
          {canPay && (
            <Button
              type="primary"
              icon={<DollarOutlined />}
              onClick={() => onPayment(credit)}
            >
              Paiement
            </Button>
          )}
          {canCancel && (
            <Popconfirm
              title="Annuler ce crédit ?"
              description="Le stock sera restauré si le crédit n'est pas soldé."
              onConfirm={handleCancel}
              okText="Oui, annuler"
              cancelText="Non"
              okButtonProps={{ danger: true }}
            >
              <Button
                danger
                icon={<StopOutlined />}
                loading={cancelCredit.isPending}
              >
                Annuler
              </Button>
            </Popconfirm>
          )}
        </Space>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <CreditStatusBadge status={credit.statut} />
          <Text type="secondary">{formatDateTime(credit.createdAt)}</Text>
        </div>

        <Descriptions column={1} bordered size="small" title="Client">
          <Descriptions.Item label="Nom">{credit.client.nom}</Descriptions.Item>
          <Descriptions.Item label="Téléphone">
            {credit.client.telephone}
          </Descriptions.Item>
          {credit.client.adresse && (
            <Descriptions.Item label="Adresse">
              {credit.client.adresse}
            </Descriptions.Item>
          )}
          {credit.note && (
            <Descriptions.Item label="Note">{credit.note}</Descriptions.Item>
          )}
        </Descriptions>

        <div>
          <Title level={5} style={{ marginBottom: 12 }}>
            Produits
          </Title>
          <Table
            dataSource={credit.items}
            columns={itemColumns}
            rowKey="productId"
            pagination={false}
            size="small"
          />
        </div>

        <div className="rounded-lg bg-background p-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <Text type="secondary">Montant total</Text>
              <Text>{formatPrice(credit.montantTotal)}</Text>
            </div>
            <div className="flex justify-between">
              <Text type="secondary">Montant payé</Text>
              <Text className="text-green-600">
                {formatPrice(credit.montantPaye)}
              </Text>
            </div>
            <Divider className="my-2" />
            <div className="flex justify-between text-lg">
              <Text strong>Reste à payer</Text>
              <Text strong className="text-primary">
                {formatPrice(credit.resteAPayer)}
              </Text>
            </div>
            {credit.paidAt && (
              <div className="flex justify-between text-sm">
                <Text type="secondary">Date de solde</Text>
                <Text>{formatDateTime(credit.paidAt)}</Text>
              </div>
            )}
          </div>
        </div>

        <div>
          <Title level={5} style={{ marginBottom: 12 }}>
            Historique des paiements
          </Title>
          {credit.paiements.length === 0 ? (
            <Text type="secondary">Aucun paiement enregistré</Text>
          ) : (
            <Timeline
              items={credit.paiements.map((p) => ({
                color: 'green',
                children: (
                  <div>
                    <div className="font-medium">{formatPrice(p.montant)}</div>
                    <div className="text-xs text-muted">
                      {getPaymentMethodLabel(p.modePaiement)} —{' '}
                      {formatDateTime(p.date)}
                    </div>
                    {p.note && (
                      <div className="text-xs text-muted">{p.note}</div>
                    )}
                  </div>
                ),
              }))}
            />
          )}
        </div>
      </div>
    </Drawer>
  );
}
