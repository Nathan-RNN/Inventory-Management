'use client';

import { Card, Table, Tag, Typography, Empty, Skeleton } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useSales } from '@/hooks';
import { useProducts } from '@/hooks';
import { formatPrice, formatTime, isLowStock } from '@/utils';
import { Sale, Product } from '@/types';

const { Title } = Typography;

export function RecentSales() {
  const { data: sales, isLoading } = useSales();

  const today = new Date().toISOString().split('T')[0];
  const todaySales = sales?.filter((s) => s.date.startsWith(today)).slice(0, 5) || [];

  const columns: ColumnsType<Sale> = [
    {
      title: 'Heure',
      dataIndex: 'date',
      key: 'time',
      render: (date: string) => formatTime(date),
      width: 80,
    },
    {
      title: 'Articles',
      dataIndex: 'items',
      key: 'items',
      render: (items: Sale['items']) => `${items.length} article(s)`,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => (
        <span style={{ fontWeight: 600, color: '#1677ff' }}>{formatPrice(total)}</span>
      ),
    },
  ];

  return (
    <Card>
      <Title level={5} style={{ marginBottom: 16 }}>
        Ventes récentes
      </Title>
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : todaySales.length === 0 ? (
        <Empty description="Aucune vente aujourd'hui" />
      ) : (
        <Table
          dataSource={todaySales}
          columns={columns}
          rowKey="id"
          pagination={false}
          size="small"
        />
      )}
    </Card>
  );
}

export function LowStockProducts() {
  const { data: products, isLoading } = useProducts();

  const lowStockProducts = products?.filter((p) => isLowStock(p.stock)).slice(0, 5) || [];

  const columns: ColumnsType<Product> = [
    {
      title: 'Produit',
      dataIndex: 'nom',
      key: 'nom',
      ellipsis: true,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number) => (
        <Tag color={stock <= 2 ? 'error' : 'warning'}>{stock} unité(s)</Tag>
      ),
      width: 100,
    },
    {
      title: 'Prix',
      dataIndex: 'prix',
      key: 'prix',
      render: (prix: number) => formatPrice(prix),
      width: 120,
    },
  ];

  return (
    <Card>
      <Title level={5} style={{ marginBottom: 16 }}>
        Stock faible
      </Title>
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : lowStockProducts.length === 0 ? (
        <Empty description="Tous les produits sont en stock" />
      ) : (
        <Table
          dataSource={lowStockProducts}
          columns={columns}
          rowKey="id"
          pagination={false}
          size="small"
        />
      )}
    </Card>
  );
}
