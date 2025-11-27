// Obtener datos de la URL
function getInvoiceData() {
  const urlParams = new URLSearchParams(window.location.search);
  const encodedData = urlParams.get('data');
  const invoiceCode = urlParams.get('codigo');

  // Si hay código de factura, usarlo directamente
  if (invoiceCode) {
    try {
      const decodedData = JSON.parse(decodeURIComponent(atob(invoiceCode)));
      return decodedData;
    } catch (error) {
      console.error('Error al decodificar código de factura:', error);
      document.body.innerHTML = '<div style="text-align: center; padding: 50px; font-family: Arial;"><h1>❌ Error</h1><p>Código de factura inválido</p><button onclick="window.close()" style="margin-top: 20px; padding: 10px 20px; cursor: pointer;">Cerrar</button></div>';
      return null;
    }
  }

  if (!encodedData) {
    showSearchInterface();
    return null;
  }

  try {
    const decodedData = JSON.parse(decodeURIComponent(atob(encodedData)));
    return decodedData;
  } catch (error) {
    console.error('Error al decodificar datos:', error);
    document.body.innerHTML = '<div style="text-align: center; padding: 50px; font-family: Arial;"><h1>❌ Error</h1><p>Datos de factura inválidos</p><button onclick="window.close()" style="margin-top: 20px; padding: 10px 20px; cursor: pointer;">Cerrar</button></div>';
    return null;
  }
}

// Mostrar interfaz de búsqueda
function showSearchInterface() {
  document.body.innerHTML = `
    <a href="../index.html" class="back-home" aria-label="Volver al inicio">
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="black" class="bi bi-arrow-bar-left" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5M10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5"/>
      </svg>
    </a>
    <div class="search-container">
      <div class="search-box">
        <img src="https://gamingespyt.github.io/gamingesp/img/Tropical_Heights.png" alt="Logo Tropical Heights" class="search-logo">
        <h1>Buscar Factura</h1>
        <p class="search-subtitle">Introduce el código de factura para consultarla</p>
        <form onsubmit="searchInvoice(event)" class="search-form">
          <textarea 
            id="invoice-search" 
            placeholder="Pega aquí el código de factura completo..." 
            class="search-input"
            rows="4"
            required
          ></textarea>
          <button type="submit" class="search-btn">🔍 Buscar Factura</button>
        </form>
        <div id="search-result" class="search-result"></div>
        <div class="recent-invoices">
          <div class="recent-header">
            <h3>Facturas Guardadas</h3>
            <button onclick="clearAllInvoices()" class="clear-btn">🗑️ Borrar Todas</button>
          </div>
          <div id="recent-list"></div>
        </div>
      </div>
    </div>
    <style>
      body {
        margin: 0;
        padding: 0;
        background: linear-gradient(135deg, #fceabb 0%, #f8b500 50%, #ff6f61 100%);
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      .search-container {
        width: 100%;
        max-width: 600px;
        padding: 20px;
      }
      .search-box {
        background: white;
        border-radius: 12px;
        padding: 40px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        text-align: center;
      }
      .search-logo {
        width: 100px;
        height: 100px;
        margin-bottom: 20px;
      }
      .search-box h1 {
        color: #2c3e50;
        margin-bottom: 10px;
        font-size: 2rem;
      }
      .search-subtitle {
        color: #7f8c8d;
        margin-bottom: 30px;
      }
      .search-form {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-bottom: 20px;
      }
      .search-input {
        padding: 15px;
        border: 2px solid #ddd;
        border-radius: 8px;
        font-size: 0.9rem;
        font-family: monospace;
        transition: border-color 0.3s;
        resize: vertical;
        width: 100%;
      }
      .search-input:focus {
        outline: none;
        border-color: #f8b500;
      }
      .search-btn {
        padding: 15px;
        background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1.1rem;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s;
      }
      .search-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
      }
      .search-result {
        margin-top: 15px;
        padding: 10px;
        border-radius: 8px;
        font-weight: bold;
      }
      .search-result.error {
        background: #fee;
        color: #c0392b;
      }
      .recent-invoices {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 2px solid #ecf0f1;
      }
      .recent-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        gap: 10px;
      }
      .recent-invoices h3 {
        color: #2c3e50;
        margin: 0;
        font-size: 1.2rem;
      }
      .clear-btn {
        padding: 8px 16px;
        background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s;
      }
      .clear-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(231, 76, 60, 0.4);
      }
      #recent-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .recent-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        background: #f8f9fa;
        border-radius: 8px;
        transition: all 0.3s;
        gap: 10px;
      }
      .recent-item:hover {
        background: #e9ecef;
      }
      .recent-item-info {
        text-align: left;
        flex: 1;
        cursor: pointer;
      }
      .recent-item-info:hover {
        opacity: 0.8;
      }
      .recent-item-number {
        font-weight: bold;
        color: #2c3e50;
        font-size: 0.9rem;
      }
      .recent-item-date {
        font-size: 0.8rem;
        color: #7f8c8d;
        margin-top: 2px;
      }
      .recent-item-customer {
        font-size: 0.85rem;
        color: #555;
        margin-top: 2px;
      }
      .recent-item-actions {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .recent-item-amount {
        font-weight: bold;
        color: #27ae60;
        font-size: 1.1rem;
      }
      .delete-btn {
        padding: 6px 10px;
        background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .delete-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(231, 76, 60, 0.4);
      }
      .no-recent {
        color: #7f8c8d;
        font-style: italic;
        text-align: center;
        padding: 20px;
      }
      .back-home {
        position: fixed;
        top: 12px;
        left: 12px;
        z-index: 1000;
        width: 56px;
        height: 56px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.9);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.25);
        backdrop-filter: blur(4px);
      }
      .back-home svg { 
        width: 32px; 
        height: 32px; 
        fill: #111; 
      }
      @media (max-width: 480px) {
        .back-home { 
          width: 48px; 
          height: 48px; 
          top: 8px; 
          left: 8px; 
        }
        .back-home svg { 
          width: 26px; 
          height: 26px; 
        }
      }
    </style>
  `;

  // Mostrar facturas guardadas
  displayRecentInvoices();
}

// Mostrar facturas recientes
function displayRecentInvoices() {
  const recentList = document.getElementById('recent-list');
  if (!recentList) return;

  const invoices = [];

  // Obtener todas las facturas del localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('invoice_')) {
      try {
        const invoice = JSON.parse(localStorage.getItem(key));
        invoice.storageKey = key;
        invoices.push(invoice);
      } catch (error) {
        console.error('Error al cargar factura:', error);
      }
    }
  }

  // Ordenar por fecha (más recientes primero)
  invoices.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (invoices.length === 0) {
    recentList.innerHTML = '<p class="no-recent">No hay facturas guardadas</p>';
    return;
  }

  recentList.innerHTML = invoices.map(inv => {
    const code = btoa(encodeURIComponent(JSON.stringify(inv)));
    return `
      <div class="recent-item">
        <div class="recent-item-info" onclick="window.location.href='?codigo=${encodeURIComponent(code)}'">
          <div class="recent-item-number">${inv.invoiceNumber}</div>
          <div class="recent-item-customer">${inv.name} ${inv.surname}</div>
          <div class="recent-item-date">${formatDate(inv.date)}</div>
        </div>
        <div class="recent-item-actions">
          <div class="recent-item-amount">${inv.finalTotal}€</div>
          <button onclick="event.stopPropagation(); deleteInvoice('${inv.storageKey}')" class="delete-btn" title="Eliminar factura">🗑️</button>
        </div>
      </div>
    `;
  }).join('');
}

// Borrar una factura individual
function deleteInvoice(storageKey) {
  if (!confirm('¿Estás seguro de que quieres eliminar esta factura?')) {
    return;
  }

  localStorage.removeItem(storageKey);

  // Actualizar la lista
  displayRecentInvoices();

  // Mostrar notificación
  const resultDiv = document.getElementById('search-result');
  if (resultDiv) {
    resultDiv.className = 'search-result';
    resultDiv.style.background = '#d4edda';
    resultDiv.style.color = '#155724';
    resultDiv.textContent = '✅ Factura eliminada correctamente';
    setTimeout(() => {
      resultDiv.textContent = '';
      resultDiv.style.background = '';
      resultDiv.style.color = '';
    }, 3000);
  }
}

// Borrar todas las facturas
function clearAllInvoices() {
  if (!confirm('¿Estás seguro de que quieres borrar todas las facturas guardadas? Esta acción no se puede deshacer.')) {
    return;
  }

  const keysToDelete = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('invoice_')) {
      keysToDelete.push(key);
    }
  }

  keysToDelete.forEach(key => localStorage.removeItem(key));

  // Actualizar la lista
  displayRecentInvoices();

  // Mostrar notificación
  const resultDiv = document.getElementById('search-result');
  if (resultDiv) {
    resultDiv.className = 'search-result';
    resultDiv.style.background = '#d4edda';
    resultDiv.style.color = '#155724';
    resultDiv.textContent = '✅ Todas las facturas han sido eliminadas';
    setTimeout(() => {
      resultDiv.textContent = '';
      resultDiv.style.background = '';
      resultDiv.style.color = '';
    }, 3000);
  }
}

// Buscar factura
function searchInvoice(event) {
  event.preventDefault();
  const invoiceCode = document.getElementById('invoice-search').value.trim();
  const resultDiv = document.getElementById('search-result');

  try {
    // Intentar decodificar el código
    const decodedData = JSON.parse(decodeURIComponent(atob(invoiceCode)));

    // Si es válido, redirigir
    window.location.href = `?codigo=${encodeURIComponent(invoiceCode)}`;
  } catch (error) {
    resultDiv.className = 'search-result error';
    resultDiv.textContent = '❌ Código de factura inválido. Verifica que hayas copiado el código completo.';
    setTimeout(() => {
      resultDiv.textContent = '';
      resultDiv.className = 'search-result';
    }, 4000);
  }
}

// Generar número de factura único basado en la fecha
function generateInvoiceNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `TH-${year}${month}${day}-${hours}${minutes}${seconds}`;
}

// Formatear fecha
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} - ${hours}:${minutes}`;
}

// Llenar la factura con los datos
function populateInvoice() {
  const data = getInvoiceData();

  if (!data) return;

  // Generar o usar número de factura existente
  const invoiceNumber = data.invoiceNumber || generateInvoiceNumber();

  // Generar código portable (Base64) de la factura
  if (!data.invoiceNumber) {
    data.invoiceNumber = invoiceNumber;
  }
  const invoiceCode = btoa(encodeURIComponent(JSON.stringify(data)));

  // Verificar si la factura ya está guardada
  const isAlreadySaved = localStorage.getItem(`invoice_${invoiceNumber}`) !== null;

  // Si es nueva (no tiene invoiceNumber previo), guardar automáticamente
  const urlParams = new URLSearchParams(window.location.search);
  const isFromCalculator = urlParams.get('data') !== null; // Viene directamente de la calculadora

  if (isFromCalculator && !isAlreadySaved) {
    // Guardar automáticamente las facturas nuevas generadas desde la calculadora
    try {
      localStorage.setItem(`invoice_${invoiceNumber}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error al guardar factura automáticamente:', error);
    }
  } else if (!isAlreadySaved) {
    // Si viene de un código y no está guardada, mostrar botón para guardar manualmente
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
      saveBtn.style.display = 'inline-block';
    }
  }

  // Información de la factura
  document.getElementById('invoice-number').textContent = invoiceNumber;
  document.getElementById('invoice-date').textContent = formatDate(data.date);

  // Información del cliente
  document.getElementById('customer-name').textContent = `${data.name} ${data.surname}`;
  document.getElementById('customer-phone').textContent = data.phone;

  // Productos
  const itemsBody = document.getElementById('items-body');
  itemsBody.innerHTML = '';

  data.items.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.qty}</td>
      <td>${item.price}€</td>
      <td><strong>${item.subtotal}€</strong></td>
    `;
    itemsBody.appendChild(row);
  });

  // Totales
  document.getElementById('subtotal-amount').textContent = `${data.total}€`;

  if (data.discount && data.discount > 0) {
    document.getElementById('discount-row').style.display = 'flex';

    // Determinar el texto del descuento según el tipo
    let discountLabel = '';
    if (data.discountType === 'employee') {
      discountLabel = 'Descuento empleados (25%):';
    } else if (data.discountType === 'custom') {
      // Usar el formato nuevo: "Descuento [Motivo] (X%)" o "Descuento personalizado (X%)"
      if (data.customDiscountReason) {
        discountLabel = `Descuento ${data.customDiscountReason} (${data.customDiscountPercent}%):`;
      } else {
        discountLabel = `Descuento personalizado (${data.customDiscountPercent}%):`;
      }
    }

    document.getElementById('discount-label').textContent = discountLabel;
    document.getElementById('discount-amount').textContent = `-${data.discount}€`;
  }

  document.getElementById('final-amount').textContent = `${data.finalTotal}€`;

  // Actualizar el título de la página
  document.title = `Factura ${invoiceNumber} - Tropical Heights`;

  // Guardar el código de factura y los datos para poder usarlos
  window.currentInvoiceCode = invoiceCode;
  window.currentInvoiceData = data;
  window.currentInvoiceNumber = invoiceNumber;
}

// Guardar factura manualmente
function saveInvoiceManually() {
  if (!window.currentInvoiceData || !window.currentInvoiceNumber) {
    showCodeNotification('⚠️ No hay datos de factura para guardar', 'error');
    return;
  }

  try {
    // Guardar en localStorage
    localStorage.setItem(`invoice_${window.currentInvoiceNumber}`, JSON.stringify(window.currentInvoiceData));

    // Ocultar el botón de guardar
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
      saveBtn.style.display = 'none';
    }

    showCodeNotification('✅ Factura guardada correctamente', 'success');
  } catch (error) {
    console.error('Error al guardar factura:', error);
    showCodeNotification('❌ Error al guardar la factura', 'error');
  }
}

// Copiar código de factura al portapapeles
function copyInvoiceCode() {
  if (!window.currentInvoiceCode) {
    showCodeNotification('⚠️ No hay código de factura disponible', 'error');
    return;
  }

  navigator.clipboard.writeText(window.currentInvoiceCode).then(() => {
    showCodeNotification('✅ Código de factura copiado. Puedes usarlo en cualquier navegador/dispositivo', 'success');
  }).catch(err => {
    console.error('Error al copiar:', err);
    showCodeNotification('❌ Error al copiar el código', 'error');
  });
}

// Mostrar notificación de código
function showCodeNotification(message, type) {
  const notification = document.getElementById('code-notification');
  if (!notification) return;

  notification.textContent = message;
  notification.className = `code-notification ${type} show`;

  setTimeout(() => {
    notification.classList.remove('show');
  }, 4000);
}

// Descargar factura como PNG
async function downloadAsPNG() {
  const invoiceContainer = document.querySelector('.invoice-container');
  const buttons = document.querySelector('.print-button-container');
  const notification = document.getElementById('code-notification');
  const backHome = document.querySelector('.back-home');

  // Ocultar botones, notificación y botón flotante temporalmente
  buttons.style.display = 'none';
  if (notification) notification.style.display = 'none';
  if (backHome) backHome.style.display = 'none';

  showCodeNotification('⏳ Generando imagen...', 'success');

  try {
    // Esperar un poco para que se oculten los elementos
    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = await html2canvas(invoiceContainer, {
      scale: 2, // Mayor calidad
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
      allowTaint: true
    });

    // Convertir a blob y descargar
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const invoiceNumber = document.getElementById('invoice-number').textContent;
      link.download = `Factura_${invoiceNumber}.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);

      showCodeNotification('✅ Imagen descargada correctamente', 'success');
    }, 'image/png');

  } catch (error) {
    console.error('Error al generar PNG:', error);
    showCodeNotification('❌ Error al generar la imagen', 'error');
  } finally {
    // Mostrar botones y botón flotante de nuevo
    buttons.style.display = 'flex';
    if (notification) notification.style.display = 'block';
    if (backHome) backHome.style.display = 'inline-flex';
  }
}

// Cargar datos al cargar la página
window.addEventListener('DOMContentLoaded', populateInvoice);
