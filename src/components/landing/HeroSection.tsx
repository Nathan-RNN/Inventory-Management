'use client';

import { Button, Typography, Space } from 'antd';
import { RocketOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

export function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center px-4 py-20 text-center md:py-32">
      <div className="max-w-4xl animate-fade-in">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
          <RocketOutlined className="text-primary" />
          <span className="text-sm font-medium text-primary">Gestion simplifiée</span>
        </div>

        <Title level={1} className="mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: 24 }}>
          GestiBoutik
        </Title>

        <Paragraph
          className="mx-auto max-w-2xl text-lg md:text-xl"
          style={{ color: '#595959', marginBottom: 32 }}
        >
          La solution moderne et intuitive pour gérer votre boutique de quincaillerie 
          et produits de première nécessité. Simplifiez vos ventes, suivez vos stocks 
          et augmentez votre productivité.
        </Paragraph>

        <Space size="large" wrap className="justify-center">
          <Link href="/dashboard">
            <Button type="primary" size="large" className="h-12 px-8 text-base font-medium">
              Commencer maintenant
            </Button>
          </Link>
          <Link href="/dashboard/sales">
            <Button size="large" className="h-12 px-8 text-base font-medium">
              Voir la démo
            </Button>
          </Link>
        </Space>
      </div>

      <div className="mt-16 w-full max-w-5xl px-4">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
          <div className="flex items-center gap-2 border-b border-border bg-background px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
          </div>
          <div className="relative aspect-[16/9] bg-gradient-to-br from-primary/5 to-accent/5 p-8">
            <div className="grid h-full grid-cols-3 gap-4">
              <div className="col-span-1 flex flex-col gap-3">
                <div className="h-8 w-full rounded bg-primary/20" />
                <div className="h-6 w-3/4 rounded bg-muted/20" />
                <div className="h-6 w-3/4 rounded bg-muted/20" />
                <div className="h-6 w-3/4 rounded bg-muted/20" />
                <div className="h-6 w-3/4 rounded bg-muted/20" />
              </div>
              <div className="col-span-2 flex flex-col gap-4">
                <div className="grid grid-cols-4 gap-3">
                  <div className="h-20 rounded-lg bg-primary/20" />
                  <div className="h-20 rounded-lg bg-accent/20" />
                  <div className="h-20 rounded-lg bg-amber-500/20" />
                  <div className="h-20 rounded-lg bg-rose-500/20" />
                </div>
                <div className="flex-1 rounded-lg bg-surface/80" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
