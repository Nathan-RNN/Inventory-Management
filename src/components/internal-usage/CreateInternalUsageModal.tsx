'use client';

import { Modal, Form, Select, InputNumber, Input, App } from 'antd';
import {
  CreateInternalUsageInput,
  InternalUsageReason,
} from '@/types';
import { useProducts, useCreateInternalUsage } from '@/hooks';

interface CreateInternalUsageModalProps {
  open: boolean;
  onClose: () => void;
}

const MOTIF_OPTIONS: { value: InternalUsageReason; label: string }[] = [
  { value: 'usage_maison', label: 'Usage maison' },
  { value: 'cadeau_client', label: 'Cadeau client' },
  { value: 'produit_casse', label: 'Produit cassé' },
  { value: 'perte', label: 'Perte' },
  { value: 'echantillon', label: 'Échantillon' },
  { value: 'autre', label: 'Autre' },
];

export function CreateInternalUsageModal({
  open,
  onClose,
}: CreateInternalUsageModalProps) {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const { data: products } = useProducts();
  const createUsage = useCreateInternalUsage();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const input: CreateInternalUsageInput = {
        productId: values.productId,
        quantity: values.quantity,
        motif: values.motif as InternalUsageReason,
        note: values.note,
        responsable: values.responsable || 'Propriétaire',
      };

      const response = await createUsage.mutateAsync(input);
      if (response.success) {
        message.success('Sortie interne enregistrée — stock mis à jour');
        form.resetFields();
        onClose();
      } else {
        message.error(response.message || 'Erreur');
      }
    } catch {
      message.error('Veuillez remplir tous les champs obligatoires');
    }
  };

  return (
    <Modal
      title="Nouvelle sortie interne"
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={handleSubmit}
      okText="Enregistrer"
      cancelText="Annuler"
      confirmLoading={createUsage.isPending}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ responsable: 'Propriétaire', quantity: 1 }}
      >
        <Form.Item
          name="productId"
          label="Produit"
          rules={[{ required: true, message: 'Produit requis' }]}
        >
          <Select
            placeholder="Sélectionner un produit"
            showSearch
            optionFilterProp="label"
            options={products
              ?.filter((p) => p.stock > 0)
              .map((p) => ({
                value: p.id,
                label: `${p.nom} (stock: ${p.stock})`,
              }))}
          />
        </Form.Item>

        <Form.Item
          name="quantity"
          label="Quantité"
          rules={[
            { required: true, message: 'Quantité requise' },
            { type: 'number', min: 1, message: 'Minimum 1' },
          ]}
        >
          <InputNumber min={1} className="w-full" />
        </Form.Item>

        <Form.Item
          name="motif"
          label="Motif"
          rules={[{ required: true, message: 'Motif obligatoire' }]}
        >
          <Select placeholder="Sélectionner un motif" options={MOTIF_OPTIONS} />
        </Form.Item>

        <Form.Item name="responsable" label="Responsable">
          <Input placeholder="Propriétaire" />
        </Form.Item>

        <Form.Item name="note" label="Note (optionnel)">
          <Input.TextArea rows={2} placeholder="Détails supplémentaires..." />
        </Form.Item>
      </Form>
    </Modal>
  );
}
