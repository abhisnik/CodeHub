// Render question list
function renderCards(questions, containerId) {
    const el = document.getElementById(containerId);
    if (!questions.length) {
        el.innerHTML = '<p style="color: var(--text-muted)">No questions found.</p>';
        return;
    }
    el.innerHTML = questions.map(q => `
        <a class="card" href="question.html?id=${q.id}">
            <div>
                <span style="font-size: 0.8rem; color: var(--primary)">${q.topic}</span>
                <h3 style="margin-top: 0.4rem">${q.title}</h3>
            </div>
            <div class="tags">
                <span class="tag ${q.difficulty}">${q.difficulty}</span>
                <span class="tag">${q.category}</span>
            </div>
        </a>
    `).join('');
}

// Fetch helper with filters
async function fetchQuestions(section = '', topic = '', search = '') {
    const params = new URLSearchParams();
    if (section) params.append('section', section);
    if (topic) params.append('topic', topic);
    if (search) params.append('search', search);
    const res = await fetch(`/api/questions?${params.toString()}`);
    return await res.json();
}