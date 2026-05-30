'use client';

import { Typography, Space, Divider } from 'antd';
import {
  GithubOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

const { Title, Paragraph, Text } = Typography;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground px-4 py-12 text-surface">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Title level={3} style={{ color: '#fff', marginBottom: 16 }}>
              GestiBoutik
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.65)', marginBottom: 24 }}>
              La solution moderne pour la gestion de votre boutique de quincaillerie 
              et produits PPN. Simple, efficace et adaptée à vos besoins.
            </Paragraph>
            <Space size="large">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/65 transition-colors hover:text-white"
              >
                <GithubOutlined style={{ fontSize: 24 }} />
              </a>
            </Space>
          </div>

          {/* Links */}
          <div>
            <Text strong style={{ color: '#fff', display: 'block', marginBottom: 16 }}>
              Navigation
            </Text>
            <Space direction="vertical" size="small">
              <Link href="/" className="text-white/65 transition-colors hover:text-white">
                Accueil
              </Link>
              <Link href="/dashboard" className="text-white/65 transition-colors hover:text-white">
                Tableau de bord
              </Link>
              <Link href="/dashboard/products" className="text-white/65 transition-colors hover:text-white">
                Produits
              </Link>
              <Link href="/dashboard/sales" className="text-white/65 transition-colors hover:text-white">
                Ventes
              </Link>
            </Space>
          </div>

          {/* Contact */}
          <div>
            <Text strong style={{ color: '#fff', display: 'block', marginBottom: 16 }}>
              Contact
            </Text>
            <Space direction="vertical" size="small">
              <div className="flex items-center gap-2 text-white/65">
                <MailOutlined />
                <span>contact@gestiboutik.com</span>
              </div>
              <div className="flex items-center gap-2 text-white/65">
                <PhoneOutlined />
                <span>+261 34 00 000 00</span>
              </div>
            </Space>
          </div>
        </div>

        <Divider style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '32px 0' }} />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Text style={{ color: 'rgba(255,255,255,0.45)' }}>
            &copy; {currentYear} GestiBoutik. Tous droits réservés.
          </Text>
          <Space split={<Divider type="vertical" style={{ borderColor: 'rgba(255,255,255,0.2)' }} />}>
            <Link href="#" className="text-white/45 text-sm transition-colors hover:text-white/65">
              Politique de confidentialité
            </Link>
            <Link href="#" className="text-white/45 text-sm transition-colors hover:text-white/65">
              Conditions d&apos;utilisation
            </Link>
          </Space>
        </div>
      </div>
    </footer>
  );
}
