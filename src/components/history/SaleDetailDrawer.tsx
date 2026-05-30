"use client";

import { Drawer, Descriptions, Table, Tag, Typography, Divider } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Sale, SaleItem } from "@/types";
import {
  formatPrice,
  formatDateTime,
  getStatusColor,
  getStatusLabel,
} from "@/utils";

const { Title, Text } = Typography;

interface SaleDetailDrawerProps {
  sale: Sale | null;
  open: boolean;
  onClose: () => void;
}

export function SaleDetailDrawer({
  sale,
  open,
  onClose,
}: SaleDetailDrawerProps) {
  if (!sale) return null;

  const itemColumns: ColumnsType<SaleItem> = [
    {
      title: "Produit",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Qté",
      dataIndex: "quantity",
      key: "quantity",
      width: 60,
      align: "center",
    },
    {
      title: "Prix unit.",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (price: number) => formatPrice(price),
      responsive: ["sm"],
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total: number) => (
        <span className="font-medium">{formatPrice(total)}</span>
      ),
    },
  ];

  return (
    <Drawer
      title={`Vente #${sale.id}`}
      open={open}
      onClose={onClose}
      size={500}
      className="sale-detail-drawer"
    >
      <div className="flex flex-col gap-6">
        {/* Sale Info */}
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Date">
            {formatDateTime(sale.date)}
          </Descriptions.Item>
          <Descriptions.Item label="Statut">
            <Tag color={getStatusColor(sale.status)}>
              {getStatusLabel(sale.status)}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Nombre d'articles">
            {sale.items.reduce((sum, item) => sum + item.quantity, 0)}
          </Descriptions.Item>
        </Descriptions>

        {/* Items List */}
        <div>
          <Title level={5} style={{ marginBottom: 12 }}>
            Articles
          </Title>
          <Table
            dataSource={sale.items}
            columns={itemColumns}
            rowKey="productId"
            pagination={false}
            size="small"
          />
        </div>

        {/* Payment Summary */}
        <div className="rounded-lg bg-background p-4">
          <Title level={5} style={{ marginBottom: 12 }}>
            Récapitulatif
          </Title>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <Text type="secondary">Sous-total</Text>
              <Text>{formatPrice(sale.total)}</Text>
            </div>

            <Divider className="my-2" />

            <div className="flex justify-between text-lg">
              <Text strong>Total</Text>
              <Text strong className="text-primary">
                {formatPrice(sale.total)}
              </Text>
            </div>

            <div className="flex justify-between">
              <Text type="secondary">Montant payé</Text>
              <Text>{formatPrice(sale.montantPaye)}</Text>
            </div>

            <div className="flex justify-between">
              <Text type="secondary">Rendu</Text>
              <Text className="text-accent">{formatPrice(sale.rendu)}</Text>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
