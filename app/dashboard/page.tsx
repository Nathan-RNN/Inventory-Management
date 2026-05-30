'use client';

import { Typography, Button } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { StatsCards, RecentSales, LowStockProducts } from '@/components/dashboard';

const { Title, Paragraph } = Typography;

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Title level={2} style={{ marginBottom: 4 }}>
            Bienvenue sur GestiBoutik
          </Title>
          <Paragraph style={{ color: '#595959', marginBottom: 0 }}>
            {"Voici un aperçu de l'activité de votre boutique aujourd'hui."}
          </Paragraph>
        </div>
        <Link href="/dashboard/sales">
          <Button type="primary" size="large" icon={<ShoppingCartOutlined />}>
            Nouvelle vente
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Widgets */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentSales />
        <LowStockProducts />
      </div>
    </div>
  );
}
