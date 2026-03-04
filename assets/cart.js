/**
 * AJAX Cart Drawer Logic
 */

class CartDrawer extends HTMLElement {
    constructor() {
        super();
        this.drawer = document.querySelector('.cart-drawer');
        this.overlay = document.querySelector('.cart-overlay');
        this.closeBtn = this.querySelector('.cart-drawer__close');

        this.bindEvents();
    }

    bindEvents() {
        // Open cart triggers (Any element with attribute data-cart-trigger)
        document.querySelectorAll('[data-cart-trigger]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.open();
            });
        });

        // Close triggers
        if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
        if (this.overlay) this.overlay.addEventListener('click', () => this.close());

        // Close on escape key
        document.addEventListener('keyup', (evt) => {
            if (evt.key === 'Escape') this.close();
        });
    }

    open() {
        if (!this.drawer || !this.overlay) return;
        this.drawer.classList.add('is-open');
        this.overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    close() {
        if (!this.drawer || !this.overlay) return;
        this.drawer.classList.remove('is-open');
        this.overlay.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    static async addProduct(variantId, quantity = 1, buttonElement = null) {
        if (buttonElement) {
            const originalText = buttonElement.innerHTML;
            buttonElement.innerHTML = window.theme.strings.added || "Added ✓";
            buttonElement.classList.add('btn--success');

            // Update header cart count bounce
            const cartIcon = document.querySelector('.header-cart-badge');
            if (cartIcon) {
                cartIcon.style.animation = 'none';
                cartIcon.offsetHeight; /* trigger reflow */
                cartIcon.style.animation = 'bounceCart 0.5s ease';
            }

            setTimeout(() => {
                buttonElement.innerHTML = originalText;
                buttonElement.classList.remove('btn--success');
                document.querySelector('cart-drawer').open();
            }, 1500);
        }

        // In a real Shopify theme, we would trigger standard fetch to /cart/add.js here
        // Example:
        /*
        const formData = {
          'items': [{
           'id': variantId,
           'quantity': quantity
           }]
        };
        fetch(window.Shopify.routes.root + 'cart/add.js', { ... })
        */
    }
}

customElements.define('cart-drawer', CartDrawer);
