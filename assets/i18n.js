const translations = {
    en: {
        "nav.home": "Home",
        "nav.shop": "Shop",
        "nav.about": "About",
        "nav.contact": "Contact",
        "cart.add": "Add to Cart",
        "cart.checkout": "Checkout",
        "cart.empty": "Your cart is empty",
        "cart.title": "Your Cart",
        "search.placeholder": "Search cubes...",
        "btn.quick_add": "Quick Add",
        "btn.discover": "Discover More",
        "btn.view_all": "View All",
        "trust.shipping": "Fast Shipping",
        "trust.curated": "Curated by Cubers",
        "trust.support": "Expert Support",
        "trust.secure": "Secure Checkout",
        "footer.newsletter_heading": "Stay in the loop",
        "footer.newsletter_btn": "Subscribe",
        "account.signin": "Sign In",
        "account.register": "Create Account",
        "account.logout": "Log Out",
        "account.orders": "Order History"
    },
    ar: {
        "nav.home": "الرئيسية",
        "nav.shop": "تسوق",
        "nav.about": "عنا",
        "nav.contact": "تواصل",
        "cart.add": "أضف إلى السلة",
        "cart.checkout": "الدفع",
        "cart.empty": "سلة التسوق فارغة",
        "cart.title": "سلة التسوق",
        "search.placeholder": "ابحث عن كيوب...",
        "btn.quick_add": "أضف سريعاً",
        "btn.discover": "اكتشف المزيد",
        "btn.view_all": "عرض الكل",
        "trust.shipping": "شحن سريع",
        "trust.curated": "محكّم من لاعبي الكيوب",
        "trust.support": "دعم متخصص",
        "trust.secure": "دفع آمن",
        "footer.newsletter_heading": "ابق على اطلاع",
        "footer.newsletter_btn": "اشترك",
        "account.signin": "تسجيل الدخول",
        "account.register": "إنشاء حساب",
        "account.logout": "تسجيل الخروج",
        "account.orders": "سجل الطلبات"
    }
};

function toggleLanguage() {
    const current = localStorage.getItem('sch-lang') || 'en';
    const next = current === 'en' ? 'ar' : 'en';
    setLanguage(next);
}

function setLanguage(lang) {
    localStorage.setItem('sch-lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);

    document.querySelectorAll('.lang-current').forEach(el => {
        el.textContent = lang.toUpperCase();
    });

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    // Load Cairo font for Arabic
    if (lang === 'ar') {
        document.body.style.setProperty('--font-display', "'Cairo', sans-serif");
    } else {
        document.body.style.setProperty('--font-display', "'Rajdhani', sans-serif");
    }
}

// On page load:
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(localStorage.getItem('sch-lang') || 'en');
});
