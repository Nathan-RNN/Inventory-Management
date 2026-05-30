'use client';

import { Card, Input, Tag, Skeleton, Empty } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useProducts } from '@/hooks';
import { Product } from '@/types';
import { formatPrice, getCategoryLabel, isLowStock } from '@/utils';
import { useState, useMemo } from 'react';

interface ProductGridProps {
  onAddToCart: (product: Product) => void;
}

export function ProductGrid({ onAddToCart }: ProductGridProps) {
  const { data: products, isLoading } = useProducts();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'all' | 'quincaillerie' | 'ppn'>('all');

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      if (product.stock <= 0) return false;

      const matchesSearch = product.nom
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory = category === 'all' || product.categorie === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton.Input active className="w-full" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} active paragraph={{ rows: 2 }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Search & Filter */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Rechercher un produit..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
          size="large"
          allowClear
        />
        <div className="flex gap-2">
          {(['all', 'quincaillerie', 'ppn'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-primary text-white'
                  : 'bg-surface text-foreground hover:bg-muted/20'
              }`}
            >
              {cat === 'all' ? 'Tous' : getCategoryLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <Empty description="Aucun produit disponible" className="my-8" />
      ) : (
        <div className="grid flex-1 auto-rows-max grid-cols-2 gap-3 overflow-auto md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
              onClick={() => onAddToCart(product)}
              styles={{ body: { padding: 12 } }}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="line-clamp-2 flex-1 text-sm font-medium leading-tight">
                    {product.nom}
                  </h4>
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white"
                    title="Ajouter au panier"
                  >
                    <PlusOutlined style={{ fontSize: 14 }} />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-primary">
                    {formatPrice(product.prix)}
                  </span>
                  <Tag
                    color={isLowStock(product.stock) ? 'warning' : 'default'}
                    className="m-0"
                  >
                    {product.stock}
                  </Tag>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
