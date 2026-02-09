    /* js/progress.js
    Progresso do curso via localStorage
    API global: window.courseProgress
    */

    (() => {
    const STORAGE_KEY = "curso_prog_v1";

    // Ajuste aqui conforme seu curso evoluir
    const COURSE_STRUCTURE = {
        1: { title: "Fundamentos", lessons: 7 },
        2: { title: "HTML", lessons: 5 }, // mesmo que ainda não exista, pode deixar planejado
        3: { title: "CSS", lessons: 5 },
        4: { title: "JavaScript", lessons: 5 },
        5: { title: "Projeto Final", lessons: 5 },
        6: { title: "Python", lessons: 5 },
    };

    function emptyProgress() {
        const modules = {};
        Object.keys(COURSE_STRUCTURE).forEach((m) => {
        modules[m] = { completed: [] };
        });
        return { version: 1, modules };
    }

    function load() {
        try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return emptyProgress();
        const parsed = JSON.parse(raw);

        // “migração” simples: se faltar módulo/estrutura, completa
        const base = emptyProgress();
        const merged = { ...base, ...parsed, modules: { ...base.modules, ...(parsed.modules || {}) } };
        return merged;
        } catch {
        return emptyProgress();
        }
    }

    function save(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function normalizeLessonNumber(n) {
        const num = Number(n);
        return Number.isFinite(num) ? Math.max(1, Math.floor(num)) : null;
    }

    function getTotals() {
        let totalLessons = 0;
        Object.values(COURSE_STRUCTURE).forEach((m) => (totalLessons += m.lessons));
        return totalLessons;
    }

    function getCompletedCount(progress) {
        let done = 0;
        Object.keys(COURSE_STRUCTURE).forEach((m) => {
        const arr = progress.modules?.[m]?.completed || [];
        done += arr.length;
        });
        return done;
    }

    function getOverallPercentage(progress) {
        const total = getTotals();
        const done = getCompletedCount(progress);
        return total === 0 ? 0 : Math.round((done / total) * 100);
    }

    function isLessonCompleted(moduleNumber, lessonNumber) {
        const progress = load();
        const m = String(moduleNumber);
        const l = normalizeLessonNumber(lessonNumber);
        if (!l) return false;
        return (progress.modules?.[m]?.completed || []).includes(l);
    }

    function setLessonCompleted(moduleNumber, lessonNumber, value = true) {
        const progress = load();
        const m = String(moduleNumber);
        const l = normalizeLessonNumber(lessonNumber);
        if (!l) return;

        const list = new Set(progress.modules?.[m]?.completed || []);
        if (value) list.add(l);
        else list.delete(l);

        progress.modules[m] = { completed: Array.from(list).sort((a, b) => a - b) };
        save(progress);
    }

    function toggleLessonCompleted(moduleNumber, lessonNumber) {
        const done = isLessonCompleted(moduleNumber, lessonNumber);
        setLessonCompleted(moduleNumber, lessonNumber, !done);
        return !done;
    }

    // ===== UI helpers =====
    function updateOverallBar() {
        const progress = load();
        const percent = getOverallPercentage(progress);

        const bar = document.getElementById("overall-progress");
        const text = document.getElementById("overall-progress-text");

        if (bar) bar.style.width = `${percent}%`;
        if (text) text.textContent = `Progresso Geral: ${percent}%`;
    }

    function updateModuleStatuses() {
        // opcional: se você colocar data-module="1" em cada link de módulo no menu.html
        const progress = load();

        document.querySelectorAll("[data-module]").forEach((el) => {
        const mod = String(el.getAttribute("data-module"));
        const total = COURSE_STRUCTURE[mod]?.lessons ?? 0;
        const completed = (progress.modules?.[mod]?.completed || []).length;

        // se não tiver aulas planejadas, não mexe
        if (!total) return;

        // status: 0 = upcoming, 1+ = in-progress, total = completed
        el.classList.remove("completed", "in-progress", "upcoming");

        if (completed >= total && total > 0) el.classList.add("completed");
        else if (completed > 0) el.classList.add("in-progress");
        else el.classList.add("upcoming");
        });
    }

    function wireLessonToggleFromDataset() {
        // em uma aula, você pode colocar um botão com id="mark-complete"
        // e no <body> colocar data-module="1" data-lesson="3"
        const btn = document.getElementById("mark-complete");
        const body = document.body;

        if (!btn || !body) return;

        const mod = body.getAttribute("data-module");
        const lesson = body.getAttribute("data-lesson");
        if (!mod || !lesson) return;

        const refreshBtn = () => {
        const done = isLessonCompleted(mod, lesson);
        btn.textContent = done ? "✅ Aula concluída (clique para desfazer)" : "☑️ Marcar como concluída";
        };

        btn.addEventListener("click", () => {
        toggleLessonCompleted(mod, lesson);
        refreshBtn();
        });

        refreshBtn();
    }

    function updateAll() {
        updateOverallBar();
        updateModuleStatuses();
        wireLessonToggleFromDataset();
    }

    // expõe API
    window.courseProgress = {
        load,
        save,
        structure: COURSE_STRUCTURE,
        getOverallPercentage: () => getOverallPercentage(load()),
        isLessonCompleted,
        setLessonCompleted,
        toggleLessonCompleted,
        updateUI: updateAll,
        reset: () => save(emptyProgress()),
    };

    document.addEventListener("DOMContentLoaded", updateAll);
    })();
