const NAV = [
  ["Home", "index.html"],
  ["Services", "services.html"],
  ["Portfolio", "portfolio.html"],
  ["E-Resources", "resources.html"],
  ["Contact", "contact.html"],
];

const SERVICES = [
  [
    "Finance & Economics",
    "Understand financial choices, economic context and the trade-offs behind a sustainable strategy.",
    ["Scenario planning", "Financial decision frameworks", "Economic perspective"],
  ],
  [
    "Human Psychology",
    "Explore behaviour, motivation and the human factors shaping decisions, relationships and teams.",
    ["Behavioural insight", "Communication", "Decision awareness"],
  ],
  [
    "Leadership",
    "Develop a considered leadership approach that connects purpose, people and everyday action.",
    ["Leadership reflection", "Team alignment", "Change conversations"],
  ],
  [
    "Management & Governance",
    "Create clarity in responsibilities, operating rhythms and the structures that support accountability.",
    ["Role clarity", "Governance design", "Operating principles"],
  ],
  [
    "Life Philosophy",
    "Make space to examine values, priorities and what a meaningful next chapter could look like.",
    ["Values exploration", "Personal direction", "Reflective practice"],
  ],
  [
    "Product Marketing",
    "Connect customer understanding, positioning and a practical story for bringing a product to market.",
    ["Positioning", "Customer insight", "Go-to-market thinking"],
  ],
  [
    "Politics",
    "Consider institutions, public issues and stakeholder perspectives with a balanced, analytical lens.",
    ["Policy context", "Stakeholder mapping", "Civic discussion"],
  ],
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const page = (location.pathname.split("/").pop() || "index.html").replace(
  "resource-detail.html",
  "resources.html",
);

const AR = '<span class="ar" aria-hidden="true">↗</span>';

const buildNavLinks = (className) =>
  NAV.map(([label, href]) => {
    const isCurrent = href === page;

    return `
      <a class="${className}${isCurrent ? " on" : ""}" href="${href}" ${
        isCurrent ? 'aria-current="page"' : ""
      }>
        ${label}
      </a>
    `;
  }).join("");

const siteHeader = $("#site-header");
if (siteHeader) {
  siteHeader.innerHTML = `
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur">
      <div class="wrap flex items-center justify-between h-[72px]">
        <a href="index.html" aria-label="Life Consultancy, home">
          <span class="serif text-xl block leading-none">Life Consultancy</span>
          <span class="text-[9px] tracking-[.14em] text-[var(--mut)]">CEO &amp; CONSULTANT</span>
        </a>

        <nav class="hidden md:flex items-center gap-8" aria-label="Primary">
          ${buildNavLinks("nl")}
          <a class="btn btn-p" href="contact.html?subject=Consultation">
            Book a consultation ${AR}
          </a>
        </nav>

        <div class="md:hidden flex items-center gap-4 text-[13px]">
          <a href="contact.html?subject=Consultation">Consult ${AR}</a>
          <button id="mb" aria-expanded="false" aria-controls="menu" class="min-h-[44px]">
            Menu
          </button>
        </div>
      </div>
    </header>

    <div id="menu" role="dialog" aria-modal="true" aria-label="Menu">
      <div class="flex justify-between items-center h-[48px]">
        <span class="serif text-xl">Life Consultancy</span>
        <button id="mc" class="min-h-[44px]">Close</button>
      </div>

      <nav class="mt-8 flex flex-col" aria-label="Mobile">
        ${buildNavLinks("l")}
      </nav>

      <a class="btn btn-p mt-auto" href="contact.html?subject=Consultation">
        Book a consultation ${AR}
      </a>
    </div>
  `;
}

const siteCta = $("#site-cta");
if (siteCta) {
  siteCta.innerHTML = `
    <section class="dk sec">
      <div class="wrap md:flex justify-between items-center gap-10 rv">
        <div>
          <p class="eyebrow">Let's think it through</p>
          <h2 class="serif h2 max-w-2xl">A clearer next chapter starts with a conversation.</h2>
          <p class="mut mt-4">
            Share the question you're working through. Let's explore a useful way forward.
          </p>
        </div>

        <a class="btn btn-l mt-8 md:mt-0 shrink-0" href="contact.html?subject=Consultation">
          Book a consultation ${AR}
        </a>
      </div>
    </section>
  `;
}

const siteFooter = $("#site-footer");
if (siteFooter) {
  siteFooter.innerHTML = `
    <footer class="iv pt-16 pb-8">
      <div class="wrap grid md:grid-cols-12 gap-10">
        <div class="md:col-span-5">
          <p class="serif text-3xl">Life Consultancy.</p>
          <p class="mut mt-4 max-w-sm">
            Thoughtful perspectives. Practical direction. Consulting for people and organisations
            navigating what comes next.
          </p>
        </div>

        <div class="md:col-span-4">
          <p class="eyebrow">Explore</p>
          <nav class="flex flex-wrap gap-x-5 gap-y-2 text-[13px]" aria-label="Footer">
            ${NAV.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}
          </nav>
          <a class="block mt-4 text-[13px] text-[var(--mut)]" href="contact.html">
            Start a conversation →
          </a>
        </div>

        <div class="md:col-span-3">
          <p class="eyebrow">Get in touch</p>
          <a class="text-[13px] text-[var(--brn)]" href="mailto:hello@davidbenson.example">
            hello@davidbenson.example
          </a>
          <p class="text-xs text-[var(--mut)] mt-3">
            Sample contact details — replace before publishing.
          </p>
        </div>
      </div>

      <div class="wrap mt-12 pt-6 border-t border-[var(--line)] flex flex-wrap justify-between gap-3 text-xs text-[var(--mut)]">
        <span>© 2026 Life Consultancy. Concept website.</span>
        <span class="flex gap-4">
          <a href="#">Privacy policy</a>
          <a href="#">Terms</a>
          <a href="#">Digital delivery</a>
        </span>
      </div>
    </footer>
  `;
}

$$("[data-services]").forEach((element) => {
  const isFull = element.dataset.services === "full";

  element.innerHTML = SERVICES.map(([title, description, areas], index) => {
    const serviceLink = `contact.html?area=${encodeURIComponent(title)}`;
    const previewText = isFull
      ? `<p class="eyebrow mt-5 mb-2">Areas to explore</p><p class="text-[13px] text-[var(--mut)]">${areas.join(" · ")}</p>`
      : "";

    return `
      <a class="srow rv" href="${serviceLink}">
        <span class="text-xs text-[var(--mut)]">0${index + 1}</span>
        <h3 class="serif h3 t">${title}</h3>
        <div>
          <p class="mut">${description}</p>
          ${previewText}
        </div>
        <span class="text-[13px] text-[var(--brn)]">
          ${isFull ? "Discuss this service" : "Explore service"} ${AR}
        </span>
      </a>
    `;
  }).join("") + '<div class="border-t border-[var(--line)]"></div>';
});

const mobileButton = $("#mb");
const mobileMenu = $("#menu");

if (mobileButton && mobileMenu) {
  const setMenuState = (open) => {
    mobileMenu.classList.toggle("open", open);
    mobileButton.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";

    if (open) {
      $("#mc").focus();
    } else {
      mobileButton.focus();
    }
  };

  mobileButton.onclick = () => setMenuState(true);
  $("#mc").onclick = () => setMenuState(false);

  addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuState(false);
    }
  });

  $$("#menu a").forEach((link) => {
    link.onclick = () => setMenuState(false);
  });
}

addEventListener("scroll", () => {
  $("header")?.classList.toggle("sc", scrollY > 8);
}, { passive: true });

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 },
);

requestAnimationFrame(() => {
  $$(".rv").forEach((element) => revealObserver.observe(element));
});
