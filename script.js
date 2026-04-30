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
});
