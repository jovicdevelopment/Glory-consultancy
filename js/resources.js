// Catalogue, filtering, search, cart, and detail page logic.
// Requires main.js for shared site UI and AR helper.

const PRODUCTS = [
  {
    id: "the-clarity-principle",
    title: "The Clarity Principle",
    subtitle: "A practical guide to better decisions",
    kind: "Book",
    price: 24,
    color: "#e5ddd0",
    description: "A reflective framework for navigating complexity and making more deliberate choices.",
  },
  {
    id: "leading-with-perspective",
    title: "Leading with Perspective",
    subtitle: "People, purpose & everyday leadership",
    kind: "Book",
    price: 18,
    color: "#dbe2d6",
    description: "Considered prompts for connecting leadership intentions with everyday actions.",
  },
  {
    id: "the-human-side-of-strategy",
    title: "The Human Side of Strategy",
    subtitle: "Understanding the decisions behind decisions",
    kind: "Article",
    price: 8,
    color: "#e6e4de",
    description: "An accessible exploration of behaviour, motivation and strategic thinking.",
  },
  {
    id: "the-direction-workbook",
    title: "The Direction Workbook",
    subtitle: "A toolkit for your next chapter",
    kind: "Project",
    price: 16,
    color: "#e8d6c3",
    description: "Structured worksheets to clarify priorities, map options and plan a next step.",
  },
  {
    id: "rethinking-value",
    title: "Rethinking Value",
    subtitle: "Beyond the immediate numbers",
    kind: "Article",
    price: 6,
    color: "#d9dfe0",
    description: "A concise perspective on economic trade-offs and longer-term value.",
  },
  {
    id: "discipline-switches",
    title: "Discipline Switches",
    subtitle: "A framework for applying discipline across life and leadership",
    kind: "Article",
    price: 8,
    color: "#e5ddd0",
    description: "An exploration of five discipline switches—what, how, where, when and why—and their application across different areas of life and leadership.",
    file: "assets/articles/discipline-switches.pdf",
  },
  {
    id: "the-positioning-canvas",
    title: "The Positioning Canvas",
    subtitle: "A clearer story for your product",
    kind: "Project",
    price: 12,
    color: "#e8e0c8",
    description: "A practical template for exploring audiences, differentiation and market narrative.",
  },
];

const money = (value) => `$${value.toFixed(2)}`;

const buildCover = (product, index) => `
  <div class="cover" style="background:#f1efe9">
    <div style="background:${product.color}">
      <span>THE PERSPECTIVE SERIES / 0${index + 1}</span>
      <b>${product.title}</b>
      <span>DAVID BENSON</span>
    </div>
  </div>
`;

const buildCard = (product) => {
  const index = PRODUCTS.indexOf(product);

  return `
    <article class="rv" data-k="${product.kind}">
      ${buildCover(product, index)}

      <div class="flex justify-between mt-4 text-[10.5px] tracking-[.1em] text-[var(--brn)]">
        <span>${product.kind.toUpperCase()} · DIGITAL PDF</span>
        <span class="text-[var(--ink)] text-sm font-medium">${money(product.price)}</span>
      </div>

      <h3 class="serif h3 mt-2">${product.title}</h3>
      <p class="mut mt-2 text-sm">${product.description}</p>

      <div class="grid grid-cols-2 gap-3 mt-4">
        <a class="btn" href="resource-detail.html?id=${product.id}">
          View Details ${AR}
        </a>
        <button class="btn btn-p" data-add="${product.id}">
          Add to Cart ${AR}
        </button>
      </div>
    </article>
  `;
};

const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem("cart")) || {};
  } catch {
    return {};
  }
};

let cart = loadCart();

const saveCart = () => {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch {
    // Ignore storage failures in this concept build.
  }

  paintCart();
};

function paintCart() {
  const itemCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);

  $$("[data-count]").forEach((element) => {
    element.textContent = `${itemCount} item${itemCount === 1 ? "" : "s"}`;
  });

  const cartList = $("#cart-list");
  if (!cartList) {
    return;
  }

  const productIds = Object.keys(cart).filter((id) => PRODUCTS.some((product) => product.id === id));

  if (!productIds.length) {
    cartList.innerHTML = '<li class="text-sm text-[var(--mut)]">Your cart is empty.</li>';
    return;
  }

  const subtotal = productIds.reduce((total, id) => {
    const product = PRODUCTS.find((entry) => entry.id === id);
    return total + cart[id] * product.price;
  }, 0);

  cartList.innerHTML = `
    ${productIds.map((id) => {
      const product = PRODUCTS.find((entry) => entry.id === id);
      return `
        <li class="flex justify-between items-center gap-3 py-3 border-b border-[var(--line)] text-sm">
          <span>
            ${product.title}<br>
            <span class="text-xs text-[var(--mut)]">Qty ${cart[id]} × ${money(product.price)}</span>
          </span>
          <button class="text-xs underline" data-rm="${id}" aria-label="Remove ${product.title}">
            Remove
          </button>
        </li>
      `;
    }).join("")}

    <li class="pt-3 text-sm font-medium flex justify-between">
      <span>Subtotal</span>
      <span>${money(subtotal)}</span>
    </li>
    <li class="text-xs text-[var(--mut)] pt-2">Checkout is not enabled in this concept.</li>
  `;
}

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const removeButton = event.target.closest("[data-rm]");

  if (addButton) {
    const productId = addButton.dataset.add;
    cart[productId] = (cart[productId] || 0) + 1;
    saveCart();
    $("#cart-panel")?.removeAttribute("hidden");
  }

  if (removeButton) {
    delete cart[removeButton.dataset.rm];
    saveCart();
  }

  if (event.target.closest("#cart-toggle")) {
    const cartPanel = $("#cart-panel");
    cartPanel.hidden = !cartPanel.hidden;
  }
});

const featuredSection = $("#featured");
if (featuredSection) {
  featuredSection.innerHTML = PRODUCTS.slice(0, 3).map(buildCard).join("");
}

const grid = $("#grid");
if (grid) {
  let activeCategory = "All";
  let searchTerm = "";

  const renderGrid = () => {
    const filteredProducts = PRODUCTS.filter((product) => {
      const matchesCategory = activeCategory === "All" || `${product.kind}s` === activeCategory;
      const searchableText = `${product.title} ${product.kind} ${product.description} ${product.subtitle}`.toLowerCase();
      const matchesSearch = searchableText.includes(searchTerm);

      return matchesCategory && matchesSearch;
    });

    grid.innerHTML =
      filteredProducts.map(buildCard).join("") ||
      '<p class="mut col-span-full">No resources match. Try a different search or clear the filter.</p>';

    const shownText = $("#shown");
    if (shownText) {
      shownText.textContent = `Showing ${filteredProducts.length === PRODUCTS.length ? "all " : ""}${filteredProducts.length} resource${filteredProducts.length === 1 ? "" : "s"}`;
    }

    $$("#grid .rv").forEach((element) => element.classList.add("in"));
  };

  $$("[data-cat]").forEach((button) => {
    button.onclick = () => {
      activeCategory = button.dataset.cat;

      $$("[data-cat]").forEach((item) => {
        item.setAttribute("aria-pressed", String(item === button));
      });

      renderGrid();
    };
  });

  $("#q").oninput = (event) => {
    searchTerm = event.target.value.trim().toLowerCase();
    renderGrid();
  };

  renderGrid();
}

const detailSection = $("#detail");
if (detailSection) {
  const urlParams = new URLSearchParams(location.search);
  const product = PRODUCTS.find((entry) => entry.id === urlParams.get("id")) || PRODUCTS[0];
  const productIndex = PRODUCTS.indexOf(product);

  document.title = `${product.title} — Life Consultancy`;

  detailSection.innerHTML = `
    <div class="wrap pt-10">
      <p class="text-xs text-[var(--brn)]">
        <a href="resources.html">E-Resources</a> / ${product.kind}s / ${product.title}
      </p>

      <div class="grid md:grid-cols-2 gap-12 mt-8">
        <div class="iv rounded-lg p-8">
          ${buildCover(product, productIndex)}
          <p class="text-xs text-[var(--mut)] mt-4">Digital PDF edition · No physical item</p>
        </div>

        <div>
          <p class="eyebrow">${product.kind} / The Perspective Series</p>
          <h1 class="serif h1">${product.title}</h1>
          <p class="serif text-2xl text-[var(--mut)] mt-4">${product.subtitle}</p>
          <p class="text-sm text-[var(--brn)] mt-4">By David Benson</p>
          <p class="mut mt-4">${product.description}</p>

          <div class="flex justify-between items-baseline border-t border-[var(--line)] mt-6 pt-6">
            <span class="serif text-4xl">${money(product.price)}</span>
            <span class="text-[10px] tracking-widest text-[var(--mut)]">USD · DIGITAL PDF</span>
          </div>

          <div class="grid grid-cols-2 gap-3 mt-4">
            <button class="btn btn-p" data-add="${product.id}">Buy Now ${AR}</button>
            <button class="btn" data-add="${product.id}">Add to Cart ${AR}</button>
          </div>

          ${product.file ? `
            <section class="mt-8 border-t border-[var(--line)] pt-6">
              <h2 class="serif h2 mb-4">Read the article</h2>
              <p class="mut mb-4">Read the full article below, or <a class="underline" href="${product.file}" target="_blank" rel="noopener">open the PDF in a new tab</a>.</p>
              <iframe class="w-full h-[75vh] rounded border border-[var(--line)]" src="${product.file}" title="${product.title} PDF by David Benson"></iframe>
            </section>
          ` : ""}

          <p class="text-xs text-[var(--mut)] mt-3">
            Sample product and pricing; purchase and digital delivery are not enabled in this concept.
          </p>

          <dl class="mt-6 border-t border-[var(--line)] pt-4 text-xs grid grid-cols-[1fr_auto] gap-y-2 text-[var(--mut)]">
            <dt>Author</dt>
            <dd class="text-[var(--ink)]">David Benson</dd>
            <dt>Format</dt>
            <dd class="text-[var(--ink)]">Digital PDF</dd>
            <dt>Language</dt>
            <dd class="text-[var(--ink)]">English</dd>
            <dt>Category</dt>
            <dd class="text-[var(--ink)]">${product.kind}s · Decision-making</dd>
          </dl>
        </div>
      </div>
    </div>

    <section class="iv sec mt-16">
      <div class="wrap grid md:grid-cols-2 gap-12">
        <div>
          <p class="eyebrow">About the ${product.kind.toLowerCase()}</p>
          <h2 class="serif h2">${product.file ? "Five questions for intentional discipline." : "Better decisions begin with a better question."}</h2>
          <p class="mut mt-5">
            ${product.file ? product.description : `${product.title} is a proposed guide to slowing down the thinking process without losing momentum. It explores how to define a decision, understand its context and separate meaningful signals from noise.`}
          </p>
          ${product.file ? "" : '<p class="text-xs text-[var(--mut)] mt-4">Editorial description is illustrative. Final content is to be confirmed.</p>'}
        </div>

        <div class="card self-start">
          <p class="eyebrow">Ideas to explore</p>
          <ul class="space-y-3 text-sm">
            <li>✓ Frame the question before seeking the answer.</li>
            <li>✓ Recognise assumptions and competing priorities.</li>
            <li>✓ Consider options through different perspectives.</li>
            <li>✓ Turn reflection into a deliberate next step.</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="sec">
      <div class="wrap">
        <p class="eyebrow">Before you buy</p>
        <h2 class="serif h2 mb-8">A few practical details.</h2>

        <div class="grid md:grid-cols-3 gap-8">
          ${[
            [
              "Is this a physical book?",
              "No. This resource is presented as a digital PDF. There is no shipping or printed edition in this catalogue.",
            ],
            [
              "Who is it designed for?",
              "Readers looking for a reflective, practical way to approach complex choices in work and life.",
            ],
            [
              "How would delivery work?",
              "Download access, licensing, taxes and refund terms need to be finalised before the marketplace goes live.",
            ],
          ].map(
            ([question, answer]) => `
              <details class="border-t border-[var(--line)] pt-4">
                <summary class="serif h3 cursor-pointer">${question}</summary>
                <p class="mut mt-3">${answer}</p>
              </details>
            `,
          ).join("")}
        </div>
      </div>
    </section>

    <section class="wrap pb-20">
      <p class="eyebrow">Continue exploring</p>
      <h2 class="serif h2 mb-8">More from the perspective library.</h2>
      <div class="grid md:grid-cols-3 gap-6">
        ${PRODUCTS.filter((entry) => entry !== product).slice(0, 3).map(buildCard).join("")}
      </div>
    </section>
  `;
}

paintCart();
$$(".rv").forEach((element) => revealObserver.observe(element));
