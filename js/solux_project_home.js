//supabase 관련 JS
const supabaseUrl = 'https://iiskzhqeshvyjkyvsvhz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlpc2t6aHFlc2h2eWpreXZzdmh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NDU0MDQsImV4cCI6MjA2OTUyMTQwNH0.IuPIflTHUWDkR7bSwqP_A5WrUhuasXqbCdlyTzJtcL4'
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey)

async function loadImagesFromTable() {
  const slider = document.querySelector('.slider');
  if (!slider) return;

  // 'your_table_name'은 실제 테이블명으로 바꾸세요.
  // 'image_url'은 URL이 저장된 컬럼명입니다.
  const { data, error } = await supabaseClient
    .from('table_addplants')
    .select('id, image_url');

  if (error) {
    console.error('이미지 URL 가져오기 실패:', error);
    return;
  }

  if (!data || data.length === 0) {
    slider.innerHTML = '<p>표시할 이미지가 없습니다.</p>';
    return;
  }

  slider.innerHTML = ''; // 기존 이미지 지우기

  data.forEach((item, idx) => {
    if (item.image_url) {
      const img = document.createElement('img');
      img.src = item.image_url;
      img.className = 'slide';
      img.alt = `식물${idx + 1}`;
      img.dataset.id = item.id;  // <--- 여기 id 속성 추가
      slider.appendChild(img);
    }
  });
  
    const imgCount = slider.children.length;
    slider.style.setProperty('--img-count', imgCount);

  // 이미지가 삽입되었으면 슬라이더 초기화 함수 호출 (필요시)
  updateSlides();
}

// DOMContentLoaded 이벤트에 연결하거나 적절한 시점에서 호출
document.addEventListener('DOMContentLoaded', () => {
  loadImagesFromTable();
});


// 슬라이드 관련 JS (홈 전용)
const slider = document.querySelector('.slider');
const slides = slider ? slider.children : [];
let slideCount = slides.length;

let visibleCount = 3;

function updateSlides() {
    if (!slider) return;
    const allSlides = slider.querySelectorAll('.slide');
    const total = allSlides.length;

    // 1) 모든 슬라이드 기본 클래스 초기화
    allSlides.forEach((slide) => {
        slide.className = 'slide';  // 기존 클래스 초기화
        slide.style.cursor = 'default'; // 기본 커서 설정
        slide.onclick = null; // 클릭 이벤트 초기화
    });

    // 2) visible, center 등 클래스 지정
    if (total >= 3) {
        allSlides[0].classList.add('visible');
        allSlides[1].classList.add('center', 'visible');
        allSlides[2].classList.add('visible');
    } else if (total === 2) {
        allSlides[0].classList.add('center', 'visible');
        allSlides[1].classList.add('visible');
    } else if (total === 1) {
        allSlides[0].classList.add('center', 'visible');
    }

    // 3) 가운데(center) 슬라이드에만 클릭 이벤트/커서 적용 (여기서 추가!)
    allSlides.forEach((slide) => {
      slide.classList.remove('clickable');
      slide.onclick = null;  // 클릭 이벤트 초기화

      if (slide.classList.contains('center')) {
        slide.classList.add('clickable');
        slide.style.cursor = 'pointer';

        // 이미지에 data-id 속성에 plant id가 있다고 가정
        const plantId = slide.dataset.id;

        slide.onclick = () => {
          if (plantId) {
            window.location.href = `../html/solux_project_plants2.html?id=${plantId}`;
          } else {
            console.warn('식물 ID가 없어 상세 페이지로 이동할 수 없습니다.');
          }
        };
      }
    });
  };

function moveSlide(step) {
  if (!slider || slider.classList.contains('animating')) return;
  // 중요: 자식 노드 2개 이상 확인, 없으면 실행 중단
  if (!slider.firstElementChild || !slider.lastElementChild) return;

  const direction = step === 1 ? 1 : -1;
  slider.classList.add('animating');

  const slidesArr = Array.from(slider.children);

  slidesArr.forEach(slide => {
    const isCenter = slide.classList.contains('center');
    const scale = isCenter ? 1.15 : 0.85;

    slide.style.transition =
      'transform 0.5s cubic-bezier(.77,0,.18,1), opacity 0.3s';
    slide.style.transform = `translateX(${-direction * 100}%) scale(${scale})`;
  });

  setTimeout(() => {
    if (direction === 1) {
      slider.appendChild(slider.firstElementChild);
    } else {
      slider.insertBefore(slider.lastElementChild, slider.firstElementChild);
    }
    slidesArr.forEach(slide => {
      slide.style.transition = '';
      slide.style.transform = '';
    });
    slider.classList.remove('animating');
    updateSlides();
  }, 400);
}

document.addEventListener('DOMContentLoaded', async () => {
  const slider = document.querySelector('.slider');
  if (!slider) return;

  await loadImagesFromTable(slider); // 이미지를 비동기로 불러와 삽입

  updateSlides(slider);          // 삽입된 이미지에 스타일 및 이벤트 세팅

  document.querySelector('.arrow.left')?.addEventListener('click', () =>
    moveSlide(-1),
  );
  document.querySelector('.arrow.right')?.addEventListener('click', () =>
    moveSlide(1),
  );


  document.querySelectorAll('.sidebar a').forEach(a => {
    a.dataset.originalInner = a.innerHTML;
  });
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