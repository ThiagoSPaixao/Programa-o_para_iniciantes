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