"use client";

import { Modal, Form, Input, InputNumber, Select, App } from "antd";
import { useCreateProduct, useUpdateProduct } from "@/hooks";
import { Product, ProductFormData } from "@/types";
import { useEffect } from "react";

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
}

export function ProductModal({ open, onClose, product }: ProductModalProps) {
  const [form] = Form.useForm<ProductFormData>();
  const { message } = App.useApp();

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const isEditing = !!product;

  useEffect(() => {
    if (open && product) {
      form.setFieldsValue({
        nom: product.nom,
        prix: product.prix,
        stock: product.stock,
        categorie: product.categorie,
        description: product.description,
      });
    } else if (open) {
      form.resetFields();
    }
  }, [open, product, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (isEditing && product) {
        await updateProduct.mutateAsync({
          id: product.id,
          data: values,
        });
        message.success("Produit mis à jour avec succès");
      } else {
        await createProduct.mutateAsync(values);
        message.success("Produit créé avec succès");
      }

      form.resetFields();
      onClose();
    } catch {
      // erreurs de validation gérées par Ant Design
    }
  };

  return (
    <Modal
      title={isEditing ? "Modifier le produit" : "Nouveau produit"}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText={isEditing ? "Mettre à jour" : "Créer"}
      cancelText="Annuler"
      confirmLoading={createProduct.isPending || updateProduct.isPending}
      destroyOnClose
      width={500}
    >
      <Form form={form} layout="vertical" className="mt-4">
        {/* NOM */}
        <Form.Item
          name="nom"
          label="Nom du produit"
          rules={[{ required: true, message: "Le nom est requis" }]}
        >
          <Input placeholder="Ex: Marteau, Clous, Biscuits..." />
        </Form.Item>

        {/* PRIX + STOCK */}
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="prix"
            label="Prix (Ar)"
            rules={[{ required: true, message: "Le prix est requis" }]}
          >
            <InputNumber<number>
              placeholder="0"
              min={0}
              className="w-full"
              formatter={(value) =>
                value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : ""
              }
              parser={(value) => Number((value ?? "").replace(/\s/g, ""))}
            />
          </Form.Item>

          <Form.Item
            name="stock"
            label="Stock"
            rules={[{ required: true, message: "Le stock est requis" }]}
          >
            <InputNumber<number> placeholder="0" min={0} className="w-full" />
          </Form.Item>
        </div>

        {/* CATEGORIE */}
        <Form.Item
          name="categorie"
          label="Catégorie"
          rules={[{ required: true, message: "La catégorie est requise" }]}
        >
          <Select placeholder="Sélectionner une catégorie">
            <Select.Option value="quincaillerie">Quincaillerie</Select.Option>
            <Select.Option value="ppn">
              PPN (Produits de Première Nécessité)
            </Select.Option>
          </Select>
        </Form.Item>

        {/* DESCRIPTION */}
        <Form.Item name="description" label="Description">
          <Input.TextArea
            rows={3}
            placeholder="Description du produit (optionnel)"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
