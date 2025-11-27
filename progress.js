[file name]: js/progress.js
[file content begin]
// === Sistema de Progresso do Curso ===

class CourseProgress {
    constructor() {
        this.storageKey = 'courseProgress';
        this.currentModule = this.getCurrentModule();
        this.init();
    }

    init() {
        this.updateProgressUI();
        this.setupEventListeners();
        this.updateContinueButton();
    }

    // Determina módulo atual baseado na URL
    getCurrentModule() {
        const path = window.location.pathname;
        if (path.includes('module1-fundamentos')) return 1;
        if (path.includes('module2-html')) return 2;
        if (path.includes('module3-css')) return 3;
        if (path.includes('module4-js')) return 4;
        if (path.includes('module5-projeto-final')) return 5;
        if (path.includes('module6-python')) return 6;
        return 1;
    }

    // Carrega progresso do localStorage
    getProgress() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : {
            modules: {
                1: { completed: [1], currentLesson: 2 }, // Module1: Aula1 concluída
                2: { completed: [1], currentLesson: 2 }, // Module2: Aula1 concluída
                3: { completed: [], currentLesson: 1 },
                4: { completed: [], currentLesson: 1 },
                5: { completed: [], currentLesson: 1 },
                6: { completed: [], currentLesson: 1 }
            }
        };
    }

    // Salva progresso no localStorage
    saveProgress(progress) {
        localStorage.setItem(this.storageKey, JSON.stringify(progress));
    }

    // Marca aula como concluída
    completeLesson(moduleNumber, lessonNumber) {
        const progress = this.getProgress();
        
        if (!progress.modules[moduleNumber].completed.includes(lessonNumber)) {
            progress.modules[moduleNumber].completed.push(lessonNumber);
            progress.modules[moduleNumber].currentLesson = lessonNumber + 1;
            this.saveProgress(progress);
            
            // Dispara evento para atualizar outras partes da UI
            window.dispatchEvent(new CustomEvent('progressUpdated'));
        }
    }

    // Atualiza UI do progresso
    updateProgressUI() {
        const progress = this.getProgress();
        const moduleProgress = progress.modules[this.currentModule];
        
        // Atualiza barra de progresso
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (progressFill && progressText) {
            const totalLessons = 5; // Ajustar conforme módulo
            const completed = moduleProgress.completed.length;
            const percentage = (completed / totalLessons) * 100;
            
            progressFill.style.width = `${percentage}%`;
            progressText.textContent = `${completed}/${totalLessons} aulas concluídas`;
        }

        // Atualiza status das aulas
        document.querySelectorAll('.lesson-link').forEach(link => {
            const lessonNum = parseInt(link.dataset.lesson);
            const statusEl = link.querySelector('.lesson-status');
            
            if (moduleProgress.completed.includes(lessonNum)) {
                statusEl.textContent = '✅';
                statusEl.className = 'lesson-status completed';
                link.style.opacity = '1';
            } else if (lessonNum === moduleProgress.currentLesson) {
                statusEl.textContent = '➡️';
                statusEl.className = 'lesson-status current';
                link.style.opacity = '1';
            } else if (lessonNum < moduleProgress.currentLesson) {
                statusEl.textContent = '✅';
                statusEl.className = 'lesson-status completed';
                link.style.opacity = '1';
            } else {
                statusEl.textContent = '🔒';
                statusEl.className = 'lesson-status locked';
                link.style.opacity = '0.7';
            }
        });
    }

    // Atualiza botão "Continuar"
    updateContinueButton() {
        const continueBtn = document.getElementById('continue-btn');
        if (!continueBtn) return;

        const progress = this.getProgress();
        const moduleProgress = progress.modules[this.currentModule];
        const nextLesson = moduleProgress.currentLesson;

        if (nextLesson <= 5) {
            continueBtn.textContent = `Continuar: Aula ${nextLesson}`;
            continueBtn.onclick = () => {
                window.location.href = `aula${nextLesson}/index.html`;
            };
        } else {
            continueBtn.textContent = 'Módulo Concluído! 🎉';
            continueBtn.disabled = true;
        }
    }

    setupEventListeners() {
        // Atualiza UI quando progresso muda
        window.addEventListener('progressUpdated', () => {
            this.updateProgressUI();
            this.updateContinueButton();
        });

        // Marca aula como concluída quando usuário chega no final
        if (this.isLessonPage()) {
            this.setupLessonCompletion();
        }
    }

    isLessonPage() {
        return window.location.pathname.includes('/aula');
    }

    setupLessonCompletion() {
        // Marca como concluída quando usuário rola até o final
        const completionMarker = document.getElementById('lesson-completion-marker');
        if (completionMarker) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const lessonNum = this.getCurrentLessonNumber();
                        this.completeLesson(this.currentModule, lessonNum);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(completionMarker);
        }
    }

    getCurrentLessonNumber() {
        const path = window.location.pathname;
        const match = path.match(/aula(\d+)/);
        return match ? parseInt(match[1]) : 1;
    }
}

// Inicializa quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.courseProgress = new CourseProgress();
});

// Função global para marcar conclusão manual
window.markLessonComplete = function(moduleNumber, lessonNumber) {
    if (window.courseProgress) {
        window.courseProgress.completeLesson(moduleNumber, lessonNumber);
    }
};
[file content end]