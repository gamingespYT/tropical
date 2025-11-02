// index.js - control de ingredientes y lista de compra
const products = [
  { name: "Whisky", emoji: "🥃", price: 7 },
  { name: "Mora", emoji: "🍇", price: 3 },
  { name: "Arándanos", emoji: "🫐", price: 2 },
  { name: "Ginebra", emoji: "🍸", price: 5 },
  { name: "Frambuesa", emoji: "🍓", price: 3 },
  { name: "Pétalos de Rosa", emoji: "🌹", price: 4 },
  { name: "Licor 34", emoji: "🥃", price: 6 },
  { name: "Latacacao", emoji: "🍫", price: 6 },
  { name: "Ron Blanco", emoji: "🥃", price: 5 },
  { name: "Naranja", emoji: "🍊", price: 3 },
  { name: "Lima (zumo)", emoji: "🍋", price: 5 },
  { name: "Vodka", emoji: "🍸", price: 5 },
  { name: "Limón (trozos)", emoji: "🍋", price: 2 },
  { name: "Coco", emoji: "🥥", price: 4 },
  { name: "Huevo", emoji: "🥚", price: 2 },
  { name: "Queso", emoji: "🧀", price: 2 },
  { name: "Salmón", emoji: "🐟", price: 2 },
  { name: "Harina", emoji: "🌾", price: 2 },
  { name: "Langostino", emoji: "🦐", price: 5 },
  { name: "Aceite", emoji: "🫒", price: 3 },
  { name: "Pan", emoji: "🍞", price: 1 },
  { name: "Piña", emoji: "🍍", price: 3 },
  { name: "Bacon", emoji: "🥓", price: 2 }
];

const cart = {}; // { "Whisky": { qty: number, price: number } }

const productsContainer = document.getElementById('products');
const listEl = document.getElementById('list');
const totalEl = document.getElementById('total');
const notif = document.getElementById('notification');
const copyBtn = document.getElementById('copyBtn');
const resetBtn = document.getElementById('resetBtn');

function renderProducts(){
  productsContainer.innerHTML = '';
  products.forEach((p, i) => {
    const row = document.createElement('div');
    row.className = 'product';
    row.innerHTML = `
      <div class="left">
        <div class="emoji">${p.emoji}</div>
        <div>
          <div class="meta">${p.name}</div>
          <div class="price">${p.price}€</div>
        </div>
      </div>

      <div class="controls" aria-label="${p.name} controls">
        <button aria-label="restar" onclick="decrease(${i})">➖</button>
        <div class="qty-badge" id="badge-${i}">0</div>
        <button aria-label="sumar" onclick="increase(${i})">➕</button>
      </div>
    `;
    productsContainer.appendChild(row);
  });
}

function increase(index){
  const p = products[index];
  if(!cart[p.name]) cart[p.name] = { qty:0, price: p.price };
  cart[p.name].qty++;
  updateQtyBadge(index);
  updateList();
  showNotification(`Añadido 1 x ${p.name}`);
}

function decrease(index){
  const p = products[index];
  if(!cart[p.name]) return;
  cart[p.name].qty--;
  if(cart[p.name].qty <= 0) delete cart[p.name];
  updateQtyBadge(index);
  updateList();
  showNotification(`Restado 1 x ${p.name}`);
}

function updateQtyBadge(index){
  const p = products[index];
  const badge = document.getElementById(`badge-${index}`);
  const qty = cart[p.name]?.qty || 0;
  badge.textContent = qty;
}

function updateList(){
  listEl.innerHTML = '';
  let total = 0;
  const entries = Object.keys(cart);
  if(entries.length === 0){
    listEl.textContent = 'Añade ingredientes con ➕ para que aparezcan aquí...';
    totalEl.textContent = '0€';
    return;
  }

  entries.forEach(name => {
    const item = cart[name];
    const row = document.createElement('div');
    row.className = 'list-item';
    row.innerHTML = `<div>${item.qty}x ${name}</div><div>${item.qty * item.price}€</div>`;
    listEl.appendChild(row);
    total += item.qty * item.price;
  });

  totalEl.textContent = `${total}€`;
}

function copyList(){
  const entries = Object.keys(cart);
  if(entries.length === 0){
    showNotification('⚠️ No hay nada que copiar');
    return;
  }
  let text = '';
  entries.forEach(name => {
    text += `${cart[name].qty}x ${name}\n`;
  });
  navigator.clipboard.writeText(text).then(() => {
    showNotification('✅ Lista copiada al portapapeles');
  }).catch(()=> showNotification('❌ Error al copiar'));
}

function resetAll(){
  for(const k in cart) delete cart[k];
  // reset badges
  products.forEach((_,i)=> {
    const b = document.getElementById(`badge-${i}`);
    if(b) b.textContent = 0;
  });
  updateList();
  showNotification('🔄 Lista reiniciada');
}

function showNotification(msg){
  notif.textContent = msg;
  notif.classList.add('show');
  setTimeout(()=> notif.classList.remove('show'), 2500);
}

/* events */
copyBtn.addEventListener('click', copyList);
resetBtn.addEventListener('click', resetAll);

/* initial render */
renderProducts();
