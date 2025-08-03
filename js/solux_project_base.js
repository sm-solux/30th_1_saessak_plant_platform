document.addEventListener('DOMContentLoaded', function () {
  const links = document.querySelectorAll('.sidebar ul li a');
  const currentPage = window.location.pathname.split('/').pop(); // 파일명만 추출

  links.forEach(link => {
    const href = link.getAttribute('href');
    const icon = link.querySelector('.menu-icon');

    const shouldActivate =
      href === currentPage ||
      (currentPage === '../html/solux_project_addPlant.html' && href === '../html/solux_project_plants.html');

    // 현재 페이지면 active
    if (href === currentPage) {
      link.classList.add('active');
      const activeIcon = icon?.getAttribute('data-active-src');
      if (activeIcon) icon.src = activeIcon;
    } else {
      const original = icon?.getAttribute('data-src');
      if (original) icon.src = original;
    }
  });
});


