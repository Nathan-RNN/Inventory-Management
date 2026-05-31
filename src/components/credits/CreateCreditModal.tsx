'use client';

import { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Table,
  App,
  Divider,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { CreditItem, CreateCreditInput } from '@/types';
import { formatPrice } from '@/utils';
import { useProducts, useCreateCredit } from '@/hooks';

interface CreateCreditModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateCreditModal({ open, onClose }: CreateCreditModalProps) {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const { data: products } = useProducts();
  const createCredit = useCreateCredit();
  const [items, setItems] = useState<CreditItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const total = items.reduce((sum, item) => sum + item.total, 0);

  const handleAddItem = () => {
    if (!selectedProductId || !products) return;
    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;

    if (quantity > product.stock) {
      message.warning(`Stock insuffisant (${product.stock} disponible)`);
      return;
    }

    const existing = items.find((i) => i.productId === product.id);
    if (existing) {
      message.warning('Produit déjà dans la liste');
      return;
    }

    setItems([
      ...items,
      {
        productId: product.id,
        productName: product.nom,
        quantity,
        unitPrice: product.prix,
        total: product.prix * quantity,
      },
    ]);
    setSelectedProductId(null);
    setQuantity(1);
  };

  const handleRemoveItem = (productId: string) => {
    setItems(items.filter((i) => i.productId !== productId));
  };

  const handleSubmit = async () => {
    if (items.length === 0) {
      message.warning('Ajoutez au moins un produit');
      return;
    }

    try {
      const values = await form.validateFields();
      const input: CreateCreditInput = {
        client: {
          nom: values.nom,
          telephone: values.telephone,
          adresse: values.adresse,
        },
        items,
        note: values.note,
      };

      const response = await createCredit.mutateAsync(input);
      if (response.success) {
        message.success('Crédit client créé — stock mis à jour');
        form.resetFields();
        setItems([]);
        onClose();
      } else {
        message.error(response.message || 'Erreur');
      }
    } catch {
      message.error('Veuillez remplir tous les champs obligatoires');
    }
  };

  const itemColumns: ColumnsType<CreditItem> = [
    { title: 'Produit', dataIndex: 'productName', key: 'productName' },
    { title: 'Qté', dataIndex: 'quantity', key: 'quantity', width: 60 },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (t: number) => formatPrice(t),
    },
    {
      title: '',
      key: 'action',
      width: 50,
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveItem(record.productId)}
        />
      ),
    },
  ];

  const availableProducts =
    products?.filter((p) => p.stock > 0 && !items.some((i) => i.productId === p.id)) ??
    [];

  return (
    <Modal
      title="Nouveau crédit client"
      open={open}
      onCancel={() => {
        form.resetFields();
        setItems([]);
        onClose();
      }}
      onOk={handleSubmit}
      okText="Créer le crédit"
      cancelText="Annuler"
      confirmLoading={createCredit.isPending}
      width={640}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <div className="grid gap-0 sm:grid-cols-2 sm:gap-4">
          <Form.Item
            name="nom"
            label="Nom du client"
            rules={[{ required: true, message: 'Nom requis' }]}
          >
            <Input placeholder="Nom complet" />
          </Form.Item>
          <Form.Item
            name="telephone"
            label="Téléphone"
            rules={[{ required: true, message: 'Téléphone requis' }]}
          >
            <Input placeholder="034 XX XXX XX" />
          </Form.Item>
        </div>
        <Form.Item name="adresse" label="Adresse (optionnel)">
          <Input placeholder="Adresse du client" />
        </Form.Item>
        <Form.Item name="note" label="Note (optionnel)">
          <Input.TextArea rows={2} placeholder="Commentaire sur le crédit..." />
        </Form.Item>
      </Form>

      <Divider>Produits</Divider>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end">
        <Select
          placeholder="Sélectionner un produit"
          className="flex-1"
          value={selectedProductId}
          onChange={setSelectedProductId}
          options={availableProducts.map((p) => ({
            value: p.id,
            label: `${p.nom} — ${formatPrice(p.prix)} (stock: ${p.stock})`,
          }))}
          showSearch
          optionFilterProp="label"
        />
        <InputNumber
          min={1}
          value={quantity}
          onChange={(v) => setQuantity(v || 1)}
          className="w-24"
        />
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={handleAddItem}
          disabled={!selectedProductId}
        >
          Ajouter
        </Button>
      </div>

      {items.length > 0 && (
        <>
          <Table
            dataSource={items}
            columns={itemColumns}
            rowKey="productId"
            pagination={false}
            size="small"
            className="mb-2"
          />
          <div className="text-right font-semibold text-primary">
            Total : {formatPrice(total)}
          </div>
        </>
      )}
    </Modal>
  );
}
