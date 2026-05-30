"use client";

import { Card, Statistic, Skeleton } from "antd";
import type { StatisticProps } from "antd";
import {
  DollarOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  WarningOutlined,
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <Skeleton active paragraph={{ rows: 1 }} />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statsConfig.map((stat, index) => (
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
      ))}
    </div>
  );
}
