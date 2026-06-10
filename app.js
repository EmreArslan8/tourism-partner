/* ============================================================
   TurNet — B2B Turizm Ağı (demo)
   Listeleme verisi + filtreleme (kategori, ülke→şehir→ilçe),
   arama, sıralama, teklif modalı
   ============================================================ */

const CATEGORY_LABELS = {
  otel: "Otel",
  acente: "Seyahat Acentesi",
  rehber: "Tur Rehberi",
  firma: "Tur Firması",
};

const LISTINGS = [
  // ---- OTELLER ----
  { id: 1,  cat: "otel", name: "Kaya Palas Hotel", country: "Türkiye", city: "Antalya", district: "Muratpaşa",
    desc: "Denize sıfır, 240 odalı 5 yıldızlı şehir oteli. Acentelere özel kontenjan ve komisyonlu çalışma modeli.",
    rating: 4.8, reviews: 132, tag: "5 Yıldız", verified: true, featured: 10 },
  { id: 2,  cat: "otel", name: "Taş Konak Cappadocia", country: "Türkiye", city: "Nevşehir", district: "Ürgüp",
    desc: "Restore edilmiş kaya oteli, 28 butik oda. Balon turu paketleriyle kombine B2B fiyatlandırma.",
    rating: 4.9, reviews: 98, tag: "Butik", verified: true, featured: 9 },
  { id: 3,  cat: "otel", name: "Marmara Liman Otel", country: "Türkiye", city: "İstanbul", district: "Beyoğlu",
    desc: "Galata bölgesinde 76 odalı şehir oteli. Grup konaklamalarında esnek iptal koşulları.",
    rating: 4.5, reviews: 210, tag: "Şehir Oteli", verified: false, featured: 6 },
  { id: 4,  cat: "otel", name: "Ege Bay Resort", country: "Türkiye", city: "Muğla", district: "Bodrum",
    desc: "Her şey dahil konseptli 380 odalı resort. Yurt dışı acenteler için charter kontenjanı mevcut.",
    rating: 4.6, reviews: 301, tag: "Resort", verified: true, featured: 8 },
  { id: 5,  cat: "otel", name: "Santorini Blue Suites", country: "Yunanistan", city: "Santorini", district: "Oia",
    desc: "Caldera manzaralı 18 süit. Türk acentelerle TL bazlı sözleşme imkânı, balayı segmenti odaklı.",
    rating: 4.9, reviews: 87, tag: "Butik", verified: true, featured: 7 },

  // ---- ACENTELER ----
  { id: 6,  cat: "acente", name: "Anadolu Tur & Travel", country: "Türkiye", city: "İstanbul", district: "Kadıköy",
    desc: "A grubu işletme belgeli incoming acentesi. Kültür turları ve MICE organizasyonlarında 15 yıllık deneyim.",
    rating: 4.7, reviews: 64, tag: "A Grubu", verified: true, featured: 10 },
  { id: 7,  cat: "acente", name: "Likya Travel", country: "Türkiye", city: "Antalya", district: "Kaş",
    desc: "Batı Akdeniz odaklı butik acente. Yat kiralama, mavi yolculuk ve dalış paketlerinde B2B iş birliği.",
    rating: 4.8, reviews: 45, tag: "Butik", verified: true, featured: 8 },
  { id: 8,  cat: "acente", name: "Doğu Ekspres Turizm", country: "Türkiye", city: "İzmir", district: "Konak",
    desc: "Yurt içi paket turlar ve okul gezilerinde uzman acente. Acenteler arası kontenjan paylaşımına açık.",
    rating: 4.4, reviews: 89, tag: "Yurt İçi", verified: false, featured: 5 },
  { id: 9,  cat: "acente", name: "Batum Gateway DMC", country: "Gürcistan", city: "Batum", district: "Merkez",
    desc: "Gürcistan'da yerel DMC. Türk acenteler için Batum–Tiflis kombine programları ve transfer ağı.",
    rating: 4.6, reviews: 38, tag: "DMC", verified: true, featured: 7 },

  // ---- REHBERLER ----
  { id: 10, cat: "rehber", name: "Elif Demirkan", country: "Türkiye", city: "İstanbul", district: "Fatih",
    desc: "TUREB ruhsatlı profesyonel rehber. İngilizce & İspanyolca, tarihi yarımada ve müze turlarında uzman.",
    rating: 5.0, reviews: 156, tag: "EN · ES", verified: true, featured: 10 },
  { id: 11, cat: "rehber", name: "Mehmet Aksoy", country: "Türkiye", city: "Nevşehir", district: "Avanos",
    desc: "Kapadokya bölge rehberi. Almanca grup turları, atölye ziyaretleri ve özel trekking rotaları.",
    rating: 4.9, reviews: 121, tag: "DE", verified: true, featured: 9 },
  { id: 12, cat: "rehber", name: "Ayşe Yıldız", country: "Türkiye", city: "İzmir", district: "Selçuk",
    desc: "Efes ve çevresi arkeoloji turlarında 12 yıllık deneyim. Fransızca ve İngilizce kruvaziyer grupları.",
    rating: 4.8, reviews: 203, tag: "FR · EN", verified: true, featured: 8 },
  { id: 13, cat: "rehber", name: "Kerem Ulusoy", country: "Türkiye", city: "Muğla", district: "Fethiye",
    desc: "Likya Yolu ve doğa turları rehberi. Rusça konuşan gruplar için tekne ve yamaç paraşütü programları.",
    rating: 4.7, reviews: 77, tag: "RU", verified: false, featured: 6 },

  // ---- TUR FİRMALARI ----
  { id: 14, cat: "firma", name: "Göktürk Balloons", country: "Türkiye", city: "Nevşehir", district: "Göreme",
    desc: "Sivil havacılık lisanslı balon işletmesi. Acentelere sezonluk blok satış ve komisyon modeli.",
    rating: 4.9, reviews: 412, tag: "Balon Turu", verified: true, featured: 10 },
  { id: 15, cat: "firma", name: "Mavi Yol Yachting", country: "Türkiye", city: "Muğla", district: "Marmaris",
    desc: "12 guletlik filoyla mavi yolculuk operasyonu. Haftalık kiralama ve kabin satışında B2B fiyat listesi.",
    rating: 4.8, reviews: 96, tag: "Gulet", verified: true, featured: 9 },
  { id: 16, cat: "firma", name: "Pamukkale Adventures", country: "Türkiye", city: "Denizli", district: "Pamukkale",
    desc: "Yamaç paraşütü ve antik kent kombine turları. Günlük operasyon, acente paneli üzerinden anlık kontenjan.",
    rating: 4.6, reviews: 154, tag: "Macera", verified: true, featured: 7 },
  { id: 17, cat: "firma", name: "Bosphorus Line Cruises", country: "Türkiye", city: "İstanbul", district: "Beşiktaş",
    desc: "Boğaz teknesi ve davet organizasyonları. Kurumsal etkinlik ve incoming gruplara özel kapasite.",
    rating: 4.5, reviews: 188, tag: "Tekne Turu", verified: false, featured: 6 },
  { id: 18, cat: "firma", name: "Tbilisi Old Town Tours", country: "Gürcistan", city: "Tiflis", district: "Mtatsminda",
    desc: "Tiflis şehir turları ve şarap rotaları operatörü. Türkçe rehberli programlar, acente komisyonu %15.",
    rating: 4.7, reviews: 52, tag: "Şehir Turu", verified: true, featured: 7 },
];

/* ---------------- Durum ---------------- */
const state = {
  cat: "all",
  country: "all",
  city: "all",
  district: "all",
  search: "",
  verifiedOnly: false,
  sort: "featured",
};

/* ---------------- Element referansları ---------------- */
const $ = (id) => document.getElementById(id);
const cardsGrid = $("cardsGrid");
const resultCount = $("resultCount");
const emptyState = $("emptyState");
const activeChips = $("activeChips");
const countrySelect = $("countrySelect");
const citySelect = $("citySelect");
const districtSelect = $("districtSelect");

/* ---------------- Lokasyon seçeneklerini veriden üret ---------------- */
function uniq(arr) { return [...new Set(arr)].sort((a, b) => a.localeCompare(b, "tr")); }

function fillSelect(select, values, placeholder) {
  select.innerHTML = `<option value="all">${placeholder}</option>` +
    values.map((v) => `<option value="${v}">${v}</option>`).join("");
}

function refreshLocationSelects() {
  const countries = uniq(LISTINGS.map((l) => l.country));
  fillSelect(countrySelect, countries, "Tüm Ülkeler");
  countrySelect.value = state.country;

  if (state.country === "all") {
    citySelect.disabled = true;
    citySelect.innerHTML = `<option value="all">Önce ülke seçin</option>`;
  } else {
    const cities = uniq(LISTINGS.filter((l) => l.country === state.country).map((l) => l.city));
    citySelect.disabled = false;
    fillSelect(citySelect, cities, "Tüm Şehirler");
    citySelect.value = state.city;
  }

  if (state.city === "all") {
    districtSelect.disabled = true;
    districtSelect.innerHTML = `<option value="all">Önce şehir seçin</option>`;
  } else {
    const districts = uniq(
      LISTINGS.filter((l) => l.country === state.country && l.city === state.city).map((l) => l.district)
    );
    districtSelect.disabled = false;
    fillSelect(districtSelect, districts, "Tüm İlçeler");
    districtSelect.value = state.district;
  }

  // Hero'daki hızlı şehir seçimi (tüm şehirler)
  const heroCity = $("heroCity");
  const allCities = uniq(LISTINGS.map((l) => l.city));
  const current = heroCity.value;
  fillSelect(heroCity, allCities, "Tüm Şehirler");
  if ([...heroCity.options].some((o) => o.value === current)) heroCity.value = current;
}

/* ---------------- Filtreleme + sıralama ---------------- */
function getFiltered() {
  let items = LISTINGS.filter((l) => {
    if (state.cat !== "all" && l.cat !== state.cat) return false;
    if (state.country !== "all" && l.country !== state.country) return false;
    if (state.city !== "all" && l.city !== state.city) return false;
    if (state.district !== "all" && l.district !== state.district) return false;
    if (state.verifiedOnly && !l.verified) return false;
    if (state.search) {
      const q = state.search.toLocaleLowerCase("tr");
      const hay = `${l.name} ${l.desc} ${l.tag} ${l.city} ${l.district} ${l.country}`.toLocaleLowerCase("tr");
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  if (state.sort === "rating") items.sort((a, b) => b.rating - a.rating);
  else if (state.sort === "az") items.sort((a, b) => a.name.localeCompare(b.name, "tr"));
  else items.sort((a, b) => b.featured - a.featured);

  return items;
}

/* ---------------- Kart şablonu ---------------- */
const pinIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z"/><circle cx="12" cy="10" r="2.6"/></svg>`;
const starIcon = `<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z"/></svg>`;
const checkIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 10 17.5 19 7"/></svg>`;

function cardHTML(l) {
  const initials = l.name.split(" ").slice(0, 2).map((w) => w[0]).join("");
  return `
  <article class="card">
    <div class="card-cover cover-${l.cat}">
      <span class="cover-mono" aria-hidden="true">${initials}</span>
      <div class="cover-tags">
        <span class="badge">${CATEGORY_LABELS[l.cat]}</span>
        ${l.verified ? `<span class="badge badge-verified">${checkIcon} Doğrulanmış</span>` : ""}
      </div>
    </div>
    <div class="card-body">
      <h3 class="card-name">${l.name}</h3>
      <p class="card-loc">${pinIcon} ${l.district}, ${l.city} · ${l.country}</p>
      <p class="card-desc">${l.desc}</p>
      <div class="card-meta">
        <span class="rating">${starIcon} ${l.rating.toFixed(1)} <small>(${l.reviews})</small></span>
        <span class="card-tag">${l.tag}</span>
      </div>
      <div class="card-actions">
        <button class="btn btn-outline">Profili Gör</button>
        <button class="btn btn-solid" data-quote="${l.id}">Teklif İste</button>
      </div>
    </div>
  </article>`;
}

/* ---------------- Aktif filtre çipleri ---------------- */
function chipsHTML() {
  const chips = [];
  if (state.cat !== "all") chips.push({ key: "cat", label: CATEGORY_LABELS[state.cat] });
  if (state.country !== "all") chips.push({ key: "country", label: state.country });
  if (state.city !== "all") chips.push({ key: "city", label: state.city });
  if (state.district !== "all") chips.push({ key: "district", label: state.district });
  if (state.search) chips.push({ key: "search", label: `"${state.search}"` });
  if (state.verifiedOnly) chips.push({ key: "verifiedOnly", label: "Doğrulanmış" });
  return chips
    .map((c) => `<span class="chip">${c.label}<button data-remove="${c.key}" aria-label="Filtreyi kaldır">✕</button></span>`)
    .join("");
}

/* ---------------- Render ---------------- */
function render() {
  const items = getFiltered();
  cardsGrid.innerHTML = items.map(cardHTML).join("");
  emptyState.hidden = items.length > 0;
  resultCount.innerHTML = `<strong>${items.length}</strong> sonuç listeleniyor`;
  activeChips.innerHTML = chipsHTML();

  document.querySelectorAll(".cat-tab").forEach((t) =>
    t.classList.toggle("active", t.dataset.cat === state.cat)
  );
}

function setState(patch) {
  Object.assign(state, patch);
  // Üst seviye lokasyon değişince alt seviyeleri sıfırla
  if ("country" in patch) { state.city = "all"; state.district = "all"; }
  if ("city" in patch && !("country" in patch)) { state.district = "all"; }
  refreshLocationSelects();
  render();
}

/* ---------------- Olaylar ---------------- */
$("catTabs").addEventListener("click", (e) => {
  const tab = e.target.closest(".cat-tab");
  if (tab) setState({ cat: tab.dataset.cat });
});

countrySelect.addEventListener("change", () => setState({ country: countrySelect.value }));
citySelect.addEventListener("change", () => setState({ city: citySelect.value }));
districtSelect.addEventListener("change", () => setState({ district: districtSelect.value }));
$("verifiedOnly").addEventListener("change", (e) => setState({ verifiedOnly: e.target.checked }));
$("sortSelect").addEventListener("change", (e) => setState({ sort: e.target.value }));

let searchTimer;
$("searchInput").addEventListener("input", (e) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => setState({ search: e.target.value.trim() }), 220);
});

$("heroSearch").addEventListener("submit", (e) => {
  e.preventDefault();
  const cat = $("heroCategory").value;
  const city = $("heroCity").value;
  const patch = { cat, search: $("searchInput").value.trim() };
  if (city !== "all") {
    const found = LISTINGS.find((l) => l.city === city);
    patch.country = found ? found.country : "all";
    Object.assign(state, patch);
    state.city = city;
    state.district = "all";
    refreshLocationSelects();
    render();
  } else {
    setState(patch);
  }
  document.getElementById("kesfet").scrollIntoView({ behavior: "smooth" });
});

function clearAll() {
  $("searchInput").value = "";
  $("heroCategory").value = "all";
  $("verifiedOnly").checked = false;
  Object.assign(state, { cat: "all", country: "all", city: "all", district: "all", search: "", verifiedOnly: false });
  refreshLocationSelects();
  render();
}
$("clearFilters").addEventListener("click", clearAll);
$("emptyReset").addEventListener("click", clearAll);

activeChips.addEventListener("click", (e) => {
  const key = e.target.dataset.remove;
  if (!key) return;
  if (key === "search") { state.search = ""; $("searchInput").value = ""; }
  else if (key === "verifiedOnly") { state.verifiedOnly = false; $("verifiedOnly").checked = false; }
  else if (key === "cat") state.cat = "all";
  else if (key === "country") { state.country = "all"; state.city = "all"; state.district = "all"; }
  else if (key === "city") { state.city = "all"; state.district = "all"; }
  else if (key === "district") state.district = "all";
  refreshLocationSelects();
  render();
});

document.querySelectorAll("[data-nav-cat]").forEach((a) =>
  a.addEventListener("click", () => setState({ cat: a.dataset.navCat }))
);

/* ---------------- Teklif modalı ---------------- */
const backdrop = $("modalBackdrop");
const formView = $("modalFormView");
const successView = $("modalSuccessView");
let activeListing = null;

cardsGrid.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-quote]");
  if (!btn) return;
  activeListing = LISTINGS.find((l) => l.id === Number(btn.dataset.quote));
  $("modalTitle").textContent = activeListing.name;
  $("modalSub").textContent =
    `${CATEGORY_LABELS[activeListing.cat]} · ${activeListing.district}, ${activeListing.city} · ${activeListing.country}`;
  formView.hidden = false;
  successView.hidden = true;
  backdrop.hidden = false;
  document.body.classList.add("modal-open");
});

function closeModal() {
  backdrop.hidden = true;
  document.body.classList.remove("modal-open");
  $("quoteForm").reset();
}
$("modalClose").addEventListener("click", closeModal);
$("successClose").addEventListener("click", closeModal);
backdrop.addEventListener("click", (e) => { if (e.target === backdrop) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !backdrop.hidden) closeModal(); });

$("quoteForm").addEventListener("submit", (e) => {
  e.preventDefault();
  $("successText").textContent =
    `${activeListing.name} talebinizi aldı. Firma en geç 24 saat içinde sizinle iletişime geçecek.`;
  formView.hidden = true;
  successView.hidden = false;
});

/* ---------------- Hero sayaç animasyonu ---------------- */
function animateCounters() {
  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = Number(el.dataset.count);
    const dur = 1400;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

/* ---------------- Başlat ---------------- */
refreshLocationSelects();
render();
animateCounters();
