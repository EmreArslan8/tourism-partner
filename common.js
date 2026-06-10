/* ============================================================
   TurNet — ortak davranışlar: i18n (TR/EN), sepet, header
   ============================================================ */

/* ---------------- i18n ---------------- */
const I18N = {
  /* nav + header */
  "nav.home": { tr: "Anasayfa", en: "Home" },
  "nav.explore": { tr: "Keşfet", en: "Explore" },
  "nav.how": { tr: "Nasıl Çalışır", en: "How It Works" },
  "nav.quote": { tr: "Teklif Al", en: "Get Quotes" },
  "nav.add": { tr: "+ Firma Ekle", en: "+ List Your Business" },

  /* genel */
  "common.search": { tr: "Ara", en: "Search" },
  "common.discover": { tr: "Görüntüle →", en: "View →" },
  "common.detail": { tr: "Detay", en: "Details" },
  "common.requestQuote": { tr: "Teklif İste", en: "Request Quote" },
  "common.all": { tr: "Tümü →", en: "View all →" },
  "common.back": { tr: "← Geri", en: "← Back" },
  "common.next": { tr: "İleri →", en: "Next →" },
  "common.records": { tr: "kayıt", en: "listings" },
  "common.results": { tr: "sonuç", en: "results" },
  "common.verified": { tr: "Doğrulanmış", en: "Verified" },

  /* filtreler */
  "filter.country": { tr: "Ülke", en: "Country" },
  "filter.city": { tr: "Şehir", en: "City" },
  "filter.district": { tr: "İlçe", en: "District" },
  "filter.allCountries": { tr: "Tüm Ülkeler", en: "All Countries" },
  "filter.allCities": { tr: "Tüm Şehirler", en: "All Cities" },
  "filter.allDistricts": { tr: "Tüm İlçeler", en: "All Districts" },
  "filter.selectCountryFirst": { tr: "Önce ülke seçin", en: "Select country first" },
  "filter.selectCityFirst": { tr: "Önce şehir seçin", en: "Select city first" },
  "filter.searchPh": { tr: "İsim / hizmet ara…", en: "Search name / service…" },
  "filter.apply": { tr: "Filtrele", en: "Filter" },
  "filter.sort": { tr: "Sırala", en: "Sort" },
  "sort.featured": { tr: "Önerilen", en: "Recommended" },
  "sort.rating": { tr: "Puana göre", en: "By rating" },
  "sort.az": { tr: "A → Z", en: "A → Z" },

  /* kategoriler */
  "cat.otel": { tr: "Oteller", en: "Hotels" },
  "cat.acente": { tr: "Acenteler", en: "Agencies" },
  "cat.rehber": { tr: "Rehberler", en: "Guides" },
  "cat.firma": { tr: "Tur Firmaları", en: "Tour Companies" },

  /* footer */
  "footer.tagline": { tr: "B2B turizm tedarikçi ağı. Oteller, acenteler, rehberler ve tur firmaları için ortak vitrin.", en: "B2B travel supplier network. A shared showcase for hotels, agencies, guides and tour companies." },
  "footer.categories": { tr: "Kategoriler", en: "Categories" },
  "footer.platform": { tr: "Platform", en: "Platform" },
  "footer.regions": { tr: "Bölgeler", en: "Regions" },
  "footer.howShort": { tr: "Nasıl çalışır?", en: "How it works" },
  "footer.addCompany": { tr: "Firma ekle", en: "List your business" },
  "footer.getQuote": { tr: "Teklif al", en: "Get quotes" },
  "footer.note": { tr: "© 2026 TurNet — Demo tasarım", en: "© 2026 TurNet — Demo design" },
  "footer.note2": { tr: "Ülke · Şehir · İlçe bazlı B2B listeleme", en: "Country · City · District based B2B listing" },
};

function getLang() { return localStorage.getItem("turnet_lang") || "tr"; }
function setLang(lang) {
  localStorage.setItem("turnet_lang", lang);
  document.documentElement.lang = lang;
  applyI18n();
  document.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
}
function t(key) {
  const e = I18N[key];
  return e ? e[getLang()] : key;
}
function catLabel(cat) { return CATEGORY_LABELS[cat][getLang() === "en" ? "en" : "tr"]; }

function applyI18n() {
  const lang = getLang();
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const e = I18N[el.dataset.i18n];
    if (e) el.textContent = e[lang];
  });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    const e = I18N[el.dataset.i18nPh];
    if (e) el.placeholder = e[lang];
  });
  document.querySelectorAll(".lang-toggle button").forEach((b) =>
    b.classList.toggle("active", b.dataset.lang === lang)
  );
}

/* ---------------- karşılaştırma / teklif sepeti ---------------- */
function getCart() {
  try { return JSON.parse(localStorage.getItem("turnet_cart") || "[]"); } catch { return []; }
}
function setCart(ids) { localStorage.setItem("turnet_cart", JSON.stringify([...new Set(ids)])); }
function addToCart(id) { const c = getCart(); c.push(Number(id)); setCart(c); }
function removeFromCart(id) { setCart(getCart().filter((x) => x !== Number(id))); }

/* ---------------- kademeli Ülke→Şehir→İlçe ---------------- */
function fillLocSelect(sel, values, placeholder) {
  sel.innerHTML = `<option value="all">${placeholder}</option>` +
    values.map((v) => `<option value="${v}">${v}</option>`).join("");
}
function setupCascade(countrySel, citySel, districtSel, onChange) {
  const refresh = (keep = {}) => {
    fillLocSelect(countrySel, uniqSorted(LISTINGS.map((l) => l.country)), t("filter.allCountries"));
    if (keep.country) countrySel.value = keep.country;
    const c = countrySel.value;
    if (c === "all") {
      citySel.disabled = true;
      citySel.innerHTML = `<option value="all">${t("filter.selectCountryFirst")}</option>`;
    } else {
      citySel.disabled = false;
      fillLocSelect(citySel, uniqSorted(LISTINGS.filter((l) => l.country === c).map((l) => l.city)), t("filter.allCities"));
      if (keep.city) citySel.value = keep.city;
    }
    const ci = citySel.value;
    if (citySel.disabled || ci === "all") {
      districtSel.disabled = true;
      districtSel.innerHTML = `<option value="all">${t("filter.selectCityFirst")}</option>`;
    } else {
      districtSel.disabled = false;
      fillLocSelect(districtSel, uniqSorted(
        LISTINGS.filter((l) => l.country === c && l.city === ci).map((l) => l.district)
      ), t("filter.allDistricts"));
      if (keep.district) districtSel.value = keep.district;
    }
  };
  countrySel.addEventListener("change", () => { refresh({ country: countrySel.value }); onChange && onChange(); });
  citySel.addEventListener("change", () => { refresh({ country: countrySel.value, city: citySel.value }); onChange && onChange(); });
  districtSel.addEventListener("change", () => { onChange && onChange(); });
  refresh();
  return refresh;
}

/* ---------------- url parametresi ---------------- */
function qparam(name) { return new URLSearchParams(location.search).get(name); }

/* ---------------- ortak kart parçaları ---------------- */
const ICONS = {
  pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z"/><circle cx="12" cy="10" r="2.6"/></svg>`,
  star: `<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 10 17.5 19 7"/></svg>`,
};

function initials(name) { return name.split(" ").slice(0, 2).map((w) => w[0]).join(""); }

/* ---------------- header / footer başlat ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.lang = getLang();

  // dil değiştirici
  document.querySelectorAll(".lang-toggle button").forEach((b) =>
    b.addEventListener("click", () => setLang(b.dataset.lang))
  );

  // aktif nav
  const page = document.body.dataset.page;
  document.querySelectorAll(".main-nav a[data-nav]").forEach((a) =>
    a.classList.toggle("active", a.dataset.nav === page)
  );

  // mobil menü
  const toggle = document.getElementById("menuToggle");
  if (toggle) toggle.addEventListener("click", () => document.body.classList.toggle("nav-open"));

  applyI18n();
});
