"use client";

import { Card, Statistic, Skeleton } from "antd";
import type { StatisticProps } from "antd";
import {
  DollarOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  WarningOutlined,
  CreditCardOutlined,
  UserOutlined,
  WalletOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import { useDashboardStats } from "@/hooks";
import { formatPrice } from "@/utils";

type StatsConfig = {
  title: string;
  value: number;
  formatter?: StatisticProps["formatter"];
  icon: React.ReactNode;
  color: string;
  bgColor: string;
};

export function StatsCards() {
  const { data: stats, isLoading } = useDashboardStats();

  const statsConfig: StatsConfig[] = [
    {
      title: "Ventes du jour",
      value: stats?.totalVentesJour || 0,
      formatter: (value) => formatPrice(Number(value)),
      icon: <DollarOutlined />,
      color: "#1677ff",
      bgColor: "#e6f4ff",
    },
    {
      title: "Nombre de ventes",
      value: stats?.nombreVentes || 0,
      icon: <ShoppingOutlined />,
      color: "#52c41a",
      bgColor: "#f6ffed",
    },
    {
      title: "Produits en stock",
      value: stats?.nombreProduits || 0,
      icon: <AppstoreOutlined />,
      color: "#722ed1",
      bgColor: "#f9f0ff",
    },
    {
      title: "Stock faible",
      value: stats?.produitsFaiblesStock || 0,
      icon: <WarningOutlined />,
      color: "#fa541c",
      bgColor: "#fff2e8",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[0, 1].map((row) => (
          <div key={row} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={`${row}-${i}`}>
                <Skeleton active paragraph={{ rows: 1 }} />
              </Card>
            ))}
          </div>
        ))}
      </div>
    );
  }

  const creditStatsConfig: StatsConfig[] = [
    {
      title: "Crédits impayés",
      value: stats?.totalCreditsImpayes || 0,
      formatter: (value) => formatPrice(Number(value)),
      icon: <CreditCardOutlined />,
      color: "#fa8c16",
      bgColor: "#fff7e6",
    },
    {
      title: "Crédits actifs",
      value: stats?.nombreCreditsActifs || 0,
      icon: <UserOutlined />,
      color: "#1677ff",
      bgColor: "#e6f4ff",
    },
    {
      title: "Récupéré aujourd'hui",
      value: stats?.montantRecupereJour || 0,
      formatter: (value) => formatPrice(Number(value)),
      icon: <WalletOutlined />,
      color: "#52c41a",
      bgColor: "#f6ffed",
    },
    {
      title: "Clients débiteurs",
      value: stats?.clientsDebiteurs || 0,
      icon: <TeamOutlined />,
      color: "#eb2f96",
      bgColor: "#fff0f6",
    },
  ];

  const renderCard = (stat: StatsConfig, index: number) => (
    <Card
      key={index}
      className="transition-shadow duration-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <Statistic
          title={stat.title}
          value={stat.value}
          formatter={stat.formatter}
          styles={{
            content: {
              color: stat.color,
              fontWeight: 600,
            },
          }}
        />
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl text-xl"
          style={{
            backgroundColor: stat.bgColor,
            color: stat.color,
          }}
        >
          {stat.icon}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsConfig.map(renderCard)}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {creditStatsConfig.map(renderCard)}
      </div>
    </div>
  );
}
