[file name]: js/progress-simple.js
[file content begin]
// === Sistema de Progresso Simplificado ===

class SimpleCourseProgress {
    constructor() {
        this.storageKey = 'courseProgress';
        this.init();
    }

    init() {
        if (this.isModuleIndex()) {
            this.updateModuleProgress();
        }
        this.setupLessonCompletion();
    }

    isModuleIndex() {
        return window.location.pathname.includes('/modules/') && 
               !window.location.pathname.includes('/aula');
    }

    getProgress() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : {
            modules: {
                1: { completed: [1], current: 2, total: 7 },
                2: { completed: [1], current: 2, total: 5 },
                3: { completed: [], current: 1, total: 5 },
                4: { completed: [], current: 1, total: 5 },
                5: { completed: [], current: 1, total: 5 },
                6: { completed: [], current: 1, total: 5 }
            },
            lastAccessed: Date.now()
        };
    }

    saveProgress(progress) {
        localStorage.setItem(this.storageKey, JSON.stringify(progress));
    }

    completeCurrentLesson() {
        const progress = this.getProgress();
        const currentModule = this.getCurrentModule();
        const currentLesson = this.getCurrentLesson();
        
        const moduleProgress = progress.modules[currentModule];
        
        if (!moduleProgress.completed.includes(currentLesson)) {
            moduleProgress.completed.push(currentLesson);
            moduleProgress.current = currentLesson + 1;
            this.saveProgress(progress);
            
            // Notifica outras partes da aplicação
            window.dispatchEvent(new CustomEvent('progressUpdated', {
                detail: { module: currentModule, lesson: currentLesson }
            }));
            
            console.log(`✅ Aula ${currentLesson} do módulo ${currentModule} concluída!`);
        }
    }

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

    getCurrentLesson() {
        const path = window.location.pathname;
        const match = path.match(/aula(\d+)\.html/);
        return match ? parseInt(match[1]) : 1;
    }

    updateModuleProgress() {
        const progress = this.getProgress();
        const currentModule = this.getCurrentModule();
        const moduleProgress = progress.modules[currentModule];
        
        // Atualiza barra de progresso
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (progressFill && progressText) {
            const percentage = (moduleProgress.completed.length / moduleProgress.total) * 100;
            progressFill.style.width = `${percentage}%`;
            progressText.textContent = `${moduleProgress.completed.length}/${moduleProgress.total} aulas concluídas`;
        }

        // Atualiza links das aulas
        document.querySelectorAll('.lesson-link').forEach(link => {
            const lessonNum = parseInt(link.dataset.lesson);
            const statusEl = link.querySelector('.lesson-status');
            
            if (moduleProgress.completed.includes(lessonNum)) {
                statusEl.textContent = '✅';
                link.style.opacity = '1';
            } else if (lessonNum === moduleProgress.current) {
                statusEl.textContent = '➡️';
                link.style.opacity = '1';
            } else if (lessonNum < moduleProgress.current) {
                statusEl.textContent = '✅';
                link.style.opacity = '1';
            } else {
                statusEl.textContent = '🔒';
                link.style.opacity = '0.7';
            }
        });

        // Atualiza botão continuar
        this.updateContinueButton();
    }

    updateContinueButton() {
        const continueBtn = document.getElementById('continue-btn');
        if (!continueBtn) return;

        const progress = this.getProgress();
        const currentModule = this.getCurrentModule();
        const moduleProgress = progress.modules[currentModule];
        const nextLesson = moduleProgress.current;

        if (nextLesson <= moduleProgress.total) {
            continueBtn.textContent = `Continuar: Aula ${nextLesson}`;
            continueBtn.onclick = () => {
                window.location.href = `aula${nextLesson}.html`;
            };
            continueBtn.style.display = 'block';
        } else {
            continueBtn.textContent = '🎉 Módulo Concluído!';
            continueBtn.disabled = true;
        }
    }

    setupLessonCompletion() {
        // Marca como concluída quando usuário chega no final da página
        if (this.getCurrentLesson() > 0) {
            const completionMarker = document.getElementById('lesson-completion-marker');
            if (completionMarker) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.completeCurrentLesson();
                            observer.disconnect(); // Para de observar após completar
                        }
                    });
                }, { threshold: 0.8 });

                observer.observe(completionMarker);
            }

            // Também marca como concluída se o usuário ficar 60 segundos na página
            setTimeout(() => {
                this.completeCurrentLesson();
            }, 60000);
        }
    }
}

// Inicialização automática
document.addEventListener('DOMContentLoaded', () => {
    window.simpleProgress = new SimpleCourseProgress();
});
[file content end]