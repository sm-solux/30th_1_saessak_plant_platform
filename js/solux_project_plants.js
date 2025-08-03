const supabaseUrl = 'https://iiskzhqeshvyjkyvsvhz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlpc2t6aHFlc2h2eWpreXZzdmh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NDU0MDQsImV4cCI6MjA2OTUyMTQwNH0.IuPIflTHUWDkR7bSwqP_A5WrUhuasXqbCdlyTzJtcL4'
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

const gallery = document.getElementById('plantGallery');
const searchInput = document.getElementById('bugspot-search-input');

function renderPlantCards(plants) {
  gallery.innerHTML = '';

  // 식물이 1개 이상 있을 경우만 카드 렌더링
  if (plants && plants.length > 0) {
    plants.forEach((plant) => {
      const wrapper = document.createElement('div');
      wrapper.style.display = 'flex';
      wrapper.style.flexDirection = 'column';
      wrapper.style.alignItems = 'center';

      const cardLink = document.createElement('a');
      cardLink.classList.add('plant-card');
      cardLink.href = `../html/solux_project_detail.html?id=${plant.id}`;
      cardLink.innerHTML = `<img src="${plant.image_url}" alt="${plant.nickname}">`;

      const label = document.createElement('p');
      label.textContent = plant.nickname;
      label.style.margin = '10px 0 0 0';
      label.style.fontSize = '14px';
      label.style.textAlign = 'center';

      wrapper.appendChild(cardLink);
      wrapper.appendChild(label);
      gallery.appendChild(wrapper);
    });
  } else {
    console.log('등록된 식물이 없습니다');
  }

  // 🌱 항상 추가 카드 붙이기
  const addCard = document.createElement('div');
  addCard.classList.add('plant-card', 'add-card');
  addCard.innerHTML = `<div class="plus-button">+</div>`;
  addCard.onclick = () => {
    window.location.href = "../html/solux_project_addPlant.html";
  };
  gallery.appendChild(addCard);
}

async function loadPlantsForUser() {
  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
  if (userError || !user) {
    alert('로그인이 필요합니다');
    window.location.href = 'solux_project_login.html';
    return;
  }

  const { data: plants, error: plantsError } = await supabaseClient
    .from('table_addplants')
    .select('*')
    

  if (plantsError) {
    console.error('식물 불러오기 실패:', plantsError);
    return;
  }

  console.log('불러온 식물 목록:', plants);

  renderPlantCards(plants);
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadPlantsForUser();

  searchInput.addEventListener('input', async () => {
    const searchTerm = searchInput.value.toLowerCase().replace(/\s/g, '');

    const { data: { user } } = await supabaseClient.auth.getUser();
    const { data: allPlants } = await supabaseClient
      .from('table_addplants')
      .select('*')

    const filtered = allPlants.filter(plant =>
      plant.nickname.toLowerCase().replace(/\s/g, '').includes(searchTerm)
    );

    renderPlantCards(filtered);
  });
});
