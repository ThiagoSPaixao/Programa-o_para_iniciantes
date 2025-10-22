// matrix-menu.js
const canvasMenu = document.getElementById("matrix-canvas-menu");
const ctxMenu = canvasMenu.getContext("2d");

canvasMenu.width = window.innerWidth;
canvasMenu.height = window.innerHeight;

const columnsMenu = canvasMenu.width / 20;
const dropsMenu = [];

for (let x = 0; x < columnsMenu; x++) {
    dropsMenu[x] = Math.random() * canvasMenu.height;
}

function drawMenu() {
    ctxMenu.fillStyle = "rgba(0,0,0,0.05)";  // leve esmaecimento
    ctxMenu.fillRect(0, 0, canvasMenu.width, canvasMenu.height);

    ctxMenu.fillStyle = "#7afc7a";  // cor dos códigos
    ctxMenu.font = "16px monospace";

    for (let i = 0; i < dropsMenu.length; i++) {
        const text = String.fromCharCode(33 + Math.random() * 94);
        ctxMenu.fillText(text, i * 20, dropsMenu[i]);

        dropsMenu[i] += 20;
        if (dropsMenu[i] > canvasMenu.height) {
            dropsMenu[i] = 0;
        }
    }
}

setInterval(drawMenu, 50);

// reajustar canvas ao redimensionar janela
window.addEventListener("resize", function() {
    canvasMenu.width = window.innerWidth;
    canvasMenu.height = window.innerHeight;
});
