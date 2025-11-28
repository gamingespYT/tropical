const products = [
  { id: 'DS', name: "Diva's Secret", car: "", price: 40, type: "A" },
  { id: 'CR', name: "Choco Rumba", car: "", price: 36, type: "A" },
  { id: 'SB', name: "Sky Beeze", car: "", price: 36, type: "A" },
  { id: 'DM', name: "Dark Moon", car: "", price: 40, type: "A" },
  { id: 'MT', name: "Mai Tai", car: "", price: 40, type: "A" },
  { id: 'MWS', name: "Mini Wrap de Salmon", car: "", price: 35, type: "C" },
  { id: 'LT', name: "Langostinos Tempura", car: "", price: 36, type: "C" },
  { id: 'BT', name: "Bocadillo Tropical", car: "", price: 30, type: "C" },
  { id: 'SP', name: "Sunset Punch", car: "", price: 26, type: "B" },
  // Oferta especial
  // { id: 'PP', name: "Pack Poli", car: " 🚓", price: 50, type: "OFFER", includes: ["Bocadillo Tropical", "Sunset Punch"] }
];

const cart = {};
let employeeDiscount = false; // estado del descuento de empleados
let customDiscountPercent = 0; // porcentaje de descuento personalizado
let customDiscountReason = ''; // motivo del descuento personalizado

function renderProducts() {
  const container = document.getElementById("products");
  container.innerHTML = "";

  products.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <span>${p.name}${p.car} - ${p.price}€</span>
      <input type="number" id="qty-${i}" value="1" min="1" class="qty-input">
      <button onclick="addToCart(${i})">Añadir</button>
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

function deleteFromCart(index) {
  const product = products[index];

  if (cart[product.name]) {
    delete cart[product.name];
    showNotification(`🗑️ ${product.name} eliminado del carrito`);
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
            <button onclick="deleteFromCart(${i})" class="delete-btn" title="Eliminar línea">🗑️</button>
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
            <button onclick="deleteFromCart(${i})" class="delete-btn" title="Eliminar línea">🗑️</button>
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
      // calcular descuento del 25% con redondeo hacia arriba
      const discountAmount = Math.ceil(total * 0.25);
      const totalAfter = total - discountAmount;

      // Añadir línea en el listado indicando el descuento
      const discountRow = document.createElement('div');
      discountRow.className = 'list-item discount';
      discountRow.innerHTML = `<span class="item-info">Descuento empleados (25%)</span><span class="item-info">- ${discountAmount}€</span>`;
      listEl.appendChild(discountRow);

      totalEl.textContent = `Total: ${totalAfter}€ (Empleado)`;
      return;
    }
  }

  // Comprobar y aplicar descuento personalizado si está activo
  if (customDiscountPercent > 0) {
    if (hasPackPoli) {
      // No se permite con Pack Poli
      showNotification("⚠️ El descuento no se puede aplicar con el Pack Poli");
      customDiscountPercent = 0;
      const btn = document.getElementById('custom-discount-btn');
      if (btn) btn.classList.remove('active');
      const panel = document.getElementById('custom-discount-panel');
      if (panel) panel.style.display = 'none';
    } else {
      // calcular descuento personalizado con redondeo hacia arriba
      const discountAmount = Math.ceil(total * (customDiscountPercent / 100));
      const totalAfter = total - discountAmount;

      // Añadir línea en el listado indicando el descuento
      const discountRow = document.createElement('div');
      discountRow.className = 'list-item discount';
      const discountLabel = customDiscountReason ? `Descuento ${customDiscountReason} (${customDiscountPercent}%)` : `Descuento personalizado (${customDiscountPercent}%)`;
      discountRow.innerHTML = `<span class="item-info">${discountLabel}</span><span class="item-info">- ${discountAmount}€</span>`;
      listEl.appendChild(discountRow);

      totalEl.textContent = `Total: ${totalAfter}€ (Descuento ${customDiscountPercent}%)`;
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
    // Redondeo hacia arriba para descuento
    const discountAmount = Math.ceil(total * 0.25);
    const totalAfter = total - discountAmount;
    text += `Descuento empleados (25%): -${discountAmount}€\n`;
    text += `Total: ${totalAfter}€\n`;
  } else if (customDiscountPercent > 0 && !hasPackPoli) {
    // calcular total y descuento personalizado para incluir en copia
    let total = 0;
    for (let key in cart) {
      total += cart[key].qty * cart[key].price;
    }
    const discountAmount = Math.ceil(total * (customDiscountPercent / 100));
    const totalAfter = total - discountAmount;
    const discountLabel = customDiscountReason ? `Descuento ${customDiscountReason} (${customDiscountPercent}%)` : `Descuento personalizado (${customDiscountPercent}%)`;
    text += `${discountLabel}: -${discountAmount}€\n`;
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

  // resetear estado de descuento personalizado
  customDiscountPercent = 0;
  customDiscountReason = '';
  const customBtn = document.getElementById('custom-discount-btn');
  if (customBtn) customBtn.classList.remove('active');
  const customPanel = document.getElementById('custom-discount-panel');
  if (customPanel) customPanel.style.display = 'none';
  const customInput = document.getElementById('custom-discount-input');
  if (customInput) customInput.value = '';
  const reasonInput = document.getElementById('custom-discount-reason');
  if (reasonInput) reasonInput.value = '';

  // 🔄 Resetear los inputs de cantidad a 1
  products.forEach((_, i) => {
    const input = document.getElementById(`qty-${i}`);
    if (input) input.value = 1;
  });

  // Resetear input global
  const global = document.getElementById('global-qty');
  if (global) global.value = 1;

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

// Establecer cantidad global para todos los inputs de producto
function setGlobalQty(value) {
  const num = parseInt(value, 10);
  if (isNaN(num) || num < 1) return;
  products.forEach((_, i) => {
    const input = document.getElementById(`qty-${i}`);
    if (input) input.value = num;
  });
}

// Funciones para el diálogo de factura
function openInvoiceDialog() {
  if (Object.keys(cart).length === 0) {
    showNotification("⚠️ No hay productos en el carrito");
    return;
  }

  const dialog = document.getElementById('invoice-dialog');
  if (dialog) {
    dialog.showModal();
  }
}

function closeInvoiceDialog() {
  const dialog = document.getElementById('invoice-dialog');
  if (dialog) {
    dialog.close();
    // Limpiar el formulario
    document.getElementById('invoice-form').reset();
  }
}

function generateInvoice(event) {
  event.preventDefault();

  const name = document.getElementById('invoice-name').value.trim();
  const surname = document.getElementById('invoice-surname').value.trim();
  const phone = document.getElementById('invoice-phone').value.trim();

  if (!name || !surname || !phone) {
    showNotification("⚠️ Por favor, completa todos los campos");
    return;
  }

  // Preparar datos de la factura
  const invoiceData = {
    name: name,
    surname: surname,
    phone: phone,
    items: [],
    employeeDiscount: employeeDiscount,
    customDiscountPercent: customDiscountPercent,
    customDiscountReason: customDiscountReason,
    date: new Date().toISOString()
  };

  // Añadir productos del carrito
  let total = 0;
  for (let key in cart) {
    const item = cart[key];
    const subtotal = item.qty * item.price;
    total += subtotal;

    // Store compact id to reduce encoded URL length; keep qty/price/subtotal
    invoiceData.items.push({
      id: item.id || item.name,
      qty: item.qty,
      price: item.price,
      subtotal: subtotal
    });
  }

  invoiceData.total = total;

  // Calcular descuento si aplica
  if (employeeDiscount && !cart["Pack Poli"]) {
    const discountAmount = Math.ceil(total * 0.25);
    invoiceData.discount = discountAmount;
    invoiceData.discountType = 'employee';
    invoiceData.finalTotal = total - discountAmount;
  } else if (customDiscountPercent > 0 && !cart["Pack Poli"]) {
    const discountAmount = Math.ceil(total * (customDiscountPercent / 100));
    invoiceData.discount = discountAmount;
    invoiceData.discountType = 'custom';
    invoiceData.finalTotal = total - discountAmount;
  } else {
    invoiceData.finalTotal = total;
  }

  // Codificar datos en formato compacto (v2) para URL — muy corto y sin Base64
  // Formato v2: campos separados por '|' y items separados por ',' con subcampos '~'
  // order: dateMs | name | surname | phone | total | discount | dType | finalTotal | invoiceNumber | items
  // item: id~qty~price~subtotal
  const dateMs = Date.parse(invoiceData.date) || Date.now();
  const dType = invoiceData.discountType === 'employee' ? 'e' : (invoiceData.discountType === 'custom' ? 'c' : 'n');
  const itemsStr = invoiceData.items.map(it => `${it.id}~${it.qty}~${it.price}~${it.subtotal}`).join(',');
  const customPercent = invoiceData.customDiscountPercent || 0;
  const customReason = invoiceData.customDiscountReason || '';
  const compact = [dateMs, invoiceData.name || '', invoiceData.surname || '', invoiceData.phone || '', invoiceData.total || 0, invoiceData.discount || 0, dType, invoiceData.finalTotal || 0, invoiceData.invoiceNumber || '', customPercent, customReason, itemsStr].join('|');
  const encodedData = 'v2:' + encodeURIComponent(compact);

  // Generar URL de la factura
  const invoiceURL = `${window.location.origin}${window.location.pathname.replace('calculadora/index.html', 'facturas/index.html').replace('calculadora/', '../facturas/')}?data=${encodedData}`;

  // Abrir en nueva pestaña
  window.open(invoiceURL, '_blank');

  // Cerrar diálogo
  closeInvoiceDialog();

  showNotification("✅ Factura generada correctamente");
}

// Toggle para descuento personalizado
function toggleCustomDiscount() {
  const panel = document.getElementById('custom-discount-panel');
  const btn = document.getElementById('custom-discount-btn');

  if (panel.style.display === 'none' || panel.style.display === '') {
    // Verificar si hay Pack Poli en el carrito
    const hasPackPoli = !!cart["Pack Poli"];
    if (hasPackPoli) {
      showNotification("⚠️ No se puede activar el descuento con el Pack Poli en el carrito");
      return;
    }

    // Desactivar descuento de empleados si está activo
    if (employeeDiscount) {
      employeeDiscount = false;
      const empBtn = document.getElementById('employee-btn');
      if (empBtn) empBtn.classList.remove('active');
    }

    panel.style.display = 'block';
    btn.classList.add('active');
  } else {
    panel.style.display = 'none';
    btn.classList.remove('active');
    customDiscountPercent = 0;
    customDiscountReason = '';
    const input = document.getElementById('custom-discount-input');
    if (input) input.value = '';
    const reasonInput = document.getElementById('custom-discount-reason');
    if (reasonInput) reasonInput.value = '';
    updateList();
  }
}

// Aplicar descuento personalizado
function applyCustomDiscount() {
  const input = document.getElementById('custom-discount-input');
  const value = parseFloat(input.value);

  if (isNaN(value) || value < 0 || value > 100) {
    showNotification("⚠️ Por favor, introduce un porcentaje válido (0-100)");
    return;
  }

  // Verificar si hay Pack Poli en el carrito
  const hasPackPoli = !!cart["Pack Poli"];
  if (hasPackPoli) {
    showNotification("⚠️ No se puede aplicar el descuento con el Pack Poli en el carrito");
    return;
  }

  customDiscountPercent = value;

  // Capturar el motivo (opcional)
  const reasonInput = document.getElementById('custom-discount-reason');
  customDiscountReason = reasonInput ? reasonInput.value.trim() : '';

  if (value === 0) {
    showNotification("🔔 Descuento personalizado desactivado");
  } else {
    showNotification(`✅ Descuento personalizado del ${value}% aplicado`);
  }

  updateList();
}

renderProducts();
