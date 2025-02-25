
  document.addEventListener('DOMContentLoaded', function() {
    const categoryItems = document.querySelectorAll('.category-item');
    const sections = document.querySelectorAll('section');
    const categoryContainer = document.querySelector('.category');

    // Função para tratar cliques nos itens de categoria
    categoryItems.forEach(item => {
      item.addEventListener('click', function() {
        categoryItems.forEach(el => el.classList.remove('active'));
        this.classList.add('active');

        const targetId = this.getAttribute('data-target');
        if (targetId) {
          const targetSection = document.getElementById(targetId);
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });

    // Intersection Observer: ativa a categoria quando 60% da seção estiver visível
    const observerOptions = { threshold: 0.6 };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          categoryItems.forEach(item => item.classList.remove('active'));
          const sectionId = entry.target.id;
          const targetCategory = document.querySelector(`.category-item[data-target="${sectionId}"]`);
          if (targetCategory) {
            targetCategory.classList.add('active');
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));

    // Ajuste de opacidade durante o scroll, somente se o container já estiver sticky
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (categoryContainer.getBoundingClientRect().top <= 0) {
        categoryContainer.style.opacity = 0.05;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          categoryContainer.style.opacity = 1;
        }, 1000); // 3000ms = 3 segundos
      } else {
        categoryContainer.style.opacity = 1;
      }
    });
  });
