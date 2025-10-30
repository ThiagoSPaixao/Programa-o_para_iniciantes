// === console.js ===
// Permite executar código Python diretamente no navegador com Skulpt

function outf(text) {
  const output = document.getElementById("output");
  output.textContent += text;
}

function builtinRead(x) {
  if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
    throw "Arquivo não encontrado: '" + x + "'";
  return Sk.builtinFiles["files"][x];
}

function runCode() {
    document.getElementById("code-input").value ||= 'print("Olá, programador!")';
    const code = document.getElementById("code-input").value;
    const output = document.getElementById("output");
    output.textContent = ""; // limpa antes de executar

  Sk.configure({ output: outf, read: builtinRead });
  Sk.misceval
    .asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, code, true))
    .catch(err => output.textContent = err.toString());
}

document.addEventListener("DOMContentLoaded", () => {
  const runBtn = document.getElementById("run-code");
  if (runBtn) runBtn.addEventListener("click", runCode);
});
