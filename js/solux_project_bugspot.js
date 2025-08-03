document.addEventListener('DOMContentLoaded', () => {
    const bugSpotSection = document.getElementById('content-bugspot');
    if (bugSpotSection) {
      const items = [
        { name: '흰가루병', category: 'disease', image: '../image/bugs/흰가루병.jpeg'},
        { name: '잿빛곰팡이병', category: 'disease', image: '../image/bugs/잿빛곰팡이병.jpeg' },
        { name: '그을음병', category: 'disease' , image: '../image/bugs/그을음병.jpeg' },
        { name: '탄저병', category: 'disease', image: '../image/bugs/탄저병.jpeg' },
        { name: '녹병', category: 'disease' , image: '../image/bugs/녹병.jpeg' },
        { name: '점무늬병', category: 'disease', image: '../image/bugs/점무늬병.jpeg'},
        { name: '시들음병', category: 'disease' , image: '../image/bugs/시들음병.jpeg' },
        { name: '잎마름병', category: 'disease' , image: '../image/bugs/잎마름병.jpeg' },
        { name: '노균병', category: 'disease' , image: '../image/bugs/노균병.jpeg' },
        { name: '검은무늬병', category: 'disease' , image: '../image/bugs/검은무늬병.jpeg' },
        { name: '작은뿌리파리', category: 'bug', image: '../image/bugs/작은뿌리파리.jpeg' },
        { name: '점박이응애', category: 'bug' , image: '../image/bugs/점박이응애.jpeg'},
        { name: '목화진딧물', category: 'bug', image: '../image/bugs/목화진딧물.jpeg' },
        { name: '꽃노랑총채벌레', category: 'bug', image: '../image/bugs/꽃노랑총채벌레.jpeg' },
        { name: '귤가루깍지벌레', category: 'bug', image: '../image/bugs/귤가루깍지벌레.jpeg'},
        { name: '들민달팽이', category: 'bug', image: '../image/bugs/들민달팽이.jpeg' },
        { name: '온실가루이', category: 'bug', image: '../image/bugs/온실가루이.jpeg' },
        { name: '아메리카잎굴파리', category: 'bug', image: '../image/bugs/아메리카잎굴파리.jpeg' },
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
          const link = document.createElement('a'); // a 태그로 카드 감싸기
          link.className = 'bugspot-item';
          link.href = `solux_project_bugsDetail.html?name=${encodeURIComponent(item.name)}`;
        
          link.innerHTML = `
            <div class="bugspot-item-image" style="background-image: url('${item.image}'); background-size: cover; background-position: center;"></div>
            <p class="bugspot-item-name">${item.name}</p>
          `;
        
          grid.appendChild(link);
        });
        
  
        
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
  