const products = [
  { name: "Diva's Secret", car: "", price: 40, type: "A" },
  { name: "Choco Rumba", car: "", price: 36, type: "A" },
  { name: "Sky Beeze", car: "", price: 36, type: "A" },
  { name: "Dark Moon", car: "", price: 40, type: "A" },
  { name: "Mai Tai", car: "", price: 40, type: "A" },
  { name: "Mini Wrap de Salmon", car: "", price: 35, type: "C" },
  { name: "Langostinos Tempura", car: "", price: 36, type: "C" },
  { name: "Bocadillo Tropical", car: "", price: 30, type: "C" },
  { name: "Sunset Punch", car: "", price: 26, type: "B" },
  // Oferta especial
  // { name: "Pack Poli", car: " 🚓", price: 50, type: "OFFER", includes: ["Bocadillo Tropical", "Sunset Punch"] }
];

const cart = {};
let employeeDiscount = false; // estado del descuento de empleados

function renderProducts() {
  const container = document.getElementById("products");
  container.innerHTML = "";

  products.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <span>${p.name}${p.car} - ${p.price}€</span>
      <div class="add-controls">
        <input type="number" id="qty-${i}" value="1" min="1" class="qty-input">
        <button onclick="addToCart(${i})">Añadir</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function addToCart(index, fromButton = false) {
  const product = products[index];
  const input = document.getElementById(`qty-${index}`);
  const qtyToAdd = fromButton ? 1 : parseInt(input?.value || 1);

  if (qtyToAdd <= 0 || isNaN(qtyToAdd)) return;

  if (!cart[product.name]) {
    cart[product.name] = { ...product, qty: 0 };
  }
  cart[product.name].qty += qtyToAdd;

  updateList();
  showNotification(`🛒 Añadido ${qtyToAdd}x ${product.name}`);
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
            <button onclick="addToCart(${i}, true)">➕</button>
            <button onclick="removeFromCart(${i})">➖</button>
          </div>
        `;
        listEl.appendChild(row);

        // Desglose de productos incluidos
        p.includes.forEach(inc => {
          const subRow = document.createElement("div");
          subRow.className = "list-item sub";
          subRow.innerHTML = `<span class="item-info">↳ ${item.qty}x ${inc}</span>`;
          listEl.appendChild(subRow);
        });

      } else {
        // Productos normales
        row.innerHTML = `
          <span class="item-info">${item.qty}x ${item.name} ${subtotal}€</span>
          <div class="list-controls">
            <button onclick="addToCart(${i}, true)">➕</button>
            <button onclick="removeFromCart(${i})">➖</button>
          </div>
        `;
        listEl.appendChild(row);
      }
    }
  });

  // Comprobar y aplicar descuento de empleados si está activo
  const hasPackPoli = !!cart["Pack Poli"];
  if (employeeDiscount) {
    if (hasPackPoli) {
      // No se permite con Pack Poli
      showNotification("⚠️ El descuento no se puede aplicar con el Pack Poli");
      employeeDiscount = false;
      // quitar clase activa del botón si existe
      const btn = document.getElementById('employee-btn');
      if (btn) btn.classList.remove('active');
    } else {
      // calcular descuento del 25%
      const discountAmount = Math.round((total * 0.25) * 100) / 100;
      const totalAfter = Math.round((total - discountAmount) * 100) / 100;

      // Añadir línea en el listado indicando el descuento
      const discountRow = document.createElement('div');
      discountRow.className = 'list-item discount';
      discountRow.innerHTML = `<span class="item-info">Descuento empleados (25%)</span><span class="item-info">- ${discountAmount}€</span>`;
      listEl.appendChild(discountRow);

      totalEl.textContent = `Total: ${totalAfter}€ (Empleado)`;
      return;
    }
  }

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
    text += `${item.qty}x ${item.name}\n`;
  }

  // Si descuento de empleados activo y Pack Poli no está en el carrito, añadir línea
  const hasPackPoli = !!cart["Pack Poli"];
  if (employeeDiscount && !hasPackPoli) {
    // calcular total y descuento para incluir en copia
    let total = 0;
    for (let key in cart) {
      total += cart[key].qty * cart[key].price;
    }
    const discountAmount = Math.round((total * 0.25) * 100) / 100;
    const totalAfter = Math.round((total - discountAmount) * 100) / 100;
    text += `Descuento empleados (25%): -${discountAmount}€\n`;
    text += `Total: ${totalAfter}€\n`;
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

  // resetear estado de descuento de empleados
  employeeDiscount = false;
  const btn = document.getElementById('employee-btn');
  if (btn) btn.classList.remove('active');

  // 🔄 Resetear los inputs de cantidad a 1
  products.forEach((_, i) => {
    const input = document.getElementById(`qty-${i}`);
    if (input) input.value = 1;
  });

  showNotification("🔄 Carrito reseteado y cantidades restauradas");
}

// Toggle para descuento de empleados
function toggleEmployeeDiscount() {
  // si ya hay Pack Poli en carrito, no permitir
  const hasPackPoli = !!cart["Pack Poli"];
  if (!employeeDiscount && hasPackPoli) {
    showNotification("⚠️ No se puede activar el descuento con el Pack Poli en el carrito");
    return;
  }

  employeeDiscount = !employeeDiscount;
  const btn = document.getElementById('employee-btn');
  if (btn) {
    if (employeeDiscount) btn.classList.add('active'); else btn.classList.remove('active');
  }

  showNotification(employeeDiscount ? "✅ Descuento de empleados activado (25%)" : "🔔 Descuento de empleados desactivado");
  updateList();
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
