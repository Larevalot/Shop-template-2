import { atom, computed } from 'nanostores';

export interface CartItem {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
}

const CART_KEY = 'mimo-cart';

function loadCart(): Record<string, CartItem> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveCart(items: Record<string, CartItem>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // localStorage full or unavailable
  }
}

export const cartItems = atom<Record<string, CartItem>>({});

let cartInitialized = false;

export function initCart() {
  const stored = loadCart();
  cartItems.set(stored);
  cartInitialized = true;
}

cartItems.subscribe((items) => {
  if (cartInitialized) {
    saveCart(items);
  }
});

export function addToCart(item: Omit<CartItem, 'cantidad'>) {
  const current = cartItems.get();
  const existing = current[item.id];

  if (existing) {
    cartItems.set({
      ...current,
      [item.id]: { ...existing, cantidad: existing.cantidad + 1 },
    });
  } else {
    cartItems.set({
      ...current,
      [item.id]: { ...item, cantidad: 1 },
    });
  }
}

export function removeFromCart(id: string) {
  const current = { ...cartItems.get() };
  delete current[id];
  cartItems.set(current);
}

export function updateQuantity(id: string, cantidad: number) {
  const current = cartItems.get();
  if (cantidad <= 0) {
    removeFromCart(id);
    return;
  }
  if (current[id]) {
    cartItems.set({
      ...current,
      [id]: { ...current[id], cantidad },
    });
  }
}

export function clearCart() {
  cartItems.set({});
}

export const cartCount = computed(cartItems, (items) =>
  Object.values(items).reduce((sum, item) => sum + item.cantidad, 0)
);

export const cartTotal = computed(cartItems, (items) =>
  Object.values(items).reduce((sum, item) => sum + item.precio * item.cantidad, 0)
);

// WhatsApp helpers
const WHATSAPP_NUMBER = import.meta.env.PUBLIC_WHATSAPP_NUMBER || '1234567890';

export function buildWhatsAppMessage(items: CartItem[], notes?: string): string {
  let message = '🛒 *Nuevo Pedido*\n\n';

  items.forEach((item) => {
    const subtotal = (item.precio * item.cantidad).toFixed(2);
    message += `• ${item.nombre} x${item.cantidad} - $${subtotal}\n`;
  });

  const total = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  message += `\n💰 *Total: $${total.toFixed(2)}*`;

  if (notes && notes.trim()) {
    message += `\n\n📝 *Notas:* ${notes.trim()}`;
  }

  return message;
}

export function getWhatsAppURL(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}
