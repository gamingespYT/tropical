/**
 * GuaguaRP Server Closed Popup
 * 
 * ========================================
 * 🔧 CONFIGURACIÓN - Edita estas variables
 * ========================================
 */

// URL del logo de GuaguaRP (dejar vacío para usar emoji por defecto)
const LOGO_URL = 'https://gamingespyt.github.io/gamingesp/img/guagua.png';

// URL de la música de fondo (dejar vacío para sin música)
const MUSIC_URL = './guagua.mp3';

// Título del servidor
const SERVER_TITLE = 'GuaguaRP Cerrado';

// Mensaje principal
const MAIN_MESSAGE = 'El servidor ha cerrado';

// Submensaje
const SUB_MESSAGE = 'Gracias por jugar en GuaguaRP. ¡Hasta la próxima!';

// ========================================

(function () {
    'use strict';

    // Configuración (usando las variables de arriba)
    const config = {
        logoUrl: LOGO_URL,
        musicUrl: MUSIC_URL,
        title: SERVER_TITLE,
        message: MAIN_MESSAGE,
        submessage: SUB_MESSAGE
    };

    // Resolver rutas relativas respecto al archivo del script (permite usar ../beach-club/guaguarp-popup.js)
    function resolveUrl(url) {
        if (!url) return '';
        if (/^(?:[a-z]+:)?\/\//i.test(url) || url.startsWith('/')) return url;
        let scriptEl = document.currentScript;
        if (!scriptEl) {
            const scripts = document.getElementsByTagName('script');
            for (let i = scripts.length - 1; i >= 0; i--) {
                const s = scripts[i];
                if (s && s.src && s.src.indexOf('guaguarp-popup.js') !== -1) {
                    scriptEl = s;
                    break;
                }
            }
        }
        if (scriptEl && scriptEl.src) {
            const base = scriptEl.src.substring(0, scriptEl.src.lastIndexOf('/') + 1);
            return base + url.replace(/^\.\//, '');
        }
        return url;
    }

    // Ajustar la ruta de la música para que funcione desde páginas que cargan este script desde otra carpeta
    config.musicUrl = resolveUrl(MUSIC_URL);

    // Constantes
    const STORAGE_KEY = 'guaguarp_popup_closed';
    const COOLDOWN_TIME = 1 * 60 * 1000; // 5 minutos en milisegundos

    // Verificar si el popup debe mostrarse
    function shouldShowPopup() {
        const closedTime = localStorage.getItem(STORAGE_KEY);

        if (!closedTime) {
            return true; // Nunca se ha cerrado
        }

        const elapsed = Date.now() - parseInt(closedTime, 10);
        return elapsed >= COOLDOWN_TIME; // Mostrar solo si han pasado 5 minutos
    }

    // Crear y mostrar el popup
    function createPopup() {
        // CSS del popup
        const styles = `
            @keyframes guaguarp-fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            @keyframes guaguarp-slideUp {
                from {
                    transform: translateY(30px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            @keyframes guaguarp-pulse {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
            }

            @keyframes guaguarp-float {
                0%, 100% {
                    transform: translateY(0px);
                }
                50% {
                    transform: translateY(-10px);
                }
            }

            .guaguarp-popup-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(10px);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                animation: guaguarp-fadeIn 0.4s ease-out;
                overflow-y: auto;
            }

            .guaguarp-popup-container {
                background: linear-gradient(135deg, #1E6B7B 0%, #165766 100%);
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5),
                            0 0 100px rgba(255, 165, 0, 0.3);
                max-width: 500px;
                width: 100%;
                padding: 40px 30px;
                position: relative;
                border: 3px solid rgba(255, 215, 0, 0.4);
                animation: guaguarp-slideUp 0.5s ease-out;
                text-align: center;
            }

            .guaguarp-popup-logo {
                width: 140px;
                height: 140px;
                margin: 0 auto 30px;
                border-radius: 50%;
                overflow: hidden;
                border: 4px solid #FFD700;
                box-shadow: 0 0 40px rgba(255, 215, 0, 0.6);
                animation: guaguarp-float 3s ease-in-out infinite;
                background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .guaguarp-popup-logo img {
                width: 85%;
                height: 85%;
                object-fit: contain;
            }

            .guaguarp-popup-logo-placeholder {
                font-size: 48px;
                color: #1E6B7B;
                font-weight: bold;
            }

            .guaguarp-popup-title {
                font-size: 32px;
                font-weight: 700;
                color: #FFD700;
                margin: 0 0 15px;
                text-transform: uppercase;
                letter-spacing: 2px;
                text-shadow: 0 0 30px rgba(255, 215, 0, 0.8),
                             0 0 10px rgba(255, 165, 0, 0.6);
            }

            .guaguarp-popup-message {
                font-size: 20px;
                color: #FFFFFF;
                margin: 0 0 10px;
                font-weight: 600;
            }

            .guaguarp-popup-submessage {
                font-size: 14px;
                color: #E0E0E0;
                margin: 0 0 30px;
                line-height: 1.6;
            }

            .guaguarp-popup-divider {
                width: 80px;
                height: 3px;
                background: linear-gradient(90deg, transparent, #FFD700, #FFA500, transparent);
                margin: 25px auto;
                border-radius: 2px;
                box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
            }

            .guaguarp-popup-close {
                background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
                color: #1E6B7B;
                border: none;
                padding: 15px 40px;
                font-size: 16px;
                font-weight: 700;
                border-radius: 50px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 5px 25px rgba(255, 215, 0, 0.5);
                text-transform: uppercase;
                letter-spacing: 1px;
                outline: none;
            }

            .guaguarp-popup-close:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 35px rgba(255, 215, 0, 0.7);
                animation: guaguarp-pulse 1s infinite;
                background: linear-gradient(135deg, #FFA500 0%, #FFD700 100%);
            }

            .guaguarp-popup-close:active {
                transform: translateY(0);
            }

            .guaguarp-popup-icon {
                font-size: 64px;
                margin-bottom: 20px;
                animation: guaguarp-pulse 2s ease-in-out infinite;
            }

            /* Responsividad */
            @media (max-width: 600px) {
                .guaguarp-popup-container {
                    padding: 30px 20px;
                    margin: 10px;
                }

                .guaguarp-popup-title {
                    font-size: 24px;
                }

                .guaguarp-popup-message {
                    font-size: 18px;
                }

                .guaguarp-popup-logo {
                    width: 100px;
                    height: 100px;
                }

                .guaguarp-popup-close {
                    padding: 12px 30px;
                    font-size: 14px;
                }
            }
        `;

        // Crear elemento de estilo
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);

        // Crear estructura del popup
        const overlay = document.createElement('div');
        overlay.className = 'guaguarp-popup-overlay';
        overlay.id = 'guaguarp-popup';

        const container = document.createElement('div');
        container.className = 'guaguarp-popup-container';

        // Logo o icono
        const logoDiv = document.createElement('div');
        logoDiv.className = 'guaguarp-popup-logo';

        if (config.logoUrl) {
            const logoImg = document.createElement('img');
            logoImg.src = config.logoUrl;
            logoImg.alt = config.title;
            logoDiv.appendChild(logoImg);
        } else {
            const placeholder = document.createElement('div');
            placeholder.className = 'guaguarp-popup-logo-placeholder';
            placeholder.textContent = '🚫';
            logoDiv.appendChild(placeholder);
        }

        // Título
        const title = document.createElement('h1');
        title.className = 'guaguarp-popup-title';
        title.textContent = config.title;

        // Divisor
        const divider = document.createElement('div');
        divider.className = 'guaguarp-popup-divider';

        // Mensaje
        const message = document.createElement('p');
        message.className = 'guaguarp-popup-message';
        message.textContent = config.message;

        // Submensaje
        const submessage = document.createElement('p');
        submessage.className = 'guaguarp-popup-submessage';
        submessage.textContent = config.submessage;

        // Botón de cerrar
        const closeBtn = document.createElement('button');
        closeBtn.className = 'guaguarp-popup-close';
        closeBtn.textContent = 'Entendido';

        // Audio + hint
        let audio = null;
        let audioPlayed = false;

        if (config.musicUrl) {
            audio = new Audio(config.musicUrl);
            audio.loop = true;
            audio.volume = 0.3;

            // Hint element (hidden until hover)
            const clickHint = document.createElement('div');
            clickHint.id = 'guaguarp-click-hint';
            clickHint.textContent = 'Haz clic en el popup para activar el sonido';
            clickHint.style.cssText = 'display:none; position:absolute; bottom:12px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.6); color:#fff; padding:6px 10px; border-radius:8px; font-size:14px; pointer-events:none; z-index:1000002;';
            container.appendChild(clickHint);

            // Función para intentar reproducir el audio
            const tryPlayAudio = () => {
                if (!audioPlayed && audio) {
                    audio.play()
                        .then(() => {
                            audioPlayed = true;
                            clickHint.remove();
                            console.log('Audio reproduciéndose correctamente');
                        })
                        .catch(err => {
                            console.log('Autoplay bloqueado; espera interacción del usuario');
                        });
                }
            };

            // Intentar reproducir automáticamente
            tryPlayAudio();

            // Mostrar hint mientras el ratón esté sobre el popup si no suena
            container.addEventListener('mouseenter', function () {
                if (!audioPlayed) clickHint.style.display = 'block';
            });
            container.addEventListener('mouseleave', function () {
                if (!audioPlayed) clickHint.style.display = 'none';
            });

            // Reproducir al hacer clic en cualquier parte del popup y ocultar el hint
            container.addEventListener('click', function () {
                tryPlayAudio();
                clickHint.style.display = 'none';
            }, { once: false });

            // También al hacer hover sobre el botón Close intentaremos reproducir
            closeBtn.addEventListener('mouseenter', tryPlayAudio, { once: true });
        }

        // Evento de cerrar
        closeBtn.addEventListener('click', function () {
            // Detener música
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }

            // Guardar timestamp de cierre
            localStorage.setItem(STORAGE_KEY, Date.now().toString());

            // Animar salida
            overlay.style.animation = 'guaguarp-fadeIn 0.3s ease-out reverse';
            setTimeout(() => {
                overlay.remove();
            }, 300);
        });

        // Prevenir cierre al hacer clic en el contenedor
        container.addEventListener('click', function (e) {
            e.stopPropagation();
        });

        // Ensamblar popup
        container.appendChild(logoDiv);
        container.appendChild(title);
        container.appendChild(divider);
        container.appendChild(message);
        container.appendChild(submessage);
        container.appendChild(closeBtn);
        overlay.appendChild(container);

        // Agregar al DOM
        document.body.appendChild(overlay);

        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';

        // Restaurar scroll al cerrar
        closeBtn.addEventListener('click', function () {
            document.body.style.overflow = '';
        });
    }

    // Inicializar cuando el DOM esté listo
    function init() {
        if (shouldShowPopup()) {
            // Esperar un pequeño delay para asegurar que la página esté lista
            setTimeout(createPopup, 500);
        }
    }

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
