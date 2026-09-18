import { create } from "zustand";
import { getCart } from "../services/cartService";

const useCartStore = create((set) => ({
  cart: null,
  items: [],
  cartCount: 0,
  loading: false,

  fetchCart: async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      set({
        cart: null,
        items: [],
        cartCount: 0,
      });

      return;
    }

    try {
      set({ loading: true });

      const cart = await getCart();

      const items = cart?.items || [];

      const cartCount = items.reduce(
        (total, item) => total + item.quantity,
        0
      );

      set({
        cart,
        items,
        cartCount,
      });
    } catch (error) {
      console.error("FETCH CART ERROR:", error);

      set({
        cart: null,
        items: [],
        cartCount: 0,
      });
    } finally {
      set({ loading: false });
    }
  },

  setCart: (cart) => {
    const items = cart?.items || [];

    const cartCount = items.reduce(
      (total, item) => total + item.quantity,
      0
    );

    set({
      cart,
      items,
      cartCount,
    });
  },

  clearCart: () => {
    set({
      cart: null,
      items: [],
      cartCount: 0,
    });
  },
}));

export default useCartStore;