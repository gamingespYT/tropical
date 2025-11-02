const ingredients = [
  { name: "Whisky 🥃", price: 7, aisle: "9C" },
  { name: "Mora 🍇", price: 3, aisle: "26" },
  { name: "Arándanos 🫐", price: 2, aisle: "26" },
  { name: "Ginebra 🍸", price: 5, aisle: "9C" },
  { name: "Frambuesa 🍓", price: 3, aisle: "26" },
  { name: "Pétalos de Rosa 🌹", price: 4, aisle: "2D" },
  { name: "Licor 34 🥃", price: 6, aisle: "9C" },
  { name: "Latacacao 🍫", price: 6, aisle: "2D" },
  { name: "Ron Blanco 🥃", price: 5, aisle: "9C" },
  { name: "Naranja 🍊", price: 3, aisle: "26" },
  { name: "Lima 🍋", price: 5, aisle: "26" },
  { name: "Vodka 🍸", price: 5, aisle: "9C" },
  { name: "Limón 🍋", price: 2, aisle: "26" },
  { name: "Coco 🥥", price: 4, aisle: "26" },
  { name: "Huevo 🥚", price: 2, aisle: "24" },
  { name: "Queso 🧀", price: 2, aisle: "24" },
  { name: "Salmón 🐟", price: 2, aisle: "28" },
  { name: "Harina 🌾", price: 2, aisle: "1B" },
  { name: "Langostino 🦐", price: 5, aisle: "28" },
  { name: "Aceite 🫒", price: 3, aisle: "1B" },
  { name: "Pan 🍞", price: 1, aisle: "1B" },
  { name: "Piña 🍍", price: 3, aisle: "26" },
  { name: "Bacon 🥓", price: 2, aisle: "31" }
];

const aisleOrder = ["1B", "2D", "9C", "24", "26", "28", "31"];
const aisleNames = {
  "1B": "Harina, Aceite y Pan",
  "2D": "Repostería",
  "9C": "Bebidas Alcohólicas",
  "24": "Lácteos",
  "26": "Frutas y Verduras",
  "28": "Pescadería",
  "31": "Carnicería"
};

const packs = [
  { name: "Diva's Secret 🍸", ingredients: ["Ginebra 🍸", "Frambuesa 🍓", "Pétalos de Rosa 🌹"] },
  { name: "Choco Rumba 🍫", ingredients: ["Latacacao 🍫", "Licor 34 🥃"] },
  { name: "Sky Breeze 🍹", ingredients: ["Limón 🍋", "Arándanos 🫐", "Vodka 🍸"] },
  { name: "Dark Moon 🌙", ingredients: ["Mora 🍇", "Arándanos 🫐", "Whisky 🥃"] },
  { name: "Mini Wrap de Salmón 🌯", ingredients: ["Huevo 🥚", "Queso 🧀", "Salmón 🐟"] },
  { name: "Langostinos Tempura 🍤", ingredients: ["Harina 🌾", "Langostino 🦐", "Aceite 🫒"] },
  { name: "Bocadillo Tropical 🥪", ingredients: ["Pan 🍞", "Piña 🍍", "Bacon 🥓", "Queso 🧀", "Huevo 🥚"] },
  { name: "Sunset Punch 🍹", ingredients: ["Coco 🥥", "Naranja 🍊"] },
  { name: "Mai Tai 🍹", ingredients: ["Ron Blanco 🥃", "Lima 🍋", "Naranja 🍊"] }
];

const cart = {};
const striked = {};
const packCounts = {};

// Cargar datos del localStorage
function loadFromStorage() {
  const savedCart = localStorage.getItem('tropicalCart');
  const savedStriked = localStorage.getItem('tropicalStriked');
  const savedPackCounts = localStorage.getItem('tropicalPackCounts');
  
  if (savedCart) {
    Object.assign(cart, JSON.parse(savedCart));
  }
  if (savedStriked) {
    Object.assign(striked, JSON.parse(savedStriked));
  }
  if (savedPackCounts) {
    Object.assign(packCounts, JSON.parse(savedPackCounts));
  }
}

// Guardar datos en localStorage
function saveToStorage() {
  localStorage.setItem('tropicalCart', JSON.stringify(cart));
  localStorage.setItem('tropicalStriked', JSON.stringify(striked));
  localStorage.setItem('tropicalPackCounts', JSON.stringify(packCounts));
}

function renderLists() {
  const ingContainer = document.getElementById("ingredients");
  const packContainer = document.getElementById("packs");

  ingredients.forEach((item) => {
    const div = document.createElement("div");
    div.className = "item";
    
    const nameSpan = document.createElement("span");
    nameSpan.textContent = `${item.name} - ${item.price}€`;
    
    const buttonsDiv = document.createElement("div");
    buttonsDiv.className = "item-controls";
    
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "➖";
    removeBtn.onclick = function() { removeItem(item.name); updateIngredientDisplay(item.name); };
    
    const quantitySpan = document.createElement("span");
    quantitySpan.className = "quantity";
    quantitySpan.id = `qty-${item.name}`;
    quantitySpan.textContent = "0";
    
    const addBtn = document.createElement("button");
    addBtn.textContent = "➕";
    addBtn.onclick = function() { addItem(item.name, item.price); updateIngredientDisplay(item.name); };
    
    const add10Btn = document.createElement("button");
    add10Btn.textContent = "➕10";
    add10Btn.className = "add10-btn";
    add10Btn.onclick = function() { addItems(item.name, item.price, 10); updateIngredientDisplay(item.name); };
    
    buttonsDiv.appendChild(removeBtn);
    buttonsDiv.appendChild(quantitySpan);
    buttonsDiv.appendChild(addBtn);
    buttonsDiv.appendChild(add10Btn);
    div.appendChild(nameSpan);
    div.appendChild(buttonsDiv);
    ingContainer.appendChild(div);
  });

  packs.forEach((pack) => {
    const div = document.createElement("div");
    div.className = "item";
    
    const nameSpan = document.createElement("span");
    nameSpan.textContent = pack.name;
    
    const buttonsDiv = document.createElement("div");
    buttonsDiv.className = "item-controls";
    
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "➖";
    removeBtn.onclick = function() { removePack(pack.name); updatePackDisplay(pack.name); };
    
    const quantitySpan = document.createElement("span");
    quantitySpan.className = "quantity";
    quantitySpan.id = `qty-pack-${pack.name}`;
    quantitySpan.textContent = "0";
    
    const addBtn = document.createElement("button");
    addBtn.textContent = "➕";
    addBtn.onclick = function() { addPack(pack.name); updatePackDisplay(pack.name); };
    
    const add10Btn = document.createElement("button");
    add10Btn.textContent = "➕10";
    add10Btn.className = "add10-btn";
    add10Btn.onclick = function() { addPacks(pack.name, 10); updatePackDisplay(pack.name); };
    
    buttonsDiv.appendChild(removeBtn);
    buttonsDiv.appendChild(quantitySpan);
    buttonsDiv.appendChild(addBtn);
    buttonsDiv.appendChild(add10Btn);
    div.appendChild(nameSpan);
    div.appendChild(buttonsDiv);
    packContainer.appendChild(div);
  });
}

function addItem(name, price) {
  if (!cart[name]) cart[name] = { qty: 0, price };
  cart[name].qty++;
  updateCart();
  saveToStorage();
}

function addItems(name, price, quantity) {
  if (!cart[name]) cart[name] = { qty: 0, price };
  cart[name].qty += quantity;
  updateCart();
  saveToStorage();
}

function removeItem(name) {
  if (cart[name]) {
    cart[name].qty--;
    if (cart[name].qty <= 0) delete cart[name];
  }
  updateCart();
  saveToStorage();
}

function updateIngredientDisplay(name) {
  const qtyEl = document.getElementById(`qty-${name}`);
  if (qtyEl) {
    qtyEl.textContent = cart[name] ? cart[name].qty : 0;
  }
}

function addPack(packName) {
  const pack = packs.find(p => p.name === packName);
  if (!pack) return;
  
  if (!packCounts[packName]) packCounts[packName] = 0;
  packCounts[packName]++;
  
  pack.ingredients.forEach(ing => {
    const item = ingredients.find(i => i.name === ing);
    if (item) {
      addItem(item.name, item.price);
      updateIngredientDisplay(item.name);
    }
  });
}

function addPacks(packName, quantity) {
  for (let i = 0; i < quantity; i++) {
    addPack(packName);
  }
}

function removePack(packName) {
  const pack = packs.find(p => p.name === packName);
  if (!pack) return;
  
  if (packCounts[packName]) {
    packCounts[packName]--;
    if (packCounts[packName] <= 0) delete packCounts[packName];
  }
  
  pack.ingredients.forEach(ing => {
    removeItem(ing);
    updateIngredientDisplay(ing);
  });
}

function updatePackDisplay(packName) {
  const qtyEl = document.getElementById(`qty-pack-${packName}`);
  if (qtyEl) {
    qtyEl.textContent = packCounts[packName] || 0;
  }
}

function updateCart() {
  const cartEl = document.getElementById("cart");
  const totalEl = document.getElementById("total");
  cartEl.innerHTML = "";
  let total = 0;

  if (Object.keys(cart).length === 0) {
    cartEl.textContent = "Añade ingredientes o packs para generar la lista...";
    totalEl.textContent = "Total: 0€";
    return;
  }

  // Agrupar items por pasillo
  const itemsByAisle = {};
  
  for (let name in cart) {
    const item = cart[name];
    const ingredient = ingredients.find(i => i.name === name);
    const aisle = ingredient ? ingredient.aisle : "Sin pasillo";
    
    if (!itemsByAisle[aisle]) {
      itemsByAisle[aisle] = [];
    }
    
    itemsByAisle[aisle].push({ name, ...item });
    total += item.price * item.qty;
  }

  // Mostrar items ordenados por pasillo
  aisleOrder.forEach(aisle => {
    if (itemsByAisle[aisle] && itemsByAisle[aisle].length > 0) {
      // Encabezado del pasillo
      const aisleHeader = document.createElement("div");
      aisleHeader.className = "aisle-header";
      aisleHeader.textContent = `📍 Pasillo ${aisle} - ${aisleNames[aisle]}`;
      cartEl.appendChild(aisleHeader);
      
      // Items del pasillo
      itemsByAisle[aisle].forEach(item => {
        const line = document.createElement("div");
        line.className = "cart-item";
        line.textContent = `${item.qty}x ${item.name} = ${item.price * item.qty}€`;
        line.style.cursor = "pointer";
        line.style.userSelect = "none";
        
        if (striked[item.name]) {
          line.style.textDecoration = "line-through";
          line.style.opacity = "0.5";
        }
        
        line.onclick = function() {
          striked[item.name] = !striked[item.name];
          saveToStorage();
          updateCart();
        };
        
        cartEl.appendChild(line);
      });
    }
  });

  totalEl.textContent = `Total: ${total}€`;
}

function copyList() {
  if (Object.keys(cart).length === 0) {
    showNotification("⚠️ No hay nada que copiar");
    return;
  }

  // Agrupar items por pasillo
  const itemsByAisle = {};
  
  for (let name in cart) {
    const item = cart[name];
    const ingredient = ingredients.find(i => i.name === name);
    const aisle = ingredient ? ingredient.aisle : "Sin pasillo";
    
    if (!itemsByAisle[aisle]) {
      itemsByAisle[aisle] = [];
    }
    
    itemsByAisle[aisle].push({ name, ...item });
  }

  // Generar texto ordenado por pasillo
  let text = "";
  aisleOrder.forEach(aisle => {
    if (itemsByAisle[aisle] && itemsByAisle[aisle].length > 0) {
      text += `📍 Pasillo ${aisle} - ${aisleNames[aisle]}\n`;
      itemsByAisle[aisle].forEach(item => {
        text += `${item.qty}x ${item.name}\n`;
      });
      text += "\n";
    }
  });
  
  navigator.clipboard.writeText(text);
  showNotification("✅ Lista copiada al portapapeles");
}

function resetCart() {
  for (let key in cart) delete cart[key];
  for (let key in striked) delete striked[key];
  for (let key in packCounts) delete packCounts[key];
  
  // Limpiar localStorage
  localStorage.removeItem('tropicalCart');
  localStorage.removeItem('tropicalStriked');
  localStorage.removeItem('tropicalPackCounts');
  
  // Actualizar todas las cantidades a 0
  ingredients.forEach(item => updateIngredientDisplay(item.name));
  packs.forEach(pack => updatePackDisplay(pack.name));
  
  updateCart();
  showNotification("🔄 Lista reseteada");
}

function showNotification(msg) {
  const n = document.getElementById("notification");
  n.textContent = msg;
  n.classList.add("show");
  setTimeout(() => n.classList.remove("show"), 3000);
}

// Inicializar la aplicación
loadFromStorage();
renderLists();
updateCart();

// Actualizar las cantidades visibles después de cargar
ingredients.forEach(item => updateIngredientDisplay(item.name));
packs.forEach(pack => updatePackDisplay(pack.name));
