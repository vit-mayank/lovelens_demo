/* ===== CONFIG: edit these ===== */
// Enquiry destination. Leave "" for demo mode (nothing is sent).
// To go live, paste a form-service endpoint URL (e.g. Formspree or Web3Forms). Never put secret keys here.
const FORM_ENDPOINT = "";
const CATEGORIES = { all: "All", wedding: "Weddings", prewedding: "Pre-Weddings", celebration: "Celebrations" }; // confirm before launch
const IMG = "assets/images/";
const EXT = ".webp"; // change to ".jpg" or ".webp" after swapping in real photos
const GALLERY = [ // id = file name without extension; w/h = real pixel size
  { id: "portfolio-wedding-01", cat: "wedding", w: 800, h: 1000, alt: "Wedding portrait placeholder" },
  { id: "portfolio-wedding-02", cat: "wedding", w: 800, h: 600, alt: "Wedding ceremony placeholder" },
  { id: "portfolio-prewedding-03", cat: "prewedding", w: 800, h: 800, alt: "Pre-wedding couple placeholder" },
  { id: "portfolio-wedding-04", cat: "wedding", w: 800, h: 1100, alt: "Wedding portrait placeholder" },

  { id: "portfolio-celebration-06", cat: "celebration", w: 800, h: 1000, alt: "Celebration moment placeholder" },
  { id: "portfolio-prewedding-07", cat: "prewedding", w: 800, h: 800, alt: "Pre-wedding portrait placeholder" },

];
/* ===== end config ===== */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
$("#year").textContent = new Date().getFullYear();

/* Mobile nav */
const toggle = $(".nav-toggle"), menu = $("#menu");
const setMenu = open => { menu.classList.toggle("open", open); toggle.setAttribute("aria-expanded", open); toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu"); };
toggle.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
menu.addEventListener("click", e => e.target.closest("a") && setMenu(false));
document.addEventListener("keydown", e => e.key === "Escape" && setMenu(false));

/* Active nav link */
const links = $$(".menu a");
const io = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
$$("main section[id]").forEach(s => io.observe(s));

/* Gallery */
const gallery = $("#gallery"), filters = $("#filters");
let visible = [...GALLERY], current = 0;
const fallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Crect width='4' height='5' fill='%23f3e8d8'/%3E%3C/svg%3E";
function renderGallery(cat) {
  visible = GALLERY.filter(g => cat === "all" || g.cat === cat);
  gallery.innerHTML = "";
  visible.forEach((g, i) => {
    const li = document.createElement("li"), b = document.createElement("button"), img = new Image();
    b.type = "button"; b.setAttribute("aria-label", "Open photo: " + g.alt);
    img.src = IMG + g.id + EXT; img.alt = ""; img.width = g.w; img.height = g.h; img.loading = "lazy";
    img.onerror = () => { img.onerror = null; img.src = fallback; };
    b.append(img); li.append(b); gallery.append(li);
    b.addEventListener("click", () => openLb(i));
  });
}
Object.entries(CATEGORIES).forEach(([k, label]) => {
  const b = document.createElement("button"); b.type = "button"; b.textContent = label; b.setAttribute("aria-pressed", k === "all");
  b.addEventListener("click", () => { $$("button", filters).forEach(x => x.setAttribute("aria-pressed", x === b)); renderGallery(k); });
  filters.append(b);
});
renderGallery("all");

/* Lightbox (native <dialog>: focus trap + Escape built in) */
const lb = $("#lightbox"), lbImg = $("#lb-img");
function showLb() { const g = visible[current]; lbImg.src = IMG + g.id + EXT; lbImg.alt = g.alt; }
function openLb(i) { current = i; showLb(); document.body.classList.add("lock"); lb.showModal(); $(".lb-close").focus(); }
const step = d => { current = (current + d + visible.length) % visible.length; showLb(); };
$(".lb-close").onclick = () => lb.close();
$(".lb-prev").onclick = () => step(-1);
$(".lb-next").onclick = () => step(1);
lb.addEventListener("close", () => document.body.classList.remove("lock"));
lb.addEventListener("click", e => { if (e.target === lb) lb.close(); });
lb.addEventListener("keydown", e => { if (e.key === "ArrowLeft") step(-1); if (e.key === "ArrowRight") step(1); });

/* Service links preselect event type */
$$("[data-event]").forEach(a => a.addEventListener("click", () => { $("#type").value = a.dataset.event; toggleOther(); }));

/* Form */
const form = $("#enquiry-form"), status = $("#status"), btn = $("#submit");
function toggleOther() { $("#other-wrap").hidden = $("#type").value !== "Other"; }
$("#type").addEventListener("change", toggleOther);
const setErr = (id, msg) => { $("#" + id + "-err").textContent = msg; const f = $("#" + id); f.classList.toggle("invalid", !!msg); f.setAttribute("aria-invalid", !!msg); if (msg) f.setAttribute("aria-describedby", id + "-err"); return !msg; };
function validate() {
  const v = n => form.elements[n].value.trim();
  const digits = v("phone").replace(/\D/g, "");
  const r = [
    setErr("name", v("name") ? "" : "Please enter your name."),
    setErr("phone", !v("phone") ? "Please enter a phone number." : (!/^[+\d\s()\-.]+$/.test(v("phone")) || digits.length < 7 || digits.length > 15) ? "Enter a valid phone number (7 to 15 digits)." : ""),
    setErr("email", v("email") && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v("email")) ? "Enter a valid email address." : ""),
    setErr("message", v("message") ? "" : "Please write a short message."),
  ];
  const bad = r.indexOf(false);
  if (bad > -1) ["name", "phone", "email", "message"].map(id => $("#" + id))[bad].focus();
  return bad === -1;
}
form.addEventListener("submit", async e => {
  e.preventDefault();
  if (btn.disabled) return;
  status.className = "status"; status.textContent = "";
  if (!validate()) return;
  btn.disabled = true; btn.textContent = "Sending…";
  try {
    if (!FORM_ENDPOINT) { // DEMO MODE: nothing is transmitted
      await new Promise(r => setTimeout(r, 600));
      status.className = "status info";
      status.textContent = "Demo mode: your details were checked but not sent, because no enquiry destination is connected yet.";
      return;
    }
    const res = await fetch(FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
    if (!res.ok) throw new Error(res.status);
    status.className = "status ok"; status.textContent = "Thank you. Your enquiry has been sent.";
    form.reset(); toggleOther();
  } catch {
    status.className = "status bad"; status.textContent = "Sorry, your enquiry could not be sent. Please try again.";
  } finally { btn.disabled = false; btn.textContent = "Send Enquiry"; }
});

/* Scroll reveal (respects reduced motion) */
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const ro = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); ro.unobserve(en.target); } }), { threshold: .12 });
  $$(".section .wrap > *, .cta-band .wrap > *").forEach(el => { el.classList.add("reveal"); ro.observe(el); });
}
