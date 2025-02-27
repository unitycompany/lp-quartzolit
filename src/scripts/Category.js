document.addEventListener('DOMContentLoaded', function () {
  const categoryContainer = document.querySelector('.category');

  // Verifica se o container existe antes de adicionar o evento
  if (categoryContainer) {
      categoryContainer.addEventListener('click', function (event) {
          let item = event.target.closest('.category-item'); // Encontra o item mais próximo

          if (item) {
              document.querySelectorAll('.category-item').forEach(el => el.classList.remove('active'));
              item.classList.add('active');

              const targetId = item.getAttribute('data-target');
              if (targetId) {
                  const targetSection = document.getElementById(targetId);
                  if (targetSection) {
                      targetSection.scrollIntoView({ behavior: 'smooth' });
                  }
              }
          }
      });
  }

  // Intersection Observer: ativa a categoria quando 60% da seção estiver visível
  const sections = document.querySelectorAll('section');
  const categoryItems = document.querySelectorAll('.category-item');
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
});
