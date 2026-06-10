/* ============================================================
   TurNet — Tedarikçi detay
   ============================================================ */

let activeTab = "overview";
let listing = null;

function currentListing() {
  return getListing(qparam("id")) || LISTINGS[0];
}

function coverClass(cat) {
  return `cover-${cat}`;
}

function renderBreadcrumb() {
  document.getElementById("breadcrumb").innerHTML = `
    <a href="index.html">${t("nav.home")}</a><span class="sep">›</span>
    <a href="listeleme.html">${t("nav.explore")}</a><span class="sep">›</span>
    <a href="listeleme.html?cat=${listing.cat}">${catLabel(listing.cat)}</a><span class="sep">›</span>
    <strong>${listing.name}</strong>`;
}

function renderTitle() {
  document.title = `${listing.name} — TurNet`;
  document.getElementById("detailCover").className = `detail-cover ${coverClass(listing.cat)}`;
  document.getElementById("detailCover").innerHTML = `
    <span class="cover-mono" aria-hidden="true">${initials(listing.name)}</span>
    <div class="cover-tags">
      <span class="badge">${catLabel(listing.cat)}</span>
      ${listing.verified ? `<span class="badge badge-verified">${ICONS.check} ${t("common.verified")}</span>` : ""}
    </div>`;

  document.getElementById("detailTitle").innerHTML = `
    <div class="detail-logo ${coverClass(listing.cat)}">${initials(listing.name)}</div>
    <div>
      <h1>${listing.name}</h1>
      <div class="meta-line">
        <span class="badge">${catLabel(listing.cat)}</span>
        <span class="card-loc">${ICONS.pin} ${listing.district}, ${listing.city} · ${listing.country}</span>
        <span class="rating">${ICONS.star} ${listing.rating.toFixed(1)} <small>(${listing.reviews})</small></span>
      </div>
    </div>`;
}

function renderPanel() {
  const services = listing.services.map((s) => `<span class="service-chip">${s}</span>`).join("");
  const gallery = [1, 2, 3].map((n) => `<div class="ph ${coverClass(listing.cat)}">FOTO ${n}</div>`).join("");
  const reviews = [
    ["Incoming Partner", "Hızlı dönüş ve net B2B fiyatlandırma. Grup taleplerinde operasyon ekibi güçlü."],
    ["MICE Planner", "Talep detaylarını iyi okuyup alternatifli teklif sundular."],
  ].map((r) => `
    <div class="review">
      <div class="rev-head"><b>${r[0]}</b><span class="rating">${ICONS.star} 4.8</span></div>
      <p>${r[1]}</p>
    </div>`).join("");

  const panels = {
    overview: `<h2>Hakkında</h2><p>${listing.about}</p><h2>Öne çıkan hizmetler</h2><div class="service-chips">${services}</div>`,
    services: `<h2>Hizmetler / Olanaklar</h2><div class="service-chips">${services}</div>`,
    gallery: `<h2>Galeri</h2><div class="gallery">${gallery}</div>`,
    reviews: `<h2>Yorumlar</h2>${reviews}`,
  };
  document.getElementById("detailPanel").innerHTML = panels[activeTab];
  document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === activeTab));
}

function renderSidebar() {
  document.getElementById("quoteBox").innerHTML = `
    <h3>Bu tedarikçiden teklif al</h3>
    <p class="side-sub">Talebinizi iletin, firma doğrudan sizinle iletişime geçsin.</p>
    <select aria-label="Hizmet tipi">
      ${listing.services.map((s) => `<option>${s}</option>`).join("")}
    </select>
    <input type="text" placeholder="Tarih aralığı">
    <a href="teklif.html?s=${listing.id}" class="btn btn-solid btn-block">${t("common.requestQuote")}</a>
    <button class="btn btn-outline btn-block" id="addCompare">+ Karşılaştırmaya ekle</button>`;

  document.getElementById("quickInfo").innerHTML = `
    <h3>Hızlı bilgi</h3>
    <div class="qi-row"><span class="k">Konum</span><span class="v">${listing.city}, ${listing.country}</span></div>
    <div class="qi-row"><span class="k">Yanıt süresi</span><span class="v">${listing.response}</span></div>
    <div class="qi-row"><span class="k">Üyelik</span><span class="v">${listing.member}</span></div>
    <div class="qi-row"><span class="k">Doğrulama</span><span class="v ${listing.verified ? "ok" : ""}">${listing.verified ? "Tamamlandı" : "Bekliyor"}</span></div>
    <div class="mini-map">
      <div class="map-fallback"><b>${listing.district}</b><span>${listing.coords.join(", ")}</span></div>
    </div>`;

  document.getElementById("addCompare").addEventListener("click", () => {
    addToCart(listing.id);
    location.href = `teklif.html?s=${listing.id}`;
  });
}

function renderDetail() {
  listing = currentListing();
  renderBreadcrumb();
  renderTitle();
  renderPanel();
  renderSidebar();
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".tabs").addEventListener("click", (e) => {
    const tab = e.target.closest(".tab");
    if (!tab) return;
    activeTab = tab.dataset.tab;
    renderPanel();
  });
  renderDetail();
});

document.addEventListener("langchange", renderDetail);
