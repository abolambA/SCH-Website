/**
 * SpeedCubeHub Cart — Full Shopify AJAX Integration
 * Handles: add to cart, drawer, badge count, cart page qty controls
 */

const SCHCart = {
  // ── Fetch current cart from Shopify ──────────────────────────────────────
  async getCart() {
    const res = await fetch('/cart.js');
    return res.json();
  },

  // ── Add item to cart ──────────────────────────────────────────────────────
  async addItem(variantId, quantity = 1) {
    const res = await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ items: [{ id: parseInt(variantId), quantity: parseInt(quantity) }] })
    });
    if (!res.ok) throw new Error('Could not add item to cart');
    return res.json();
  },

  // ── Update item quantity ──────────────────────────────────────────────────
  async updateItem(lineIndex, quantity) {
    const res = await fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ line: lineIndex, quantity: parseInt(quantity) })
    });
    return res.json();
  },

  // ── Remove item ──────────────────────────────────────────────────────────
  async removeItem(lineIndex) {
    return this.updateItem(lineIndex, 0);
  },

  // ── Update badge count in header ─────────────────────────────────────────
  updateBadge(count) {
    document.querySelectorAll('.header-cart-badge').forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  },

  // ── Render cart drawer contents ──────────────────────────────────────────
  renderDrawer(cart) {
    const body = document.querySelector('.cart-drawer__body');
    const subtotalEl = document.querySelector('.cart-drawer__price');
    const titleEl = document.querySelector('.cart-drawer__title');
    const progressFill = document.querySelector('.cart-drawer__progress-fill');
    const progressText = document.querySelector('.cart-drawer__progress-text');

    if (titleEl) titleEl.textContent = `Your Cart (${cart.item_count})`;
    if (subtotalEl) subtotalEl.textContent = this.formatMoney(cart.total_price);

    // Free shipping progress (free at 36700 = ~100 AED)
    const FREE_SHIPPING_CENTS = 36700;
    const pct = Math.min(100, (cart.total_price / FREE_SHIPPING_CENTS) * 100);
    if (progressFill) progressFill.style.width = pct + '%';
    if (progressText) {
      const remaining = FREE_SHIPPING_CENTS - cart.total_price;
      progressText.innerHTML = remaining > 0
        ? `<strong class="color-primary">${this.formatMoney(remaining)}</strong> away from free shipping`
        : `<strong class="color-primary">🎉 You qualify for free shipping!</strong>`;
    }

    if (!body) return;

    if (cart.item_count === 0) {
      body.innerHTML = `
        <div class="cart-drawer__empty text-center">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity:0.25;margin:0 auto 1rem;display:block;"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          <h3 class="font-display" style="margin-bottom:1rem;">Your cart is empty</h3>
          <a href="/collections/all" class="btn btn-purchase">Shop Now</a>
        </div>`;
      return;
    }

    body.innerHTML = `<div class="cart-items">${cart.items.map((item, idx) => `
      <div class="cart-item" data-line="${idx + 1}">
        <a href="${item.url}" class="cart-item__img-wrap">
          <img src="${item.image ? item.image.replace('http:', 'https:') : ''}" alt="${item.title}" class="cart-item__img" loading="lazy">
        </a>
        <div class="cart-item__info">
          <a href="${item.url}" class="cart-item__title">${item.product_title}</a>
          ${item.variant_title && item.variant_title !== 'Default Title' ? `<div class="cart-item__variant">${item.variant_title}</div>` : ''}
          <div class="cart-item__price">${this.formatMoney(item.final_line_price)}</div>
          <div class="cart-item__controls">
            <div class="cart-qty">
              <button class="cart-qty__btn" onclick="SCHCart.changeQty(${idx + 1}, ${item.quantity - 1})">−</button>
              <span class="cart-qty__val">${item.quantity}</span>
              <button class="cart-qty__btn" onclick="SCHCart.changeQty(${idx + 1}, ${item.quantity + 1})">+</button>
            </div>
            <button class="cart-item__remove" onclick="SCHCart.changeQty(${idx + 1}, 0)">Remove</button>
          </div>
        </div>
      </div>`).join('')}</div>`;
  },

  // ── Change qty from drawer ────────────────────────────────────────────────
  async changeQty(lineIndex, newQty) {
    try {
      const cart = await this.updateItem(lineIndex, newQty);
      this.updateBadge(cart.item_count);
      this.renderDrawer(cart);
    } catch (e) { console.error(e); }
  },

  // ── Format money (Shopify sends cents) ──────────────────────────────────
  formatMoney(cents) {
    const amount = (cents / 100).toFixed(2);
    const fmt = window.theme?.moneyFormat || 'Dhs. {{amount}}';
    return fmt.replace('{{amount}}', amount).replace('{{amount_no_decimals}}', Math.floor(cents/100));
  },

  // ── Init on page load ────────────────────────────────────────────────────
  async init() {
    try {
      const cart = await this.getCart();
      this.updateBadge(cart.item_count);
      this.renderDrawer(cart);
    } catch (e) { console.error('Cart init error:', e); }
  }
};

// ── CartDrawer custom element ─────────────────────────────────────────────
class CartDrawer extends HTMLElement {
  constructor() {
    super();
    this.drawerEl = document.querySelector('.cart-drawer');
    this.overlayEl = document.querySelector('.cart-overlay');
    this.closeBtn = this.querySelector('.cart-drawer__close');
    this.bindEvents();
  }

  bindEvents() {
    document.querySelectorAll('[data-cart-trigger]').forEach(btn => {
      btn.addEventListener('click', e => { e.preventDefault(); this.open(); });
    });
    if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
    if (this.overlayEl) this.overlayEl.addEventListener('click', () => this.close());
    document.addEventListener('keyup', e => { if (e.key === 'Escape') this.close(); });
  }

  open() {
    if (!this.drawerEl) return;
    this.drawerEl.classList.add('is-open');
    if (this.overlayEl) this.overlayEl.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    SCHCart.init(); // refresh on open
  }

  close() {
    if (!this.drawerEl) return;
    this.drawerEl.classList.remove('is-open');
    if (this.overlayEl) this.overlayEl.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  // ── Static method called by Add to Cart button ────────────────────────
  static async addProduct(variantId, quantity = 1, buttonElement = null) {
    if (buttonElement) {
      const originalHTML = buttonElement.innerHTML;
      buttonElement.disabled = true;
      buttonElement.innerHTML = '<span style="display:inline-flex;align-items:center;gap:6px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Adding...</span>';
      try {
        await SCHCart.addItem(variantId, quantity);
        const cart = await SCHCart.getCart();
        SCHCart.updateBadge(cart.item_count);
        SCHCart.renderDrawer(cart);
        buttonElement.innerHTML = '<span style="display:inline-flex;align-items:center;gap:6px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Added!</span>';
        buttonElement.style.background = '#16a34a';
        setTimeout(() => {
          buttonElement.innerHTML = originalHTML;
          buttonElement.disabled = false;
          buttonElement.style.background = '';
          const drawer = document.querySelector('cart-drawer');
          if (drawer) drawer.open();
        }, 1200);
      } catch (err) {
        console.error('Add to cart failed:', err);
        buttonElement.innerHTML = 'Error — try again';
        buttonElement.disabled = false;
        setTimeout(() => { buttonElement.innerHTML = originalHTML; }, 2000);
      }
    } else {
      try {
        await SCHCart.addItem(variantId, quantity);
        const cart = await SCHCart.getCart();
        SCHCart.updateBadge(cart.item_count);
        SCHCart.renderDrawer(cart);
        const drawer = document.querySelector('cart-drawer');
        if (drawer) drawer.open();
      } catch (err) { console.error(err); }
    }
  }
}

customElements.define('cart-drawer', CartDrawer);

// ── Boot ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  SCHCart.init();

  // Cart page qty controls (for /cart page)
  document.querySelectorAll('.cart-page-qty-minus').forEach(btn => {
    btn.addEventListener('click', async function() {
      const line = parseInt(this.dataset.line);
      const current = parseInt(this.closest('.cart-page-item').querySelector('.cart-page-qty-val').textContent);
      if (current <= 1) return;
      await SCHCart.updateItem(line, current - 1);
      location.reload();
    });
  });

  document.querySelectorAll('.cart-page-qty-plus').forEach(btn => {
    btn.addEventListener('click', async function() {
      const line = parseInt(this.dataset.line);
      const current = parseInt(this.closest('.cart-page-item').querySelector('.cart-page-qty-val').textContent);
      await SCHCart.updateItem(line, current + 1);
      location.reload();
    });
  });

  document.querySelectorAll('.cart-page-remove').forEach(btn => {
    btn.addEventListener('click', async function() {
      const line = parseInt(this.dataset.line);
      await SCHCart.removeItem(line);
      location.reload();
    });
  });
});
