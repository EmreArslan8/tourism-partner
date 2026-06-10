/* ============================================================
   TurNet — Listeleme (Yön A: kart ızgarası)
   ============================================================ */

Object.assign(I18N, {
  "list.eyebrow": { tr: "Listeleme", en: "Listing" },
  "list.title": { tr: "Tedarikçileri keşfedin", en: "Explore suppliers" },
  "list.emptyTitle": { tr: "Sonuç bulunamadı", en: "No results found" },
  "list.emptySub": { tr: "Filtreleri genişleterek tekrar deneyin.", en: "Broaden your filters and try again." },
  "list.clear": { tr: "Filtreleri Temizle", en: "Clear Filters" },
  "list.map": { tr: "Harita", en: "Map" },
  "list.demoNote": { tr: "Örnek demo verisi", en: "Sample demo data" },
});

const PAGE_SIZE = 6;

const state = {
  cats: new Set(),
  country: "all",
  city: "all",
  district: "all",
  search: "",
  sort: "featured",
  page: 1,
};

let refreshLocation = null;

function listingCardHTML(l) {
  const filledStars = Math.round(l.rating);
  const stars = Array.from({ length: 5 }, (_, i) => `<span class="${i < filledStars ? "" : "muted"}">★</span>`).join("");

  return `
    <article class="supplier-row">
      <a class="supplier-thumb cover-${l.cat}" href="tedarikci.html?id=${l.id}" aria-label="${l.name}">
        <span>${initials(l.name)}</span>
      </a>
      <div class="supplier-row-main">
        <div class="supplier-title-line">
          <h3>${l.name}</h3>
          <span class="supplier-badge">${catLabel(l.cat)}</span>
          ${l.verified ? `<span class="supplier-verified">${ICONS.check} ${t("common.verified")}</span>` : ""}
        </div>
        <p class="supplier-meta">
          <span class="supplier-stars" aria-label="${l.rating.toFixed(1)} puan">${stars}</span>
          <span>${l.city} · ${l.district}</span>
          <span>${l.tag}</span>
        </p>
        <p class="supplier-desc">${l.desc}</p>
      </div>
      <div class="supplier-actions">
        <a href="teklif.html?s=${l.id}" class="btn btn-solid btn-sm">${t("common.requestQuote")}</a>
        <a href="tedarikci.html?id=${l.id}" class="btn btn-outline btn-sm">${t("common.detail")}</a>
      </div>
    </article>`;
}

function renderMapPins(items) {
  const map = document.getElementById("mapPins");
  if (!map) return;

  const positions = [
    [34, 31], [22, 56], [43, 61], [56, 70], [67, 43], [47, 76], [72, 31], [30, 82],
  ];
  const pins = items.slice(0, positions.length).map((l, i) => {
    const [top, left] = positions[i];
    return `<a class="map-dot map-dot-${l.cat}" style="top:${top}%;left:${left}%" href="tedarikci.html?id=${l.id}" title="${l.name}"><span>${l.name}</span></a>`;
  }).join("");

  map.innerHTML = `<span class="map-label">${t("list.map").toLocaleUpperCase("tr")}</span>${pins}`;
}

function readInitialParams() {
  const params = new URLSearchParams(location.search);
  const cat = params.get("cat");
  if (cat) cat.split(",").filter(Boolean).forEach((c) => state.cats.add(c));
  state.search = params.get("q") || "";
  state.country = params.get("country") || "all";
  state.city = params.get("city") || "all";
  state.district = params.get("district") || "all";
  if (state.city !== "all" && state.country === "all") {
    const found = LISTINGS.find((l) => l.city === state.city);
    if (found) state.country = found.country;
  }
}

function writeUrl() {
  const params = new URLSearchParams();
  if (state.cats.size) params.set("cat", [...state.cats].join(","));
  if (state.search) params.set("q", state.search);
  if (state.country !== "all") params.set("country", state.country);
  if (state.city !== "all") params.set("city", state.city);
  if (state.district !== "all") params.set("district", state.district);
  const next = `${location.pathname}${params.toString() ? `?${params}` : ""}`;
  history.replaceState(null, "", next);
}

function getFiltered() {
  const q = state.search.toLocaleLowerCase("tr");
  const items = LISTINGS.filter((l) => {
    if (state.cats.size && !state.cats.has(l.cat)) return false;
    if (state.country !== "all" && l.country !== state.country) return false;
    if (state.city !== "all" && l.city !== state.city) return false;
    if (state.district !== "all" && l.district !== state.district) return false;
    if (q) {
      const hay = `${l.name} ${l.desc} ${l.tag} ${l.country} ${l.city} ${l.district}`.toLocaleLowerCase("tr");
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  if (state.sort === "rating") items.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
  else if (state.sort === "az") items.sort((a, b) => a.name.localeCompare(b.name, "tr"));
  else items.sort((a, b) => b.featured - a.featured || b.rating - a.rating);
  return items;
}

function renderPagination(total) {
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const nav = document.getElementById("pagination");
  if (totalPages <= 1) {
    nav.innerHTML = "";
    return;
  }

  const buttons = [];
  buttons.push(`<button class="page-btn" data-page="${state.page - 1}" ${state.page === 1 ? "disabled" : ""}>←</button>`);
  for (let i = 1; i <= totalPages; i += 1) {
    buttons.push(`<button class="page-btn ${i === state.page ? "active" : ""}" data-page="${i}">${i}</button>`);
  }
  buttons.push(`<button class="page-btn" data-page="${state.page + 1}" ${state.page === totalPages ? "disabled" : ""}>→</button>`);
  nav.innerHTML = buttons.join("");
}

function renderListing() {
  const items = getFiltered();
  const maxPage = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  state.page = Math.min(state.page, maxPage);
  const start = (state.page - 1) * PAGE_SIZE;
  const pageItems = items.slice(start, start + PAGE_SIZE);

  document.getElementById("cardsGrid").innerHTML = pageItems.map(listingCardHTML).join("");
  document.getElementById("emptyState").hidden = items.length > 0;
  document.getElementById("resultCount").innerHTML =
    `<strong>${items.length}</strong> ${t("common.results")} ${state.city !== "all" ? `· ${state.city}` : ""}`;
  renderMapPins(items);

  document.querySelectorAll(".type-chip").forEach((chip) => {
    chip.classList.toggle("active", state.cats.has(chip.dataset.cat));
  });

  renderPagination(items.length);
  writeUrl();
}

function resetFilters() {
  state.cats.clear();
  state.country = "all";
  state.city = "all";
  state.district = "all";
  state.search = "";
  state.sort = "featured";
  state.page = 1;

  document.getElementById("searchInput").value = "";
  document.getElementById("sortSelect").value = state.sort;
  if (refreshLocation) refreshLocation();
  renderListing();
}

function setupListing() {
  readInitialParams();

  const country = document.getElementById("countrySelect");
  const city = document.getElementById("citySelect");
  const district = document.getElementById("districtSelect");
  refreshLocation = setupCascade(country, city, district, () => {
    state.country = country.value;
    state.city = city.disabled ? "all" : city.value;
    state.district = district.disabled ? "all" : district.value;
    state.page = 1;
    renderListing();
  });
  refreshLocation({ country: state.country, city: state.city, district: state.district });

  document.getElementById("searchInput").value = state.search;
  document.getElementById("typeChips").addEventListener("click", (e) => {
    const chip = e.target.closest(".type-chip");
    if (!chip) return;
    const cat = chip.dataset.cat;
    if (state.cats.has(cat)) state.cats.delete(cat);
    else state.cats.add(cat);
    state.page = 1;
    renderListing();
  });

  document.getElementById("filterBar").addEventListener("submit", (e) => {
    e.preventDefault();
    state.search = document.getElementById("searchInput").value.trim();
    state.country = country.value;
    state.city = city.disabled ? "all" : city.value;
    state.district = district.disabled ? "all" : district.value;
    state.page = 1;
    renderListing();
  });

  let timer;
  document.getElementById("searchInput").addEventListener("input", (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      state.search = e.target.value.trim();
      state.page = 1;
      renderListing();
    }, 180);
  });

  document.getElementById("sortSelect").addEventListener("change", (e) => {
    state.sort = e.target.value;
    state.page = 1;
    renderListing();
  });

  document.getElementById("emptyReset").addEventListener("click", resetFilters);
  document.getElementById("pagination").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-page]");
    if (!btn || btn.disabled) return;
    state.page = Number(btn.dataset.page);
    renderListing();
    document.querySelector(".page-head").scrollIntoView({ behavior: "smooth" });
  });

  renderListing();
}

document.addEventListener("langchange", () => {
  if (refreshLocation) {
    refreshLocation({
      country: document.getElementById("countrySelect").value,
      city: document.getElementById("citySelect").value,
      district: document.getElementById("districtSelect").value,
    });
  }
  renderListing();
});

document.addEventListener("DOMContentLoaded", setupListing);
