document.addEventListener('DOMContentLoaded', () => {

    const menuLinks = document.querySelectorAll('.sidebar ul li a');
    
    window.showContent = function(sectionId) {
        document.querySelectorAll('.content-section').forEach(section => {
            section.style.display = 'none';
        });

        menuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('onclick').includes(`'${sectionId}'`)) {
                link.classList.add('active');
            }
        });

        const activeSection = document.getElementById('content-' + sectionId);
        if (activeSection) {
            activeSection.style.display = 'block';
        }
    }

    showContent('home');

    const calendarSection = document.getElementById('content-service');
    if (calendarSection) {
        const monthYearElement = document.getElementById('current-month-year');
        const calendarBody = document.getElementById('calendar-body');
        const prevMonthBtn = document.getElementById('prev-month-btn');
        const nextMonthBtn = document.getElementById('next-month-btn');
        const logDateElement = document.getElementById('log-date');
        const plantLogsElement = document.getElementById('plant-logs');
        const addLogBtn = document.getElementById('add-log-btn');
        const today = new Date();
        let dateForCalendar = new Date(today.getFullYear(), today.getMonth(), 1);
        let selectedDate = new Date(); 
        const plantLogsData = {
            "2025-5-11": [
                { plant: 'Pinky', task: '물주기 완료!', class: 'pinky' },
                { plant: '또또', task: '분갈이 완료!', class: 'dodo' },
                { plant: '또또', task: '잎이 하나 떨어졌다...', class: 'dodo-leaf' }
            ]
        };

        function renderCalendar() {
            calendarBody.innerHTML = '';
            const year = dateForCalendar.getFullYear();
            const month = dateForCalendar.getMonth();
            monthYearElement.textContent = `${dateForCalendar.toLocaleString('en-US', { month: 'long' })} ${year}`;
            const firstDayOfMonth = new Date(year, month, 1).getDay();
            const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
            for (let i = 0; i < firstDayOfMonth; i++) {
                const emptyCell = document.createElement('div');
                emptyCell.classList.add('calendar-day', 'empty');
                calendarBody.appendChild(emptyCell);
            }
            for (let day = 1; day <= lastDateOfMonth; day++) {
                const dayCell = document.createElement('div');
                dayCell.classList.add('calendar-day');
                dayCell.textContent = day;
                const today = new Date();
                if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                    dayCell.classList.add('today');
                }
                if (selectedDate && year === selectedDate.getFullYear() && month === selectedDate.getMonth() && day === selectedDate.getDate()) {
                    dayCell.classList.remove('today');
                    dayCell.classList.add('selected');
                }
                dayCell.addEventListener('click', () => {
                    if (dayCell.classList.contains('empty')) return;
                    selectedDate = new Date(year, month, day);
                    renderCalendar();
                    renderPlantLogs();
                });
                calendarBody.appendChild(dayCell);
            }
        }

        function renderPlantLogs() {
            if (!selectedDate) {
                logDateElement.textContent = '날짜를 선택하세요';
                plantLogsElement.innerHTML = '';
                return;
            }
            const logKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
            logDateElement.textContent = `${selectedDate.toLocaleString('en-US', { month: 'long' })} ${selectedDate.getDate()}`;
            plantLogsElement.innerHTML = '';
            if (plantLogsData[logKey] && plantLogsData[logKey].length > 0) {
                plantLogsData[logKey].forEach(log => {
                    const logEntry = document.createElement('div');
                    logEntry.classList.add('log-entry', log.class);
                    logEntry.innerHTML = `<p>${log.plant}</p><span>${log.task}</span>`;
                    plantLogsElement.appendChild(logEntry);
                });
            } else {
                plantLogsElement.innerHTML = '<span>기록이 없습니다.</span>';
            }
        }
        
        addLogBtn.addEventListener('click', () => {
            const plantNameInput = document.getElementById('plant-name-input');
            const taskInput = document.getElementById('task-input');
            const plantName = plantNameInput.value.trim();
            const task = taskInput.value.trim();
            if (!selectedDate) {
                alert('날짜를 먼저 선택해주세요.');
                return;
            }
            if (plantName === '' || task === '') {
                alert('식물 이름과 내용을 모두 입력해주세요.');
                return;
            }
            const logKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
            if (!plantLogsData[logKey]) {
                plantLogsData[logKey] = [];
            }
            plantLogsData[logKey].push({
                plant: plantName,
                task: task,
                class: 'default'
            });
            plantNameInput.value = '';
            taskInput.value = '';
            renderPlantLogs();
        });

        prevMonthBtn.addEventListener('click', () => {
            dateForCalendar.setMonth(dateForCalendar.getMonth() - 1);
            renderCalendar();
        });
        nextMonthBtn.addEventListener('click', () => {
            dateForCalendar.setMonth(dateForCalendar.getMonth() + 1);
            renderCalendar();
        });
        renderCalendar();
        renderPlantLogs();
    }

    const bugSpotSection = document.getElementById('content-bugspot');
    if (bugSpotSection) {
        const items = [
            { name: '흰가루병', category: 'disease' },
            { name: '잿빛곰팡이병', category: 'disease' },
            { name: '그을음병', category: 'disease' },
            { name: '무름병', category: 'disease' },
            { name: '탄저병', category: 'disease' },
            { name: '녹병', category: 'disease' },
            { name: '점무늬병', category: 'disease' },
            { name: '시들음병', category: 'disease' },
            { name: '잎마름병', category: 'disease' },
            { name: '노균병', category: 'disease' },
            { name: '검은별무늬병', category: 'disease' },
            { name: '버섯', category: 'disease'},
            { name: '뿌리파리', category: 'bug' },
            { name: '응애', category: 'bug' },
            { name: '진딧물', category: 'bug' },
            { name: '총채벌레', category: 'bug' },
            { name: '가루깍지벌레', category: 'bug' },
            { name: '민달팽이', category: 'bug' },
            { name: '온실가루이', category: 'bug' },
            { name: '굴파리', category: 'bug' },
            { name: '나방파리', category: 'bug' },
            { name: '선충', category: 'bug' },
            { name: '풍뎅이', category: 'bug' },
            { name: '개미', category: 'bug' },
        ];

        const grid = document.getElementById('bugspot-grid');
        const searchInput = document.getElementById('bugspot-search-input');
        const diseaseFilterBtn = document.getElementById('filter-disease');
        const bugFilterBtn = document.getElementById('filter-bug');
        let currentCategory = 'disease';

        const renderItems = () => {
            grid.innerHTML = '';
            const searchTerm = searchInput.value.toLowerCase().replace(/\s/g, '');
            const filteredItems = items.filter(item => {
                const inCategory = item.category === currentCategory;
                const matchesSearch = item.name.toLowerCase().replace(/\s/g, '').includes(searchTerm);
                return inCategory && matchesSearch;
            });

            filteredItems.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'bugspot-item';
                itemDiv.innerHTML = `
                    <div class="bugspot-item-image"></div>
                    <p class="bugspot-item-name">${item.name}</p>
                `;
                grid.appendChild(itemDiv);
            });
            
            const slotsToFill = Math.max(0, 12 - filteredItems.length);
            for (let i = 0; i < slotsToFill; i++) {
                const emptySlot = document.createElement('div');
                emptySlot.className = 'bugspot-item empty-slot';
                emptySlot.innerHTML = `
                    <div class="bugspot-item-image"></div>
                    <p class="bugspot-item-name">&nbsp;</p>
                `;
                grid.appendChild(emptySlot);
            }
        };

        const setActiveFilter = (category) => {
            currentCategory = category;
            searchInput.value = '';
            diseaseFilterBtn.classList.toggle('active', category === 'disease');
            bugFilterBtn.classList.toggle('active', category === 'bug');
            renderItems();
        };

        diseaseFilterBtn.addEventListener('click', () => setActiveFilter('disease'));
        bugFilterBtn.addEventListener('click', () => setActiveFilter('bug'));
        searchInput.addEventListener('input', renderItems);
        setActiveFilter('disease');
    }
});