"use client";

import { Modal, Form, InputNumber, Select, Input, App } from "antd";

import { ClientCredit, PaymentMethod, RecordCreditPaymentInput } from "@/types";

import { formatPrice } from "@/utils";
import { useRecordCreditPayment } from "@/hooks";

interface CreditPaymentModalProps {
  credit: ClientCredit | null;
  open: boolean;
  onClose: () => void;
}

export function CreditPaymentModal({
  credit,
  open,
  onClose,
}: CreditPaymentModalProps) {
  const { message } = App.useApp();

  const [form] = Form.useForm();

  const recordPayment = useRecordCreditPayment();

  const handleSubmit = async () => {
    if (!credit) return;

    try {
      const values = await form.validateFields();

      const input: RecordCreditPaymentInput = {
        creditId: credit.id,
        montant: values.montant,
        modePaiement: values.modePaiement as PaymentMethod,
        note: values.note,
      };

      const response = await recordPayment.mutateAsync(input);

      if (response.success) {
        message.success("Paiement enregistré avec succès");

        form.resetFields();
        onClose();
      } else {
        message.error(response.message || "Erreur lors du paiement");
      }
    } catch {
      message.error("Veuillez vérifier les champs du formulaire");
    }
  };

  return (
    <Modal
      title={`Enregistrer un paiement — ${credit?.client.nom ?? ""}`}
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={handleSubmit}
      okText="Enregistrer"
      cancelText="Annuler"
      confirmLoading={recordPayment.isPending}
      destroyOnHidden
    >
      {credit && (
        <div className="mb-4 rounded-lg bg-background p-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted">Reste à payer</span>

            <span className="font-semibold text-primary">
              {formatPrice(credit.resteAPayer)}
            </span>
          </div>
        </div>
      )}

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          modePaiement: "cash",
        }}
      >
        {/* MONTANT */}
        <Form.Item
          name="montant"
          label="Montant payé"
          rules={[
            {
              required: true,
              message: "Montant requis",
            },
            {
              type: "number",
              min: 1,
              message: "Montant invalide",
            },
            {
              validator: (_, value) => {
                if (!credit || value === undefined) {
                  return Promise.resolve();
                }

                if (value > credit.resteAPayer) {
                  return Promise.reject(
                    new Error(
                      `Le montant ne peut pas dépasser ${formatPrice(
                        credit.resteAPayer,
                      )}`,
                    ),
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber<number>
            className="w-full"
            min={1}
            addonAfter="Ar"
            formatter={(value) =>
              value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : ""
            }
            parser={(value) => Number((value ?? "").replace(/\s/g, ""))}
          />
        </Form.Item>

        {/* MODE PAIEMENT */}
        <Form.Item
          name="modePaiement"
          label="Mode de paiement"
          rules={[
            {
              required: true,
              message: "Mode requis",
            },
          ]}
        >
          <Select
            options={[
              {
                value: "cash",
                label: "Espèces",
              },
              {
                value: "mobile_money",
                label: "Mobile Money",
              },
              {
                value: "transfer",
                label: "Virement",
              },
              {
                value: "other",
                label: "Autre",
              },
            ]}
          />
        </Form.Item>

        {/* NOTE */}
        <Form.Item name="note" label="Note (optionnel)">
          <Input.TextArea rows={2} placeholder="Référence, commentaire..." />
        </Form.Item>
      </Form>
    </Modal>
  );
}
