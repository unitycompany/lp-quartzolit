document.addEventListener('DOMContentLoaded', function () {
    const categoryContainer = document.querySelector('.category');

    if (categoryContainer) {
        function handleCategoryClick(event) {
            let item = event.target.closest('.category-item');

            if (item) {
                document.querySelectorAll('.category-item').forEach(el => el.classList.remove('active'));
                item.classList.add('active');

                const targetId = item.getAttribute('data-target');
                if (targetId) {
                    const targetSection = document.getElementById(targetId);
                    if (targetSection) {
                        setTimeout(() => {
                            window.scrollTo({
                                top: targetSection.offsetTop - 20, // Ajuste para compensar header sticky
                                behavior: 'smooth'
                            });
                        }, 100);
                    }
                }
            }
        }

        categoryContainer.addEventListener('click', handleCategoryClick);
        categoryContainer.addEventListener('touchstart', handleCategoryClick);
    }

    // Intersection Observer para ativar a categoria quando a seção estiver visível
    const sections = document.querySelectorAll('section');
    const categoryItems = document.querySelectorAll('.category-item');
    const observerOptions = { threshold: 0.3 }; // Ajustado para funcionar melhor no mobile

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
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

    // Verificar compatibilidade de scroll no iOS e fallback
    function isSmoothScrollSupported() {
        let isSupported = false;
        try {
            document.createElement("div").scrollIntoView({ behavior: "smooth" });
            isSupported = true;
        } catch (err) {
            isSupported = false;
        }
        return isSupported;
    }

    if (!isSmoothScrollSupported()) {
        console.warn("Smooth Scroll não suportado, ativando fallback");
        categoryContainer.addEventListener('click', function (event) {
            let item = event.target.closest('.category-item');
            if (item) {
                const targetId = item.getAttribute('data-target');
                if (targetId) {
                    const targetSection = document.getElementById(targetId);
                    if (targetSection) {
                        window.scrollTo({
                            top: targetSection.offsetTop - 20,
                            behavior: 'auto'
                        });
                    }
                }
            }
        });
    }
});
