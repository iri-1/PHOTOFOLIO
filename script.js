// GAS Web App のURL（デプロイ後にここに貼り付けてください）
const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbxabvg7sLHtw1lxhbUs3021C945dyOBIpYXeDh6ozV9zdBArHxUoyyW8m8B2nsCX1wIPw/exec';

async function fetchPortfolioData() {
    if (!GAS_API_URL) return;

    try {
        const response = await fetch(GAS_API_URL);
        const data = await response.json();

        // ニュースの更新
        if (data.settings && data.settings.NewsContent) {
            const newsElement = document.getElementById('news-content');
            const newsBoard = document.getElementById('news-board');
            
            if (newsElement) {
                newsElement.innerHTML = data.settings.NewsContent;
            }
            if (newsBoard) {
                newsBoard.innerHTML = data.settings.NewsContent;
            }
        } else {
            const newsBoard = document.getElementById('news-board');
            if (newsBoard) {
                newsBoard.innerHTML = '<p>現在、新しいお知らせはありません。</p>';
            }
        }

        // 作品一覧の更新
        if (data.works) {
            renderWorks(data.works);
        }
    } catch (error) {
        console.error('データの取得に失敗しました:', error);
    }
}

function renderWorks(works) {
    const container = document.getElementById('works-container');
    if (!container) return;

    console.log('Rendering works:', works);
    container.innerHTML = '';
    
    // 有効なデータ（タイトルがあるもの）のみを対象にする
    const validWorks = works.filter(w => w.title);
    
    if (validWorks.length === 0) {
        container.innerHTML = '<p style="text-align:center; width:100%; color:var(--text-muted);">表示できる作品がありません。</p>';
        return;
    }

    validWorks.forEach(work => {
        const li = document.createElement('li');

        let infoHtml = '';
        if (work.info && typeof work.info === 'string') {
            infoHtml = `<div style="padding: 0 1.5rem 1.5rem; font-size: 0.75rem; color: #64748b;">${work.info.replace(/\n/g, '<br>')}</div>`;
        } else if (work.info) {
             infoHtml = `<div style="padding: 0 1.5rem 1.5rem; font-size: 0.75rem; color: #64748b;">${work.info}</div>`;
        }

        li.innerHTML = `
            <img src="${work.imageUrl || 'img/todo.png'}" alt="${work.title}" onerror="this.src='img/todo.png'">
            <h3>${work.title || '無題'}</h3>
            <span>${work.tech || ''}</span>
            <div class="link">
                ${work.webUrl ? `<a href="${work.webUrl}" target="_blank">Web サイト</a>` : ''}
                ${work.githubUrl ? `<a href="${work.githubUrl}" target="_blank">Github</a>` : ''}
            </div>
            ${infoHtml}
        `;
        container.appendChild(li);
    });
}

function updateDateTime() {
    const now = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    const dateTimeString = now.toLocaleDateString('ja-JP', options);
    const element = document.getElementById('current-date-time');
    if (element) {
        element.textContent = dateTimeString;
    }
}

function generateCalendar() {
    const calendarElement = document.getElementById('calendar-grid');
    if (!calendarElement) return;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    // Set header
    const monthYearElement = document.getElementById('calendar-month-year');
    if (monthYearElement) {
        monthYearElement.textContent = `${year}年 ${month + 1}月`;
    }

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendarElement.innerHTML = '';

    // Add day headers
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    days.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day header';
        dayHeader.textContent = day;
        calendarElement.appendChild(dayHeader);
    });

    // Add empty slots before first day
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day empty';
        calendarElement.appendChild(emptyCell);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        dayCell.textContent = day;

        if (day === now.getDate()) {
            dayCell.classList.add('today');
        }

        calendarElement.appendChild(dayCell);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    generateCalendar();
    fetchPortfolioData();
});
