import {
  cartItems,
  cartCount,
  cartTotal,
  addToCart,
  removeFromCart,
  updateQuantity,
  initCart,
  buildWhatsAppMessage,
  getWhatsAppURL,
} from './cart';

// Initialize cart from localStorage
initCart();

// DOM references
const cartIcon = document.getElementById('cart-icon');
const cartCountEl = document.getElementById('cart-count');
const cartOverlay = document.getElementById('cart-overlay');
const cartDrawer = document.getElementById('cart-drawer');
const closeDrawerBtn = document.getElementById('close-drawer');
const cartItemsList = document.getElementById('cart-items-list');
const emptyCartEl = document.getElementById('empty-cart');
const cartTotalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn') as HTMLButtonElement | null;
const cartNotes = document.getElementById('cart-notes') as HTMLTextAreaElement | null;
const globalToast = document.getElementById('global-toast');
const toastMessage = document.getElementById('toast-message');

// --- Global toast ---
let toastTimeout: ReturnType<typeof setTimeout> | null = null;

function showToast(message: string) {
  if (!globalToast || !toastMessage) return;
  if (toastTimeout) clearTimeout(toastTimeout);

  toastMessage.textContent = message;
  globalToast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
  globalToast.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');

  toastTimeout = setTimeout(() => {
    globalToast.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
    globalToast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
  }, 2000);
}

// --- Cart icon counter ---
cartCount.subscribe((count) => {
  if (!cartCountEl) return;
  cartCountEl.textContent = String(count);
  cartCountEl.classList.toggle('opacity-0', count === 0);
  cartCountEl.classList.toggle('opacity-100', count > 0);
});

// --- Open / close drawer ---
function openDrawer() {
  cartDrawer?.classList.remove('translate-x-full');
  cartOverlay?.classList.remove('opacity-0', 'pointer-events-none');
}

function closeDrawer() {
  cartDrawer?.classList.add('translate-x-full');
  cartOverlay?.classList.add('opacity-0', 'pointer-events-none');
}

cartIcon?.addEventListener('click', openDrawer);
cartOverlay?.addEventListener('click', closeDrawer);
closeDrawerBtn?.addEventListener('click', closeDrawer);

// --- Render cart items ---
function renderCart() {
  const items = Object.values(cartItems.get());

  if (items.length === 0) {
    emptyCartEl?.classList.remove('hidden');
    if (cartItemsList) cartItemsList.innerHTML = '';
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  emptyCartEl?.classList.add('hidden');
  if (checkoutBtn) checkoutBtn.disabled = false;

  if (!cartItemsList) return;

  cartItemsList.innerHTML = items
    .map(
      (item) => `
    <div class="flex gap-4 p-3 bg-gray-50 rounded-lg" data-item-id="${item.id}">
      <img src="${item.imagen}" alt="${item.nombre}" class="w-20 h-20 object-cover rounded-md" />
      <div class="flex-1 min-w-0">
        <h4 class="font-medium text-gray-900 truncate">${item.nombre}</h4>
        <p class="text-sm text-gray-500">$${item.precio.toFixed(2)} c/u</p>
        <div class="flex items-center gap-2 mt-2">
          <button
            class="qty-btn w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors font-bold"
            data-id="${item.id}"
            data-action="decrease"
          >−</button>
          <span class="w-8 text-center font-bold text-gray-800">${item.cantidad}</span>
          <button
            class="qty-btn w-8 h-8 flex items-center justify-center bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors font-bold"
            data-id="${item.id}"
            data-action="increase"
          >+</button>
        </div>
      </div>
      <div class="flex flex-col items-end justify-between">
        <button class="remove-btn text-gray-400 hover:text-red-500 transition-colors" data-id="${item.id}" aria-label="Eliminar ${item.nombre}">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        <span class="font-bold text-brand-600">$${(item.precio * item.cantidad).toFixed(2)}</span>
      </div>
    </div>
  `
    )
    .join('');

  // Attach quantity listeners
  cartItemsList.querySelectorAll('.qty-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const el = btn as HTMLElement;
      const id = el.dataset.id!;
      const action = el.dataset.action;
      const item = cartItems.get()[id];
      if (item) {
        updateQuantity(id, action === 'increase' ? item.cantidad + 1 : item.cantidad - 1);
      }
    });
  });

  // Attach remove listeners
  cartItemsList.querySelectorAll('.remove-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.id!;
      removeFromCart(id);
    });
  });
}

cartItems.subscribe(renderCart);

// --- Total ---
cartTotal.subscribe((total) => {
  if (cartTotalEl) cartTotalEl.textContent = `$${total.toFixed(2)}`;
});

// --- WhatsApp checkout ---
checkoutBtn?.addEventListener('click', () => {
  const items = Object.values(cartItems.get());
  const notes = cartNotes?.value || '';
  const message = buildWhatsAppMessage(items, notes);
  const url = getWhatsAppURL(message);
  window.open(url, '_blank');
});

// --- Add-to-cart buttons (event delegation) ---
document.addEventListener('click', (e) => {
  const btn = (e.target as HTMLElement).closest('.add-to-cart-btn') as HTMLElement | null;
  if (!btn) return;

  e.preventDefault();
  e.stopPropagation();

  const { id, nombre, precio, imagen } = btn.dataset;
  if (!id || !nombre || !precio || !imagen) return;

  addToCart({ id, nombre, precio: parseFloat(precio), imagen });
  showToast(`${nombre} agregado`);
});

// --- Detail page add-to-cart ---
document.addEventListener('click', (e) => {
  const btn = (e.target as HTMLElement).closest('.add-to-cart-detail') as HTMLElement | null;
  if (!btn) return;

  const { id, nombre, precio, imagen } = btn.dataset;
  if (!id || !nombre || !precio || !imagen) return;

  addToCart({ id, nombre, precio: parseFloat(precio), imagen });
  showToast(`${nombre} agregado`);
});
