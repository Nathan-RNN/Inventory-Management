'use client';

import { useState } from 'react';
import { Modal, Form, InputNumber, Select, Input, message } from 'antd';
import { useAddCreditPayment } from '@/hooks';
import { Credit } from '@/types';
import { formatPrice } from '@/utils';

interface PaymentModalProps {
  credit: Credit | null;
  open: boolean;
  onClose: () => void;
}

export function PaymentModal({ credit, open, onClose }: PaymentModalProps) {
  const [form] = Form.useForm();
  const addPayment = useAddCreditPayment();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!credit) return;

    try {
      const values = await form.validateFields();
      setLoading(true);

      if (values.montant > credit.resteAPayer) {
        message.error('Le montant ne peut pas dépasser le reste à payer');
        return;
      }

      await addPayment.mutateAsync({
        creditId: credit.id,
        payment: {
          montant: values.montant,
          modePaiement: values.modePaiement,
          note: values.note,
        },
      });

      form.resetFields();
      onClose();
    } catch {
      // Form validation error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Enregistrer un paiement"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Enregistrer"
      cancelText="Annuler"
      confirmLoading={loading}
      destroyOnClose
    >
      {credit && (
        <div className="mb-4 rounded-lg bg-blue-50 p-3">
          <div className="text-sm text-gray-600">Client: <strong>{credit.client.nom}</strong></div>
          <div className="text-sm text-gray-600">
            Reste à payer: <strong className="text-red-600">{formatPrice(credit.resteAPayer)}</strong>
          </div>
        </div>
      )}

      <Form form={form} layout="vertical">
        <Form.Item
          name="montant"
          label="Montant du paiement"
          rules={[
            { required: true, message: 'Veuillez entrer le montant' },
            { type: 'number', min: 1, message: 'Le montant doit être positif' },
          ]}
        >
          <InputNumber
            className="w-full"
            placeholder="Montant en Ariary"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            parser={(value) => Number(value?.replace(/\s/g, '') || 0)}
            max={credit?.resteAPayer}
          />
        </Form.Item>

        <Form.Item
          name="modePaiement"
          label="Mode de paiement"
          rules={[{ required: true, message: 'Veuillez sélectionner le mode de paiement' }]}
          initialValue="cash"
        >
          <Select>
            <Select.Option value="cash">Espèces</Select.Option>
            <Select.Option value="mobile_money">Mobile Money</Select.Option>
            <Select.Option value="autre">Autre</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="note" label="Note (optionnel)">
          <Input.TextArea rows={2} placeholder="Note sur ce paiement..." />
        </Form.Item>
      </Form>
    </Modal>
  );
}
