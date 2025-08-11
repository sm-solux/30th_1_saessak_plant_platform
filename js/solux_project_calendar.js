//supabase 관련 JS
const supabaseUrl = 'https://iiskzhqeshvyjkyvsvhz.supabase.co'
const supabaseKey = ''
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey)

    const monthYearElement = document.getElementById('current-month-year');
    const calendarBody = document.getElementById('calendar-body');
    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');
    const logDateElement = document.getElementById('log-date');
    const plantLogsElement = document.getElementById('plant-logs');
    const addLogBtn = document.getElementById('add-log-btn');

    let dateForCalendar = new Date();
    let selectedDate = new Date();
    const plantLogsData = {};
    let plants = [];  // 여기에 supabase 데이터 담음

    const wateringIntervals = {
        음지: 60,      // location마다 물주기 다르게
        반음지: 30,
        반양지: 14,
        양지: 7,
      };
    function getNextWateringDate(plant) {
        if (!plant.date2 || !plant.location) return null;
        const lastWaterDate = new Date(plant.date2);
        const interval = wateringIntervals[plant.location] || 30; // 기본 30일
        const nextDate = new Date(lastWaterDate);
        nextDate.setDate(nextDate.getDate() + interval);
        return nextDate;
    }

    async function loadPlantsData() {
        // 실제 유저 ID로 바꾸세요
        const { data, error } = await supabaseClient
          .from('table_addplants')
          .select('id, nickname, date2, location')
        if (error) {
          console.error('식물 데이터 불러오기 오류:', error);
          return [];
        }
        console.log('불러온 식물 데이터:', data);  // 여기를 꼭 확인
        return data;
        }

    function renderCalendar() {
      calendarBody.innerHTML = '';
      const year = dateForCalendar.getFullYear();
      const month = dateForCalendar.getMonth();
      monthYearElement.textContent = `${dateForCalendar.toLocaleString('en-US', { month: 'long' })} ${year}`;
      const firstDayOfMonth = new Date(year, month, 1).getDay();
      const lastDateOfMonth = new Date(year, month + 1, 0).getDate();

      // 빈 칸 생성
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
          dayCell.classList.add('selected');
        }

         // 이번 물 주는 날짜 (date2) 와 다음 물 주는 날짜 (date2 + 주기) 확인
        const plantsThatWateredToday = plants.filter(plant => {
          if (!plant.date2) return false;
          const lastWaterDate = new Date(plant.date2);
          return (
            lastWaterDate.getFullYear() === year &&
            lastWaterDate.getMonth() === month &&
            lastWaterDate.getDate() === day
          );
        });

        const plantsNextWaterDate = plants.filter(plant => {
          const nextWaterDate = getNextWateringDate(plant);
          if (!nextWaterDate) return false;
          return (
            nextWaterDate.getFullYear() === year &&
            nextWaterDate.getMonth() === month &&
            nextWaterDate.getDate() === day
          );
        });

        // 표시용 요소 생성 함수
        function createWaterMark(text, title) {
          const mark = document.createElement('div');
          mark.classList.add('watering-mark');
          mark.title = title;
          mark.textContent = text;
          return mark;
        }

        // 마지막 물 준 날짜(●) 표시: 겹치는 식물 모두 개별 출력
    plantsThatWateredToday.forEach(plant => {
      const lastWaterMark = createWaterMark('●', `${plant.nickname} 이번에 물 준 날`);
      lastWaterMark.style.color = '#1E90FF';
      dayCell.appendChild(lastWaterMark);
    });

    // 다음 물 줄 날짜(💧) 표시: 겹치는 식물 모두 개별 출력
    plantsNextWaterDate.forEach(plant => {
      const nextWaterMark = createWaterMark('💧', `${plant.nickname} 다음에 물 줄 날`);
      nextWaterMark.style.color = '#28a745';
      dayCell.appendChild(nextWaterMark);
    });

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
      const logKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
      const monthDayText = `${selectedDate.toLocaleString('en-US', { month: 'long' })} ${selectedDate.getDate()}`;

      const wateredPlants = plants.filter(plant => {
        if (!plant.date2) return false;
          const lastWaterDate = new Date(plant.date2);
        return (
          lastWaterDate.getFullYear() === selectedDate.getFullYear() &&
          lastWaterDate.getMonth() === selectedDate.getMonth() &&
          lastWaterDate.getDate() === selectedDate.getDate()
        );
      });

      const plantsToWaterToday = plants.filter(plant => {
          const nextWaterDate = getNextWateringDate(plant);
          return nextWaterDate &&
            nextWaterDate.getFullYear() === selectedDate.getFullYear() &&
            nextWaterDate.getMonth() === selectedDate.getMonth() &&
            nextWaterDate.getDate() === selectedDate.getDate();
        });

      let wateringMessage = '';
      if (wateredPlants.length > 0) {
        wateringMessage = `물을 준 날! (${wateredPlants.map(p => p.nickname).join(', ')})`;
      }
      if (plantsToWaterToday.length > 0) {
        wateringMessage += ` <span class="need-water">물을 줘야 하는 날! (${plantsToWaterToday.map(p => p.nickname).join(', ')})</span>`;
      }
      
      // 날짜와 물주기 메시지를 함께 출력
    logDateElement.innerHTML = `<strong>${monthDayText}</strong> <span class="watering-message">${wateringMessage}</span>`;

      plantLogsElement.innerHTML = '';
      const logs = plantLogsData[logKey] || [];
      if (logs.length === 0) {
        plantLogsElement.innerHTML = '<p>기록이 없습니다.</p>';
        return;
      }
      logs.forEach(log => {
        const entry = document.createElement('div');
        entry.classList.add('log-entry');
        entry.innerHTML = `<p>${log.plant}</p><span>${log.task}</span>`;
        plantLogsElement.appendChild(entry);
      });
    }

    addLogBtn.addEventListener('click', () => {
      const plantNameInput = document.getElementById('plant-name-input');
      const taskInput = document.getElementById('task-input');
      const plantName = plantNameInput.value.trim();
      const task = taskInput.value.trim();
      if (!plantName || !task) {
        alert('모든 입력칸을 채워주세요');
        return;
      }
      const logKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
      if (!plantLogsData[logKey]) plantLogsData[logKey] = [];
      plantLogsData[logKey].push({ plant: plantName, task: task });
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

  document.addEventListener('DOMContentLoaded', async () => {
      plants = await loadPlantsData();
      renderCalendar();
      renderPlantLogs();
    });
