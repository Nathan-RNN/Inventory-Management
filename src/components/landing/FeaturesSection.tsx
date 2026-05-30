'use client';

import { Card, Typography } from 'antd';
import {
  ShoppingCartOutlined,
  AppstoreOutlined,
  HistoryOutlined,
  CalculatorOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const features = [
  {
    icon: <AppstoreOutlined style={{ fontSize: 32, color: '#1677ff' }} />,
    title: 'Gestion des produits',
    description: 'Ajoutez, modifiez et organisez vos produits de quincaillerie et PPN facilement.',
  },
  {
    icon: <ShoppingCartOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
    title: 'Gestion des ventes',
    description: 'Interface de caisse intuitive adaptée aux vendeurs avec calcul automatique.',
  },
  {
    icon: <HistoryOutlined style={{ fontSize: 32, color: '#fa8c16' }} />,
    title: 'Historique des ventes',
    description: 'Consultez et filtrez toutes vos ventes passées avec détails complets.',
  },
  {
    icon: <CalculatorOutlined style={{ fontSize: 32, color: '#722ed1' }} />,
    title: 'Total journalier',
    description: 'Suivez automatiquement vos revenus quotidiens et statistiques de vente.',
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-surface px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <Title level={2} style={{ marginBottom: 16 }}>
            Fonctionnalités principales
          </Title>
          <Paragraph style={{ color: '#595959', fontSize: 16 }}>
            Tout ce dont vous avez besoin pour gérer efficacement votre boutique
          </Paragraph>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              variant="borderless"
              style={{ background: '#fafafa' }}
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                {feature.icon}
              </div>
              <Title level={4} style={{ marginBottom: 8 }}>
                {feature.title}
              </Title>
              <Paragraph style={{ color: '#595959', marginBottom: 0 }}>
                {feature.description}
              </Paragraph>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
