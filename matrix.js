/* matrix.js
   - cria um efeito "códigos caindo" usando <canvas>
   - o botão "ENTRAR" direciona para menu.html
*/

/* config e seleção de elementos */
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');
const enterBtn = document.getElementById('enter-btn');

/* redirecionamento do botão */
enterBtn.addEventListener('click', () => {
  // pequeno delay para sensação de resposta
  enterBtn.disabled = true;
  enterBtn.textContent = 'Carregando...';
  setTimeout(() => {
    window.location.href = 'menu.html';
  }, 220);
});

/* função para ajustar tamanho do canvas */
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

/* caracteres a cair: mistura de números, letras e símbolos "matrix-like" */
const chars = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴﾑﾕﾗﾑｦ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%^&*()*&^%';

/* coluna = uma string que cai numa posição x */
const fontSize = 16; // tamanho base do caractere (px)
let columns = Math.floor(window.innerWidth / fontSize);
let drops = [];

/* inicializa as gotas por coluna */
function initDrops() {
  columns = Math.floor(window.innerWidth / fontSize);
  drops = Array(columns).fill(1).map(() => Math.floor(Math.random() * -100));
}
initDrops();

/* função de desenho — executada em loop */
function draw() {
  // leve sombra / esmaecimento: cria rastro ao invés de apagar totalmente
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // cria rastro suave
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = `${fontSize}px monospace`;

  // desenhar cada coluna
  for (let i = 0; i < drops.length; i++) {
    const x = i * fontSize;
    const y = drops[i] * fontSize;

    // escolha aleatória de caractere para cada frame
    const text = chars.charAt(Math.floor(Math.random() * chars.length));

    // cor: brilho verde no topo, mais suave ao descer
    ctx.fillStyle = i % 8 === 0 ? 'rgba(180,255,180,0.95)' : 'rgba(120,240,120,0.7)';
    ctx.fillText(text, x, y);

    // avança a gota; reinicia aleatoriamente quando sai da tela
    if (y > canvas.height + Math.random() * 10000) {
      drops[i] = Math.floor(Math.random() * -100);
    } else {
      drops[i]++;
    }
  }

  requestAnimationFrame(draw);
}

/* Start */
requestAnimationFrame(draw);

