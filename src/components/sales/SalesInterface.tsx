"use client";

import { useState, useCallback } from "react";
import { Drawer, Button, Badge } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { ProductGrid } from "./ProductGrid";
import { CartPanel } from "./CartPanel";
import { CartItem, Product } from "@/types";

export function SalesInterface() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const addToCart = useCallback((product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);

      if (existing) {
        // Don't exceed stock
        if (existing.quantity >= product.stock) return prev;

        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity: Math.max(1, Math.min(quantity, item.product.stock)),
            }
          : item,
      ),
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setCartItems((prev) =>
      prev.filter((item) => item.product.id !== productId),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex h-[calc(100vh-128px)] gap-4">
      {/* Product Grid - Full width on mobile, 2/3 on desktop */}
      <div className="flex-1 overflow-hidden rounded-xl bg-surface p-4">
        <ProductGrid onAddToCart={addToCart} />
      </div>

      {/* Cart Panel - Hidden on mobile, visible on desktop */}
      <div className="hidden w-96 overflow-hidden rounded-xl shadow-lg lg:block">
        <CartPanel
          items={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onClearCart={clearCart}
        />
      </div>

      {/* Mobile Cart Button */}
      <div className="fixed bottom-4 right-4 lg:hidden">
        <Badge count={totalItems} offset={[-5, 5]}>
          <Button
            type="primary"
            size="large"
            icon={<ShoppingCartOutlined />}
            onClick={() => setDrawerOpen(true)}
            className="h-14 w-14 rounded-full shadow-lg"
          />
        </Badge>
      </div>

      {/* Mobile Cart Drawer */}
      <Drawer
        title="Panier"
        placement="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size="100%"
        styles={{ body: { padding: 0 } }}
        className="lg:hidden"
      >
        <CartPanel
          items={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onClearCart={clearCart}
        />
      </Drawer>
    </div>
  );
}
