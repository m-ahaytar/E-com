/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import {
  addCartItem,
  clearCartItems,
  getCart,
  removeCartItem,
  updateCartItem,
} from '../services/orderService';

const CartContext = createContext({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getTotal: () => 0,
});

const CART_STORAGE_KEY = 'cart';

const safeQuantity = (quantity) => Math.max(1, Number(quantity) || 1);

const normalizeCartItem = (item) => {
  const id = Number(item?.id ?? item?.productId);
  const categoryName = item?.category?.name || item?.categoryName || item?.category || '';

  return {
    id,
    productId: id,
    name: item?.name || item?.productName || 'Product',
    description: item?.description || '',
    price: Number(item?.price || 0),
    originalPrice: item?.originalPrice ? Number(item.originalPrice) : null,
    quantity: safeQuantity(item?.quantity),
    stock: Number(item?.stock ?? 0),
    imageUrl: item?.imageUrl || '',
    categoryId: item?.categoryId ?? item?.category?.id ?? null,
    category: categoryName,
    categoryName,
    dealId: item?.dealId ?? null,
  };
};

const getStoredCart = () => {
  const storedCart = localStorage.getItem(CART_STORAGE_KEY);

  if (!storedCart) {
    return [];
  }

  try {
    const parsedItems = JSON.parse(storedCart);
    return Array.isArray(parsedItems) ? parsedItems.map(normalizeCartItem) : [];
  } catch (error) {
    console.warn('Invalid stored cart data, clearing cart.', error);
    localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  }
};

const mapApiCartToItems = (cartPayload) => {
  if (!Array.isArray(cartPayload?.items)) {
    return [];
  }
  return cartPayload.items.map(normalizeCartItem);
};

const toApiCartItem = (product, quantity) => {
  const normalizedProduct = normalizeCartItem({ ...product, quantity });
  return {
    productId: normalizedProduct.productId,
    productName: normalizedProduct.name,
    description: normalizedProduct.description,
    price: normalizedProduct.price,
    originalPrice: normalizedProduct.originalPrice,
    quantity: normalizedProduct.quantity,
    stock: normalizedProduct.stock,
    imageUrl: normalizedProduct.imageUrl,
    categoryId: normalizedProduct.categoryId,
    categoryName: normalizedProduct.categoryName,
    dealId: normalizedProduct.dealId,
  };
};

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [items, setItems] = useState(getStoredCart);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const syncRemoteCart = async () => {
      try {
        const remoteCart = await getCart();
        setItems(mapApiCartToItems(remoteCart));
      } catch (error) {
        console.warn('Failed to sync cart from cart API, using local cart state.', error);
      }
    };

    syncRemoteCart();
  }, [token]);

  const addToCart = async (product, quantity = 1) => {
    const normalizedProduct = normalizeCartItem({ ...product, quantity: safeQuantity(quantity) });

    if (token) {
      try {
        const updatedCart = await addCartItem(toApiCartItem(product, quantity));
        setItems(mapApiCartToItems(updatedCart));
        return;
      } catch (error) {
        console.error('Failed to add item through cart API, using local cart state.', error);
      }
    }

    setItems((prev) => {
      const existing = prev.find((item) => item.id === normalizedProduct.id && item.dealId === normalizedProduct.dealId);
      if (existing) {
        return prev.map((item) => (
          item.id === normalizedProduct.id && item.dealId === normalizedProduct.dealId
            ? { ...item, quantity: item.quantity + normalizedProduct.quantity }
            : item
        ));
      }
      return [...prev, normalizedProduct];
    });
  };

  const removeFromCart = async (productId) => {
    if (token) {
      try {
        const updatedCart = await removeCartItem(productId);
        setItems(mapApiCartToItems(updatedCart));
        return;
      } catch (error) {
        console.error('Failed to remove item through cart API, using local cart state.', error);
      }
    }

    setItems((prev) => {
      return prev.filter((item) => item.id !== productId);
    });
  };

  const updateQuantity = async (productId, quantity) => {
    const normalizedQuantity = safeQuantity(quantity);

    if (token) {
      try {
        const updatedCart = await updateCartItem(productId, normalizedQuantity);
        setItems(mapApiCartToItems(updatedCart));
        return;
      } catch (error) {
        console.error('Failed to update quantity through cart API, using local cart state.', error);
      }
    }

    setItems((prev) => {
      return prev.map((item) => (
        item.id === productId ? { ...item, quantity: normalizedQuantity } : item
      ));
    });
  };

  const clearCart = async () => {
    if (token) {
      try {
        const updatedCart = await clearCartItems();
        setItems(mapApiCartToItems(updatedCart));
        localStorage.removeItem(CART_STORAGE_KEY);
        return;
      } catch (error) {
        console.error('Failed to clear cart through cart API, using local cart state.', error);
      }
    }

    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const getTotal = () => {
    return items.reduce(
      (sum, item) => sum + Number(item.price || 0) * safeQuantity(item.quantity),
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
