const ingredients = [
  { name: "Whisky 🥃", price: 7 },
  { name: "Mora 🍇", price: 3 },
  { name: "Arándanos 🫐", price: 2 },
  { name: "Ginebra 🍸", price: 5 },
  { name: "Frambuesa 🍓", price: 3 },
  { name: "Pétalos de Rosa 🌹", price: 4 },
  { name: "Licor 34 🥃", price: 6 },
  { name: "Latacacao 🍫", price: 6 },
  { name: "Ron Blanco 🥃", price: 5 },
  { name: "Naranja 🍊", price: 3 },
  { name: "Lima 🍋", price: 5 },
  { name: "Vodka 🍸", price: 5 },
  { name: "Limón 🍋", price: 2 },
  { name: "Coco 🥥", price: 4 },
  { name: "Huevo 🥚", price: 2 },
  { name: "Queso 🧀", price: 2 },
  { name: "Salmón 🐟", price: 2 },
  { name: "Harina 🌾", price: 2 },
  { name: "Langostino 🦐", price: 5 },
  { name: "Aceite 🫒", price: 3 },
  { name: "Pan 🍞", price: 1 },
  { name: "Piña 🍍", price: 3 },
  { name: "Bacon 🥓", price: 2 }
];

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

function renderLists() {
  const ingContainer = document.getElementById("ingredients");
  const packContainer = document.getElementById("packs");

  ingredients.forEach((item) => {
    const div = document.createElement("div");
    div.className = "item";
    
    const nameSpan = document.createElement("span");
    nameSpan.textContent = `${item.name} - ${item.price}€`;
    
    const buttonsDiv = document.createElement("div");
    
    const addBtn = document.createElement("button");
    addBtn.textContent = "➕";
    addBtn.onclick = function() { addItem(item.name, item.price); };
    
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "➖";
    removeBtn.onclick = function() { removeItem(item.name); };
    
    buttonsDiv.appendChild(addBtn);
    buttonsDiv.appendChild(removeBtn);
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
    
    const addBtn = document.createElement("button");
    addBtn.textContent = "➕";
    addBtn.onclick = function() { addPack(pack.name); };
    
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "➖";
    removeBtn.onclick = function() { removePack(pack.name); };
    
    buttonsDiv.appendChild(addBtn);
    buttonsDiv.appendChild(removeBtn);
    div.appendChild(nameSpan);
    div.appendChild(buttonsDiv);
    packContainer.appendChild(div);
  });
}

function addItem(name, price) {
  if (!cart[name]) cart[name] = { qty: 0, price };
  cart[name].qty++;
  updateCart();
}

function removeItem(name) {
  if (cart[name]) {
    cart[name].qty--;
    if (cart[name].qty <= 0) delete cart[name];
  }
  updateCart();
}

function addPack(packName) {
  const pack = packs.find(p => p.name === packName);
  if (!pack) return;
  pack.ingredients.forEach(ing => {
    const item = ingredients.find(i => i.name === ing);
    if (item) addItem(item.name, item.price);
  });
}

function removePack(packName) {
  const pack = packs.find(p => p.name === packName);
  if (!pack) return;
  pack.ingredients.forEach(ing => {
    removeItem(ing);
  });
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

  for (let name in cart) {
    const item = cart[name];
    total += item.price * item.qty;
    
    const line = document.createElement("div");
    line.textContent = `${item.qty}x ${name} = ${item.price * item.qty}€`;
    line.style.cursor = "pointer";
    line.style.userSelect = "none";
    
    if (striked[name]) {
      line.style.textDecoration = "line-through";
      line.style.opacity = "0.5";
    }
    
    line.onclick = function() {
      striked[name] = !striked[name];
      updateCart();
    };
    
    cartEl.appendChild(line);
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
    text += `${item.qty}x ${key}\n`;
  }
  navigator.clipboard.writeText(text);
  showNotification("✅ Lista copiada al portapapeles");
}

function resetCart() {
  for (let key in cart) delete cart[key];
  for (let key in striked) delete striked[key];
  updateCart();
  showNotification("🔄 Lista reseteada");
}

function showNotification(msg) {
  const n = document.getElementById("notification");
  n.textContent = msg;
  n.classList.add("show");
  setTimeout(() => n.classList.remove("show"), 3000);
}

renderLists();
