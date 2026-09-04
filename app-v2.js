const lessonLinks = [...document.querySelectorAll('.lesson-link')];
const lessons = [...document.querySelectorAll('.lesson')];
const completeButtons = [...document.querySelectorAll('.complete-btn')];
const progressFill = document.getElementById('topProgress');
const progressText = document.getElementById('progressText');
const resetButton = document.getElementById('resetProgress');
const toolTabs = [...document.querySelectorAll('.tool-tab')];
const toolPanels = [...document.querySelectorAll('.tool-panel')];
const quizForm = document.getElementById('quizForm');
const quizResult = document.getElementById('quizResult');

const TOTAL_LESSONS = 12;
const storageKey = 'barber-academy-block-01-v2';

let state = JSON.parse(localStorage.getItem(storageKey) || '{"completed":[],"quizPassed":false}');

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function showLesson(id) {
  lessons.forEach((lesson) => lesson.classList.toggle('active', lesson.id === id));
  lessonLinks.forEach((link) => link.classList.toggle('active', link.dataset.target === id));
  const target = document.getElementById(id);
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

lessonLinks.forEach((link) => {
  link.addEventListener('click', () => showLesson(link.dataset.target));
});

function updateProgress() {
  const lessonScore = state.completed.length;
  const quizScore = state.quizPassed ? 1 : 0;
  const total = TOTAL_LESSONS + 1;
  const percentage = Math.round(((lessonScore + quizScore) / total) * 100);
  if (progressFill) progressFill.style.width = `${percentage}%`;
  if (progressText) progressText.textContent = `${percentage}%`;

  completeButtons.forEach((button) => {
    const lesson = button.closest('[data-lesson]');
    const number = Number(lesson?.dataset.lesson);
    const done = state.completed.includes(number);
    button.classList.toggle('done', done);
    button.textContent = done ? '✓ Пройдено' : 'Отметить пройденным';
  });
}

completeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const lesson = button.closest('[data-lesson]');
    const number = Number(lesson.dataset.lesson);
    if (state.completed.includes(number)) {
      state.completed = state.completed.filter((item) => item !== number);
    } else {
      state.completed.push(number);
      state.completed.sort((a, b) => a - b);
    }
    saveState();
    updateProgress();
  });
});

toolTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    toolTabs.forEach((item) => item.classList.remove('active'));
    toolPanels.forEach((panel) => panel.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tool)?.classList.add('active');
  });
});

if (quizForm) {
  quizForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const answers = {
      q1: 'b', q2: 'a', q3: 'b', q4: 'a', q5: 'a',
      q6: 'b', q7: 'a', q8: 'b', q9: 'b', q10: 'b'
    };
    let score = 0;
    Object.entries(answers).forEach(([question, correct]) => {
      const selected = quizForm.querySelector(`input[name="${question}"]:checked`);
      if (selected?.value === correct) score += 1;
    });

    const passed = score >= 8;
    state.quizPassed = passed;
    saveState();
    updateProgress();

    quizResult.className = `quiz-result ${passed ? 'success' : 'fail'}`;
    quizResult.innerHTML = passed
      ? `<strong>${score}/10 — блок пройден 🎓</strong><p>Отличная база. Можно переходить к следующему модулю: анатомия головы и построение формы.</p>`
      : `<strong>${score}/10 — нужно минимум 8 правильных ответов</strong><p>Вернись к урокам, повтори сложные темы и попробуй ещё раз.</p>`;
  });
}

if (resetButton) {
  resetButton.addEventListener('click', () => {
    state = { completed: [], quizPassed: false };
    saveState();
    updateProgress();
    document.querySelectorAll('.checklist input').forEach((input) => input.checked = false);
    if (quizForm) quizForm.reset();
    if (quizResult) {
      quizResult.className = 'quiz-result';
      quizResult.innerHTML = '';
    }
  });
}

updateProgress();