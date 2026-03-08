/**
 * SpeedCubeHub i18n
 * Language switching via Shopify locale routing (/ar/)
 */
const schTranslations = {
  en: {
    "nav.home": "Home", "nav.shop": "Shop", "nav.about": "About", "nav.contact": "Contact",
    "cart.add": "Add to Cart", "cart.checkout": "Checkout", "cart.empty": "Your cart is empty",
    "cart.title": "Your Cart", "search.placeholder": "Search cubes, brands, accessories...",
    "btn.quick_add": "Quick Add", "btn.discover": "Discover More", "btn.view_all": "View All Products",
    "trust.shipping": "Fast Shipping", "trust.curated": "Curated by Cubers",
    "trust.support": "Expert Support", "trust.secure": "Secure Checkout", "trust.returns": "Easy Returns",
    "footer.newsletter_heading": "Stay in the loop", "footer.newsletter_btn": "Subscribe",
    "product.add_to_cart": "Add to Cart", "product.sold_out": "Sold Out",
    "product.description": "Description", "product.specs": "Specs", "product.shipping": "Shipping"
  },
  ar: {
    "nav.home": "الرئيسية", "nav.shop": "تسوق", "nav.about": "من نحن", "nav.contact": "تواصل معنا",
    "cart.add": "أضف إلى السلة", "cart.checkout": "إتمام الشراء", "cart.empty": "سلة التسوق فارغة",
    "cart.title": "سلة التسوق", "search.placeholder": "ابحث عن كيوب أو ماركة...",
    "btn.quick_add": "أضف سريعاً", "btn.discover": "اكتشف المزيد", "btn.view_all": "عرض جميع المنتجات",
    "trust.shipping": "شحن سريع", "trust.curated": "اختيار المحترفين",
    "trust.support": "دعم متخصص", "trust.secure": "دفع آمن", "trust.returns": "إرجاع سهل",
    "footer.newsletter_heading": "ابقَ على اطلاع", "footer.newsletter_btn": "اشترك",
    "product.add_to_cart": "أضف إلى السلة", "product.sold_out": "نفذت الكمية",
    "product.description": "الوصف", "product.specs": "المواصفات", "product.shipping": "الشحن"
  }
};

function getLocale() {
  const lang = document.documentElement.getAttribute('lang') || 'en';
  return lang.startsWith('ar') ? 'ar' : 'en';
}

function applyTranslations() {
  const lang = getLocale();
  const dict = schTranslations[lang] || schTranslations.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.textContent = dict[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) el.setAttribute('placeholder', dict[key]);
  });
  if (lang === 'ar') {
    document.documentElement.setAttribute('dir', 'rtl');
    document.body.style.setProperty('--font-display', "'Cairo', sans-serif");
    document.body.style.setProperty('--font-body', "'Cairo', sans-serif");
  }
}

// toggleLanguage: now uses Shopify locale routing
function toggleLanguage() {
  const lang = getLocale();
  if (lang === 'ar') {
    window.location.href = window.location.href.replace('/ar/', '/').replace('/ar', '/');
  } else {
    const path = window.location.pathname;
    window.location.href = '/ar' + (path.startsWith('/') ? path : '/' + path);
  }
}

document.addEventListener('DOMContentLoaded', applyTranslations);
