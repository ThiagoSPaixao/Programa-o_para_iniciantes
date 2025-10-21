const toggleBtn = document.getElementById("theme-toggle");
const body = document.body

toggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark-theme");
    body.classList.toggle("light-theme");

    if (body.classList.contains("dark-theme")) {
        toggleBtn.textContent = "☀️";
    } else {
        toggleBtn.textContent = "🌙";
    }
});

// ==== EXERCÍCIO: Envio para FormSubmit via AJAX ====
(() => {
  const form = document.getElementById('exercise-form');
  const submitBtn = document.getElementById('submit-btn');
  const feedback = document.getElementById('form-feedback');

  // endpoint AJAX do FormSubmit (substitua pelo seu e-mail)
  const endpoint = 'https://formsubmit.co/ajax/thiaguinhoescolhido26@gmail.com';

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // evita envio tradicional / reload

    // validação simples
    const text = document.getElementById('exercise-text').value.trim();
    if (!text) {
      feedback.textContent = 'Por favor, escreva seu exercício antes de enviar.';
      feedback.style.color = '#c0392b'; // vermelho
      return;
    }

    // preparar envio
    submitBtn.disabled = true;
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    feedback.textContent = '';

    // animar o botão (se tiver a classe .spin definida)
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.classList.add('spin');
      setTimeout(() => themeBtn.classList.remove('spin'), 400);
    }

    try {
      const formData = new FormData(form);
      // opcional: adicionar data/hora
      formData.append('_timestamp', new Date().toISOString());

      const resp = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      const json = await resp.json();

      if (resp.ok) {
        // sucesso
        feedback.style.color = '#0f9d58'; // verde
        feedback.textContent = '✅ Exercício enviado com sucesso! Obrigado.';
        form.reset(); // limpa campos
      } else {
        // erro retornado pela API
        feedback.style.color = '#c0392b';
        feedback.textContent = json.message || 'Erro ao enviar. Tente novamente mais tarde.';
      }
    } catch (err) {
      feedback.style.color = '#c0392b';
      feedback.textContent = 'Erro de rede ao enviar. Verifique sua conexão.';
      console.error('Erro ao enviar exercício:', err);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });
})();
