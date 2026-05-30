'use client';

import { Button } from 'antd';
import { ShopOutlined, MenuOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useState } from 'react';
import { Drawer } from 'antd';

const navLinks = [
  { href: '#features', label: 'Fonctionnalités' },
  { href: '#advantages', label: 'Avantages' },
  { href: '/dashboard', label: 'Dashboard' },
];

export function LandingHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary shadow-md">
            <ShopOutlined className="text-white" />
          </div>
          <span className="text-lg font-bold text-gradient">GestiBoutik</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/dashboard/sales">
            <Button type="text">Démo</Button>
          </Link>
          <Link href="/dashboard">
            <Button type="primary" size="large" className="!h-10 !px-6">
              Commencer
            </Button>
          </Link>
        </div>

        <Button
          type="text"
          icon={<MenuOutlined />}
          className="md:hidden"
          onClick={() => setDrawerOpen(true)}
        />

        <Drawer
          title={
            <span className="font-bold text-gradient">GestiBoutik</span>
          }
          placement="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          size={280}
        >
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setDrawerOpen(false)}
                className="text-base font-medium text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/dashboard" onClick={() => setDrawerOpen(false)}>
              <Button type="primary" block size="large" className="mt-4">
                Commencer
              </Button>
            </Link>
          </nav>
        </Drawer>
      </div>
    </header>
  );
}
