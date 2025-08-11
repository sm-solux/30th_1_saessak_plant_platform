//supabase 관련 JS
const supabaseUrl = 'https://iiskzhqeshvyjkyvsvhz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlpc2t6aHFlc2h2eWpreXZzdmh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NDU0MDQsImV4cCI6MjA2OTUyMTQwNH0.IuPIflTHUWDkR7bSwqP_A5WrUhuasXqbCdlyTzJtcL4'
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// DB에서 이미지 데이터 불러와 슬라이드로 생성
async function loadImagesFromTable() {
  const sliderTrack = document.querySelector('.slider-track');
  if (!sliderTrack) return;

  // 실제 테이블명과 칼럼명으로 변경하세요
  const { data, error } = await supabaseClient
    .from('table_addplants')
    .select('id, image_url');

  if (error) {
    console.error('이미지 URL 가져오기 실패:', error);
    return;
  }

  if (!data || data.length === 0) {
    sliderTrack.innerHTML = '<p>표시할 이미지가 없습니다.</p>';
    return;
  }

  sliderTrack.innerHTML = ''; // 기존 내용 초기화

  data.forEach((item, idx) => {
    if (item.image_url) {
      const slideDiv = document.createElement('div');
      slideDiv.className = 'slide';
      slideDiv.dataset.id = item.id;

      const img = document.createElement('img');
      img.src = item.image_url;
      img.alt = `식물${idx + 1}`;

      slideDiv.appendChild(img);
      sliderTrack.appendChild(slideDiv);
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const sliderTrack = document.querySelector('.slider-track');
  const sliderViewport = document.querySelector('.slider-viewport');
  const arrowLeft = document.querySelector('.arrow.left');
  const arrowRight = document.querySelector('.arrow.right');

  if (!sliderTrack || !sliderViewport) return;

  // 1. 이미지 데이터 불러오기
  await loadImagesFromTable();

  // 2. 슬라이드 요소 갱신 및 변수 초기화
  const slides = Array.from(sliderTrack.children);
  const total = slides.length;
  if (total === 0) return;

  let currentIndex = 1;

  // 슬라이드 폭, 슬라이드 간 간격(gap)을 계산
  const slideWidth = slides[0].offsetWidth;
  const gap = parseInt(getComputedStyle(sliderTrack).gap) || 0;
  const slideStep = slideWidth + gap;

  // 슬라이드 상태 및 위치 업데이트 함수
  function updateSlides() {
    // 모든 슬라이드 초기화
    slides.forEach(slide => {
      slide.className = 'slide';
      slide.style.cursor = 'default';
      slide.onclick = null;
      slide.style.opacity = '0.4';
      slide.style.transform = 'scale(0.85)';
      slide.style.pointerEvents = 'none';
      slide.style.zIndex = '1';
      slide.style.border = '3px solid black'; 
    });

    // 현재 인덱스를 기준으로 좌우 한 장씩 총 3장 표시
    for (let i = -1; i <= 1; i++) {
      const slideIndex = (currentIndex + i + total) % total;
      const slide = slides[slideIndex];

      slide.style.opacity = '1';
      slide.style.pointerEvents = i === 0 ? 'auto' : 'none';
      slide.classList.add('visible');

      if (i === 0) {
        slide.classList.add('center');
        slide.style.transform = 'scale(1.15)';
        slide.style.cursor = 'pointer';
        slide.style.zIndex = '10';
        slide.style.borderColor = '#333';

        // 클릭 시 상세 페이지 이동
        const plantId = slide.dataset.id;
        slide.onclick = () => {
          if (plantId) {
            window.location.href = `../html/solux_project_detail.html?id=${plantId}`;
          } else {
            console.warn('식물 ID가 없어 상세 페이지로 이동할 수 없습니다.');
          }
        };
      } else {
        slide.classList.remove('center');
      }
    }

    // 슬라이더 트랙 위치를 조정 - 가운데 슬라이드가 뷰포트 중앙에 위치
    const containerWidth = sliderViewport.offsetWidth;
    const offsetCenter = slideStep * currentIndex;
    const centerPos = (containerWidth / 2) - (slideStep / 2);

    const translateX = centerPos - offsetCenter;
    sliderTrack.style.transform = `translateX(${translateX}px)`;
  }

  // 좌우 화살표 클릭 이벤트
  arrowLeft.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + total) % total;
    updateSlides();
  });

  arrowRight.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % total;
    updateSlides();
  });

  // 초기 슬라이드 셋업
  updateSlides();
});

// 사이드바 클릭 시 active 토글 및 이미지 교체 (홈 내에서만 유효)
function handleSidebarClick(clickedAnchor, section, newImageSrc) {
  document.querySelectorAll('.sidebar a').forEach(a => {
    if (a.dataset.originalInner) {
      a.innerHTML = a.dataset.originalInner;
    }
    a.classList.remove('active');
  });

  clickedAnchor.innerHTML = `<img src="${newImageSrc}" alt="${section}" class="menu-icon-selected" /> ${section.charAt(0).toUpperCase() + section.slice(1)}`;
  clickedAnchor.classList.add('active');
}