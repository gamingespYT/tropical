const products = [
  { name: "Diva's Secret",car: "", price: 40, type: "A" },
  { name: "Choco Rumba",car: "", price: 36, type: "A" },
  { name: "Sky Beeze",car: "", price: 36, type: "A" },
  { name: "Dark Moon",car: "", price: 40, type: "A" },
  { name: "Mai Tai",car: "", price: 40, type: "A" },
  { name: "Mini Wrap de Salmon",car: "", price: 35, type: "C" },
  { name: "Langostinos Tempura",car: "", price: 36, type: "C" },
  { name: "Bocadillo Tropical",car: "", price: 30, type: "C" },
  { name: "Sunset Punch",car: "", price: 26, type: "B" },
  // Oferta especial
  { name: "Pack Poli",car: " 🚓", price: 50, type: "OFFER", includes: ["Bocadillo Tropical", "Sunset Punch"] }
];

const cart = {};

function renderProducts() {
  const container = document.getElementById("products");
  products.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <span>${p.name}${p.car} - ${p.price}€</span>
      <button onclick="addToCart(${i})">Añadir</button>
    `;
    container.appendChild(div);
  });
}

function addToCart(index) {
  const product = products[index];

  if (!cart[product.name]) {
    cart[product.name] = { ...product, qty: 0 };
  }
  cart[product.name].qty++;

  updateList();
}

function removeFromCart(index) {
  const product = products[index];

  if (cart[product.name]) {
    cart[product.name].qty--;
    if (cart[product.name].qty <= 0) {
      delete cart[product.name];
    }
  }

  updateList();
}

function updateList() {
  const listEl = document.getElementById("list");
  const totalEl = document.getElementById("total");
  let total = 0;

  if (Object.keys(cart).length === 0) {
    listEl.textContent = "Añade productos para ver el detalle aquí...";
    totalEl.textContent = "Total: 0€";
    return;
  }

  listEl.innerHTML = "";

  products.forEach((p, i) => {
    if (cart[p.name]) {
      const item = cart[p.name];
      const subtotal = item.qty * item.price;
      total += subtotal;

      const row = document.createElement("div");
      row.className = "list-item";

      if (p.type === "OFFER") {
        // Pack Poli especial
        row.innerHTML = `
          <span class="item-info">${item.qty}x ${p.name} ${subtotal}€</span>
          <div class="list-controls">
            <button onclick="addToCart(${i})">+</button>
            <button onclick="removeFromCart(${i})">-</button>
          </div>
        `;
        listEl.appendChild(row);

        // Desglose de productos incluidos
        p.includes.forEach(inc => {
          const subRow = document.createElement("div");
          subRow.className = "list-item";
          subRow.style.marginLeft = "20px";
          subRow.innerHTML = `<span class="item-info">↳ ${item.qty}x ${inc}</span>`;
          listEl.appendChild(subRow);
        });

      } else {
        // Productos normales
        row.innerHTML = `
          <span class="item-info">${item.qty}x ${item.name} ${subtotal}€</span>
          <div class="list-controls">
            <button onclick="addToCart(${i})">+</button>
            <button onclick="removeFromCart(${i})">-</button>
          </div>
        `;
        listEl.appendChild(row);
      }
    }
  });

  totalEl.textContent = `Total: ${total}€`;
}

function copyList() {
  if (Object.keys(cart).length === 0) {
    showNotification("⚠️ No hay nada que copiar");
    return;
  }

  let text = "";
  for (let key in cart) {
    const item = cart[key];
    text += `${item.qty}x ${item.name}\n`; // 👈 Solo nombre principal
  }

  navigator.clipboard.writeText(text).then(() => {
    showNotification("✅ Lista copiada al portapapeles");
  });
}

function resetCart() {
  for (let key in cart) {
    delete cart[key];
  }
  updateList();
  showNotification("🔄 Carrito reseteado");
}

function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

renderProducts();
