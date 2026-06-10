/* ============================================================
   TurNet — Ana sayfa (Yön A: klasik üst arama)
   ============================================================ */

Object.assign(I18N, {
  "home.kicker": { tr: "B2B Tedarikçi Ağı", en: "B2B Supplier Network" },
  "home.sub": {
    tr: "Otel, acente, rehber ve tur firmalarını filtreleyin; uygun iş ortaklarından teklif isteyin.",
    en: "Filter hotels, agencies, guides and tour companies; request quotes from matching partners.",
  },
  "home.searchPh": { tr: "Ne arıyorsunuz? (otel, rehber…)", en: "What are you looking for? (hotel, guide...)" },
  "home.popular": { tr: "Popüler:", en: "Popular:" },
  "home.catEyebrow": { tr: "Keşfet", en: "Explore" },
  "home.catTitle": { tr: "Kategoriye göz atın", en: "Browse by category" },
  "home.featuredEyebrow": { tr: "Vitrin", en: "Showcase" },
  "home.featuredTitle": { tr: "Öne çıkan tedarikçiler", en: "Featured suppliers" },
  "home.suppliers": { tr: "tedarikçi", en: "suppliers" },
  "filter.searchLabel": { tr: "Arama", en: "Search" },
  "how.title": { tr: "Üç adımda iş birliği", en: "Partnership in three steps" },
  "how.s1": { tr: "Keşfedin", en: "Discover" },
  "how.s1d": {
    tr: "Kategori, ülke, şehir ve ilçe filtreleriyle ihtiyacınıza uygun tedarikçiyi bulun.",
    en: "Find the right supplier with category, country, city and district filters.",
  },
  "how.s2": { tr: "Teklif İsteyin", en: "Request Quotes" },
  "how.s2d": {
    tr: "Talebinizi tek formla iletin; birden çok tedarikçiden aynı anda teklif isteyin.",
    en: "Send your request with a single form to multiple suppliers at once.",
  },
  "how.s3": { tr: "Anlaşın", en: "Close the Deal" },
  "how.s3d": {
    tr: "Gelen teklifleri karşılaştırın, firmayla doğrudan iletişime geçin.",
    en: "Compare incoming quotes and contact suppliers directly.",
  },
  "partners.label": { tr: "İş birliği ağı", en: "Partner network" },
});

const HOME_TITLE = {
  tr: "Turizm tedarikçilerini<br><em>tek yerde bulun.</em>",
  en: "Find travel suppliers<br><em>in one place.</em>",
};

const CAT_ICONS = {
  otel: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M3 20V7l7-3v16"/><path d="M10 8l11 3v9"/><line x1="1" y1="20" x2="23" y2="20"/><line x1="5.5" y1="9" x2="7.5" y2="9"/><line x1="5.5" y1="12.5" x2="7.5" y2="12.5"/><line x1="13.5" y1="13" x2="15.5" y2="13.6"/><line x1="17.5" y1="14.2" x2="19.5" y2="14.8"/></svg>`,
  acente: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M3.5 9h17M3.5 15h17"/><path d="M12 3c-2.7 2.5-4 5.5-4 9s1.3 6.5 4 9c2.7-2.5 4-5.5 4-9s-1.3-6.5-4-9Z"/></svg>`,
  rehber: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v18"/><path d="M6 4h12l-2.5 3.5L18 11H6"/></svg>`,
  firma: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M3 19c4-7 7-9 9-9s5 2 9 9"/><circle cx="12" cy="6" r="2.6"/><line x1="2" y1="21" x2="22" y2="21"/></svg>`,
};

let refreshHeroLocation = null;

function supplierCardHTML(l) {
  return `
    <article class="card">
      <div class="card-cover cover-${l.cat}">
        <span class="cover-mono" aria-hidden="true">${initials(l.name)}</span>
        <div class="cover-tags">
          <span class="badge">${catLabel(l.cat)}</span>
          ${l.verified ? `<span class="badge badge-verified">${ICONS.check} ${t("common.verified")}</span>` : ""}
        </div>
      </div>
      <div class="card-body">
        <h3 class="card-name">${l.name}</h3>
        <p class="card-loc">${ICONS.pin} ${l.district}, ${l.city} · ${l.country}</p>
        <p class="card-desc">${l.desc}</p>
        <div class="card-meta">
          <span class="rating">${ICONS.star} ${l.rating.toFixed(1)} <small>(${l.reviews})</small></span>
          <span class="card-tag">${l.tag}</span>
        </div>
        <div class="card-actions">
          <a href="tedarikci.html?id=${l.id}" class="btn btn-outline">${t("common.detail")}</a>
          <a href="teklif.html?s=${l.id}" class="btn btn-solid">${t("common.requestQuote")}</a>
        </div>
      </div>
    </article>`;
}

function renderHome() {
  const lang = getLang();
  const h1 = document.querySelector("[data-i18n-html]");
  if (h1) h1.innerHTML = HOME_TITLE[lang];

  document.getElementById("catGrid").innerHTML = CATEGORIES.map((c) => `
    <article class="cat-card">
      <div class="cat-icon ${c.key}">${CAT_ICONS[c.key]}</div>
      <div class="cat-body">
        <h3>${c.plural[lang]}</h3>
        <p>${c.desc[lang]}</p>
        <div class="cat-foot">
          <span class="cat-count">${c.count} ${t("home.suppliers")}</span>
          <a href="listeleme.html?cat=${c.key}" class="btn btn-pine btn-sm">${t("common.discover")}</a>
        </div>
      </div>
    </article>`).join("");

  const popular = [
    { href: "listeleme.html?city=İstanbul&cat=otel", tr: "İstanbul otelleri", en: "Istanbul hotels" },
    { href: "listeleme.html?q=balon&city=Nevşehir", tr: "Kapadokya turları", en: "Cappadocia tours" },
    { href: "listeleme.html?city=Antalya&cat=acente", tr: "Antalya acenteleri", en: "Antalya agencies" },
  ];
  const popWrap = document.getElementById("heroPopular");
  popWrap.innerHTML = `<span class="pop-label">${t("home.popular")}</span>` +
    popular.map((p) => `<a href="${p.href}">${p[lang]}</a>`).join("");

  const featured = [...LISTINGS].sort((a, b) => b.featured - a.featured || b.rating - a.rating).slice(0, 6);
  document.getElementById("featuredGrid").innerHTML = featured.map(supplierCardHTML).join("");
}

function setupHeroSearch() {
  const country = document.getElementById("heroCountry");
  const city = document.getElementById("heroCity");
  const district = document.getElementById("heroDistrict");
  refreshHeroLocation = setupCascade(country, city, district);

  document.getElementById("heroSearch").addEventListener("submit", (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const q = document.getElementById("heroSearchInput").value.trim();
    if (q) params.set("q", q);
    if (country.value !== "all") params.set("country", country.value);
    if (!city.disabled && city.value !== "all") params.set("city", city.value);
    if (!district.disabled && district.value !== "all") params.set("district", district.value);
    location.href = `listeleme.html${params.toString() ? `?${params}` : ""}`;
  });
}

document.addEventListener("langchange", () => {
  if (refreshHeroLocation) {
    refreshHeroLocation({
      country: document.getElementById("heroCountry").value,
      city: document.getElementById("heroCity").value,
      district: document.getElementById("heroDistrict").value,
    });
  }
  renderHome();
});

document.addEventListener("DOMContentLoaded", () => {
  setupHeroSearch();
  renderHome();
});
