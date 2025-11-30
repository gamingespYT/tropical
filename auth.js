// Sistema de autenticación para Tropical Heights
const AUTH_KEY = 'tropical_auth';
const CORRECT_PASSWORD = 'tropical2025'; // Cambia esta contraseña según prefieras

function checkAuth() {
  const isAuthenticated = localStorage.getItem(AUTH_KEY);
  
  if (isAuthenticated === 'true') {
    return true;
  }
  
  showLoginModal();
  return false;
}

function showLoginModal() {
  // Crear el modal HTML
  const modalHTML = `
    <div id="auth-modal" class="auth-modal">
      <div class="auth-modal-content">
        <div class="auth-header">
          <img src="https://gamingespyt.github.io/gamingesp/img/Tropical_Heights.png" alt="Tropical Heights" class="auth-logo">
          <h2>🔒 Acceso Restringido</h2>
          <p>Introduce la contraseña para continuar</p>
        </div>
        <div class="auth-body">
          <input type="password" id="auth-password" placeholder="Contraseña" autocomplete="off">
          <div id="auth-error" class="auth-error"></div>
          <div class="auth-buttons">
            <button onclick="validatePassword()" class="auth-btn auth-btn-primary">✅ Entrar</button>
            <button onclick="cancelLogin()" class="auth-btn auth-btn-secondary">❌ Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Crear el CSS para el modal
  const styleHTML = `
    <style>
      .auth-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(8px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      .auth-modal-content {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 20px;
        padding: 40px;
        max-width: 450px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        animation: slideIn 0.4s ease;
      }
      
      @keyframes slideIn {
        from { transform: translateY(-50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      .auth-header {
        text-align: center;
        margin-bottom: 30px;
      }
      
      .auth-logo {
        width: 100px;
        height: 100px;
        border-radius: 20px;
        margin-bottom: 20px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
      }
      
      .auth-header h2 {
        color: #fff;
        font-size: 1.8rem;
        margin: 10px 0;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }
      
      .auth-header p {
        color: rgba(255, 255, 255, 0.9);
        font-size: 1rem;
      }
      
      .auth-body {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }
      
      #auth-password {
        padding: 15px 20px;
        font-size: 1.1rem;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.95);
        transition: all 0.3s ease;
        outline: none;
      }
      
      #auth-password:focus {
        border-color: #fff;
        box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2);
      }
      
      .auth-error {
        color: #ff6b6b;
        background: rgba(255, 255, 255, 0.95);
        padding: 10px;
        border-radius: 8px;
        text-align: center;
        font-weight: 600;
        display: none;
      }
      
      .auth-error.show {
        display: block;
        animation: shake 0.5s ease;
      }
      
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
      }
      
      .auth-buttons {
        display: flex;
        gap: 10px;
        margin-top: 10px;
      }
      
      .auth-btn {
        flex: 1;
        padding: 15px 20px;
        font-size: 1.1rem;
        font-weight: 600;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }
      
      .auth-btn-primary {
        background: linear-gradient(135deg, #2ecc71, #27ae60);
        color: white;
      }
      
      .auth-btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
      }
      
      .auth-btn-secondary {
        background: linear-gradient(135deg, #e74c3c, #c0392b);
        color: white;
      }
      
      .auth-btn-secondary:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
      }
      
      @media (max-width: 500px) {
        .auth-modal-content {
          padding: 30px 20px;
        }
        
        .auth-buttons {
          flex-direction: column;
        }
      }
    </style>
  `;
  
  // Agregar el estilo y el modal al documento
  document.head.insertAdjacentHTML('beforeend', styleHTML);
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Focus en el input
  setTimeout(() => {
    document.getElementById('auth-password').focus();
  }, 300);
  
  // Permitir Enter para enviar
  document.getElementById('auth-password').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      validatePassword();
    }
  });
}

function validatePassword() {
  const password = document.getElementById('auth-password').value;
  const errorDiv = document.getElementById('auth-error');
  
  if (password === CORRECT_PASSWORD) {
    localStorage.setItem(AUTH_KEY, 'true');
    document.getElementById('auth-modal').style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
      document.getElementById('auth-modal').remove();
      document.body.style.display = '';
    }, 300);
  } else {
    errorDiv.textContent = '❌ Contraseña incorrecta';
    errorDiv.classList.add('show');
    document.getElementById('auth-password').value = '';
    document.getElementById('auth-password').focus();
    
    setTimeout(() => {
      errorDiv.classList.remove('show');
    }, 3000);
  }
}

function cancelLogin() {
  window.location.href = '../main.html';
}

function logout() {
  localStorage.removeItem(AUTH_KEY);
  
  // Mostrar notificación visual abajo
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #2ecc71, #27ae60);
    color: white;
    padding: 15px 25px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 10001;
    font-weight: 600;
    animation: slideInUp 0.3s ease;
  `;
  notification.textContent = '🔓 Sesión cerrada correctamente';
  document.body.appendChild(notification);
  
  setTimeout(() => {
    window.location.href = '../main.html';
  }, 1000);
}

// CSS adicional para la animación de fadeOut
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  @keyframes slideInUp {
    from { transform: translate(-50%, 100px); opacity: 0; }
    to { transform: translate(-50%, 0); opacity: 1; }
  }
`;
document.head.appendChild(fadeOutStyle);

// Verificar autenticación inmediatamente
(function() {
  const isAuthenticated = localStorage.getItem(AUTH_KEY);
  
  if (isAuthenticated === 'true') {
    // Usuario ya autenticado, mostrar contenido
    window.addEventListener('DOMContentLoaded', function() {
      document.body.style.display = '';
    });
  } else {
    // Usuario no autenticado, mostrar modal
    window.addEventListener('DOMContentLoaded', function() {
      document.body.style.display = '';
      showLoginModal();
    });
  }
})();
