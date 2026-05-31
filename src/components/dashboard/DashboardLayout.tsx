"use client";

import { useState } from "react";
import { Layout, Menu, Button, Typography, Drawer } from "antd";
import {
  DashboardOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  HistoryOutlined,
  CreditCardOutlined,
  ExportOutlined,
  MenuOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const { Sider, Header, Content } = Layout;
const { Title } = Typography;

const menuItems = [
  {
    key: "/dashboard",
    icon: <DashboardOutlined />,
    label: <Link href="/dashboard">Tableau de bord</Link>,
  },
  {
    key: "/dashboard/products",
    icon: <AppstoreOutlined />,
    label: <Link href="/dashboard/products">Produits</Link>,
  },
  {
    key: "/dashboard/sales",
    icon: <ShoppingCartOutlined />,
    label: <Link href="/dashboard/sales">Ventes</Link>,
  },
  {
    key: "/dashboard/history",
    icon: <HistoryOutlined />,
    label: <Link href="/dashboard/history">Historique</Link>,
  },
  {
    key: "/dashboard/credits",
    icon: <CreditCardOutlined />,
    label: <Link href="/dashboard/credits">Crédits clients</Link>,
  },
  {
    key: "/dashboard/internal-usage",
    icon: <ExportOutlined />,
    label: <Link href="/dashboard/internal-usage">Sorties internes</Link>,
  },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const selectedKey =
    menuItems.find((item) => pathname === item.key)?.key || "/dashboard";

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center justify-center border-b border-border">
        <Title level={4} style={{ margin: 0, color: "#1677ff" }}>
          {collapsed ? "GB" : "GestiBoutik"}
        </Title>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        style={{ borderRight: 0 }}
        className="mt-2"
      />
    </>
  );

  return (
    <Layout className="min-h-screen">
      {/* Desktop Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth={80}
        className="hidden lg:block"
        style={{
          background: "#fff",
          borderRight: "1px solid #d9d9d9",
          position: "fixed",
          height: "100vh",
          left: 0,
          top: 0,
          zIndex: 100,
        }}
      >
        {sidebarContent}
      </Sider>

      {/* Mobile Drawer */}
      <Drawer
        placement="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        size={250}
        styles={{ body: { padding: 0 } }}
        className="lg:hidden"
      >
        {sidebarContent}
      </Drawer>

      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200,
          transition: "margin-left 0.2s",
        }}
        className="lg:ml-[200px] max-lg:ml-0"
      >
        {/* Header */}
        <Header
          className="flex items-center justify-between px-4 lg:px-6"
          style={{
            background: "#fff",
            borderBottom: "1px solid #d9d9d9",
            position: "sticky",
            top: 0,
            zIndex: 50,
            height: 64,
          }}
        >
          <div className="flex items-center gap-4">
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden"
            />
            <Title level={4} className="hidden lg:block" style={{ margin: 0 }}>
              {pathname === "/dashboard" && "Tableau de bord"}
              {pathname === "/dashboard/products" && "Gestion des produits"}
              {pathname === "/dashboard/sales" && "Point de vente"}
              {pathname === "/dashboard/history" && "Historique des ventes"}
              {pathname === "/dashboard/credits" && "Crédits clients"}
              {pathname === "/dashboard/internal-usage" && "Sorties internes"}
            </Title>
          </div>

          <Link href="/">
            <Button type="text" icon={<HomeOutlined />}>
              <span className="hidden sm:inline">Accueil</span>
            </Button>
          </Link>
        </Header>

        {/* Main Content */}
        <Content className="p-4 lg:p-6">
          <div className="animate-fade-in">{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
}
