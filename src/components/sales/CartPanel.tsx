'use client';

import { Button, InputNumber, Empty, Divider, App } from 'antd';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { CartItem, SaleItem } from '@/types';
import { formatPrice } from '@/utils';
import { useCreateSale } from '@/hooks';
import { useState } from 'react';

interface CartPanelProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export function CartPanel({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartPanelProps) {
  const { message } = App.useApp();
  const createSale = useCreateSale();
  const [montantPaye, setMontantPaye] = useState<number | null>(null);

  const total = items.reduce(
    (sum, item) => sum + item.product.prix * item.quantity,
    0
  );

  const rendu = montantPaye ? Math.max(0, montantPaye - total) : 0;
  const isPaymentSufficient = montantPaye !== null && montantPaye >= total;

  const handleValidateSale = async () => {
    if (items.length === 0) {
      message.warning('Le panier est vide');
      return;
    }

    if (!isPaymentSufficient) {
      message.warning('Le montant payé est insuffisant');
      return;
    }

    try {
      const saleItems: SaleItem[] = items.map((item) => ({
        productId: item.product.id,
        productName: item.product.nom,
        quantity: item.quantity,
        unitPrice: item.product.prix,
        total: item.product.prix * item.quantity,
      }));

      await createSale.mutateAsync({
        items: saleItems,
        total,
        montantPaye: montantPaye || 0,
        rendu,
        date: new Date().toISOString(),
        status: 'completed',
      });

      message.success('Vente enregistrée avec succès');
      onClearCart();
      setMontantPaye(null);
    } catch {
      message.error("Erreur lors de l'enregistrement de la vente");
    }
  };

  return (
    <div className="flex h-full flex-col bg-surface">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Panier</h3>
          {items.length > 0 && (
            <Button type="text" danger size="small" onClick={onClearCart}>
              Vider
            </Button>
          )}
        </div>
        <p className="text-sm text-muted">
          {items.length} article(s)
        </p>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-auto p-4">
        {items.length === 0 ? (
          <Empty
            description="Panier vide"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className="my-8"
          />
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-3 rounded-lg bg-background p-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">{item.product.nom}</p>
                  <p className="text-sm text-muted">
                    {formatPrice(item.product.prix)} x {item.quantity}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    size="small"
                    icon={<MinusOutlined />}
                    onClick={() =>
                      onUpdateQuantity(item.product.id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                  />
                  <InputNumber
                    size="small"
                    min={1}
                    max={item.product.stock}
                    value={item.quantity}
                    onChange={(val) =>
                      val && onUpdateQuantity(item.product.id, val)
                    }
                    className="w-14 text-center"
                    controls={false}
                  />
                  <Button
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() =>
                      onUpdateQuantity(item.product.id, item.quantity + 1)
                    }
                    disabled={item.quantity >= item.product.stock}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-semibold text-primary">
                    {formatPrice(item.product.prix * item.quantity)}
                  </span>
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => onRemoveItem(item.product.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer - Payment */}
      <div className="border-t border-border p-4">
        <div className="mb-4 flex flex-col gap-2">
          <div className="flex justify-between text-lg">
            <span>Total</span>
            <span className="font-bold text-primary">{formatPrice(total)}</span>
          </div>

          <Divider className="my-2" />

          <div className="flex items-center justify-between gap-4">
            <span>Montant reçu</span>
            <InputNumber
              value={montantPaye}
              onChange={(val) => setMontantPaye(val)}
              placeholder="0"
              min={0}
              className="w-32"
              size="large"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
              }
              parser={(value) => Number(value?.replace(/\s/g, '') || 0)}
            />
          </div>

          {montantPaye !== null && montantPaye > 0 && (
            <div className="flex justify-between text-lg">
              <span>Rendu</span>
              <span
                className={`font-bold ${
                  isPaymentSufficient ? 'text-accent' : 'text-red-500'
                }`}
              >
                {isPaymentSufficient
                  ? formatPrice(rendu)
                  : `Manque ${formatPrice(total - montantPaye)}`}
              </span>
            </div>
          )}
        </div>

        <Button
          type="primary"
          size="large"
          block
          onClick={handleValidateSale}
          disabled={items.length === 0 || !isPaymentSufficient}
          loading={createSale.isPending}
          className="h-14 text-lg font-semibold"
        >
          Valider la vente
        </Button>
      </div>
    </div>
  );
}
