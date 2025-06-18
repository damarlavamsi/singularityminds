let currentPage = 1;
const questionsPerPage = 5;
let questions = [];

function loadQuiz() {
  const scriptTag = document.querySelector('script[data-topic]');
  const topicFile = scriptTag ? scriptTag.getAttribute('data-topic') : 'percentages.json';

  fetch(topicFile)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network error');
      }
      return response.json();
    })
    .then(data => {
      questions = data;
      showPage(currentPage);
    })
    .catch(error => {
      document.getElementById('quiz-container').innerHTML = `<p style="color:red;">Error loading quiz data</p>`;
    });
}

function showPage(page) {
  const start = (page - 1) * questionsPerPage;
  const end = start + questionsPerPage;
  const container = document.getElementById('quiz-container');
  container.innerHTML = '';

  // Scroll to top of the quiz container smoothly
  container.scrollIntoView({ behavior: 'smooth', block: 'start' });

  questions.slice(start, end).forEach((q, index) => {
    const qDiv = document.createElement('div');
    qDiv.className = 'question';
    qDiv.innerHTML = `<p><strong>${start + index + 1}.</strong> ${q.question}</p>`;

    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'options';
    optionsDiv.dataset.correct = q.answer;

    q.options.forEach(opt => {
      const button = document.createElement('button');
      button.textContent = opt;
      button.dataset.option = opt.charAt(0);
      button.innerHTML += `<span class="symbol"></span>`;
      button.addEventListener('click', () => {
        const allButtons = optionsDiv.querySelectorAll('button');
        allButtons.forEach(btn => btn.disabled = true);

        const symbol = button.querySelector('.symbol');
        if (button.dataset.option === q.answer) {
          button.classList.add('correct');
          symbol.textContent = '✔';
        } else {
          button.classList.add('wrong');
          symbol.textContent = '✖';

          allButtons.forEach(btn => {
            if (btn.dataset.option === q.answer) {
              btn.classList.add('correct');
              btn.querySelector('.symbol').textContent = '✔';
            }
          });
        }
      });
      optionsDiv.appendChild(button);
    });

    qDiv.appendChild(optionsDiv);
    container.appendChild(qDiv);
  });

  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const paginationDiv = document.createElement('div');
  paginationDiv.className = 'pagination';

  if (currentPage > 1) {
    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Previous';
    prevBtn.onclick = () => {
      currentPage--;
      showPage(currentPage);
    };
    paginationDiv.appendChild(prevBtn);
  }

  if (currentPage < totalPages) {
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.onclick = () => {
      currentPage++;
      showPage(currentPage);
    };
    paginationDiv.appendChild(nextBtn);
  }

  document.getElementById('quiz-container').appendChild(paginationDiv);
}

window.onload = loadQuiz;
