'use client';

import { useState, useMemo } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Popconfirm,
  Card,
  Empty,
  Skeleton,
  App,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useProducts, useDeleteProduct } from '@/hooks';
import { Product, ProductFilters } from '@/types';
import { formatPrice, getCategoryLabel, isLowStock } from '@/utils';
import { ProductModal } from './ProductModal';

export function ProductsTable() {
  const { message } = App.useApp();
  const { data: products, isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    categorie: 'all',
  });

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      const matchesSearch =
        product.nom.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCategory =
        filters.categorie === 'all' || product.categorie === filters.categorie;

      return matchesSearch && matchesCategory;
    });
  }, [products, filters]);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct.mutateAsync(id);
      message.success('Produit supprimé avec succès');
    } catch {
      message.error('Erreur lors de la suppression');
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const columns: ColumnsType<Product> = [
    {
      title: 'Nom',
      dataIndex: 'nom',
      key: 'nom',
      sorter: (a, b) => a.nom.localeCompare(b.nom),
      render: (nom: string, record: Product) => (
        <div>
          <span className="font-medium">{nom}</span>
          {record.description && (
            <div className="text-xs text-muted">{record.description}</div>
          )}
        </div>
      ),
    },
    {
      title: 'Catégorie',
      dataIndex: 'categorie',
      key: 'categorie',
      render: (categorie: 'quincaillerie' | 'ppn') => (
        <Tag color={categorie === 'quincaillerie' ? 'blue' : 'green'}>
          {getCategoryLabel(categorie)}
        </Tag>
      ),
      responsive: ['md'],
    },
    {
      title: 'Prix',
      dataIndex: 'prix',
      key: 'prix',
      sorter: (a, b) => a.prix - b.prix,
      render: (prix: number) => (
        <span className="font-medium">{formatPrice(prix)}</span>
      ),
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      sorter: (a, b) => a.stock - b.stock,
      render: (stock: number) => (
        <Tag color={isLowStock(stock) ? (stock <= 2 ? 'error' : 'warning') : 'default'}>
          {stock} unité(s)
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: unknown, record: Product) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Supprimer ce produit ?"
            description="Cette action est irréversible."
            onConfirm={() => handleDelete(record.id)}
            okText="Supprimer"
            cancelText="Annuler"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 8 }} />
      </Card>
    );
  }

  return (
    <>
      <Card>
        {/* Filters */}
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              placeholder="Rechercher un produit..."
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              className="w-full sm:w-64"
              allowClear
            />
            <Select
              value={filters.categorie}
              onChange={(value) => setFilters((f) => ({ ...f, categorie: value }))}
              className="w-full sm:w-48"
            >
              <Select.Option value="all">Toutes catégories</Select.Option>
              <Select.Option value="quincaillerie">Quincaillerie</Select.Option>
              <Select.Option value="ppn">PPN</Select.Option>
            </Select>
          </div>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalOpen(true)}
          >
            Ajouter un produit
          </Button>
        </div>

        {/* Table */}
        {filteredProducts.length === 0 ? (
          <Empty description="Aucun produit trouvé" />
        ) : (
          <Table
            dataSource={filteredProducts}
            columns={columns}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `${total} produit(s)`,
            }}
            scroll={{ x: 600 }}
          />
        )}
      </Card>

      <ProductModal
        open={modalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
      />
    </>
  );
}
