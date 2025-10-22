// matrix-menu.js (atualizado)
const canvasMenu = document.getElementById("matrix-canvas-menu");
const ctxMenu = canvasMenu.getContext("2d");

let columnsMenu;
let dropsMenu = [];
const fontSize = 16; // tamanho dos caracteres
const charsMenu = String.fromCharCode(...Array.from({length: 94}, (_, i) => i + 33)); // caracteres ASCII 33-126

// Função para inicializar gotas
function initDropsMenu() {
    columnsMenu = Math.floor(canvasMenu.width / fontSize);
    dropsMenu = Array(columnsMenu).fill(0).map(() => Math.random() * canvasMenu.height);
}

// Ajusta tamanho do canvas e reinicializa gotas
function resizeCanvasMenu() {
    canvasMenu.width = window.innerWidth;
    canvasMenu.height = window.innerHeight;
    initDropsMenu();
}

// Função de desenho
function drawMenu() {
    // Fundo com leve esmaecimento
    ctxMenu.fillStyle = "rgba(0,0,0,0.05)";
    ctxMenu.fillRect(0, 0, canvasMenu.width, canvasMenu.height);

    ctxMenu.fillStyle = "#7afc7a";
    ctxMenu.font = `${fontSize}px monospace`;

    for (let i = 0; i < dropsMenu.length; i++) {
        const text = charsMenu.charAt(Math.floor(Math.random() * charsMenu.length));
        ctxMenu.fillText(text, i * fontSize, dropsMenu[i]);

        dropsMenu[i] += fontSize;

        if (dropsMenu[i] > canvasMenu.height) {
            dropsMenu[i] = 0;
        }
    }

    requestAnimationFrame(drawMenu);
}

// Inicialização
resizeCanvasMenu();
drawMenu();

// Redimensionamento
window.addEventListener("resize", resizeCanvasMenu);
