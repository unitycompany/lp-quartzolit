document.addEventListener('DOMContentLoaded', function () {
    const categoryContainer = document.querySelector('.category');
    const footer = document.querySelector('footer');

    function scrollToSection(targetId) {
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            console.log(`📌 Scroll inicial para: ${targetId}`);

            // Primeira tentativa de rolagem
            window.scrollTo({
                top: targetSection.offsetTop - 20,
                behavior: 'smooth'
            });

            // Segunda tentativa, após um pequeno atraso, para corrigir possíveis mudanças de altura
            setTimeout(() => {
                console.log(`🔄 Ajuste final do scroll para: ${targetId}`);
                window.scrollTo({
                    top: targetSection.offsetTop - 20,
                    behavior: 'smooth'
                });
            }, 300); // Pequeno delay para corrigir possíveis mudanças na altura
        } else {
            console.warn(`⚠ Seção não encontrada: ${targetId}`);
        }
    }

    function handleCategoryClick(event) {
        console.log('➡ Clique detectado:', event.target);
        let item = event.target.closest('.category-item');

        if (item) {
            console.log('✅ Categoria clicada:', item);

            // Remover a classe 'active' de todas as categorias e adicionar na clicada
            document.querySelectorAll('.category-item').forEach(el => el.classList.remove('active'));
            item.classList.add('active');

            const targetId = item.getAttribute('data-target');
            if (targetId) {
                // Atualizar a URL sem recarregar a página
                history.pushState(null, null, `#${targetId}`);
                scrollToSection(targetId);
            }
        } else {
            console.warn('⚠ Clique detectado, mas não encontrou `.category-item`');
        }
    }

    if (categoryContainer) {
        categoryContainer.addEventListener('click', handleCategoryClick);
        categoryContainer.addEventListener('touchstart', handleCategoryClick, { passive: true });
    }

    // Aplicar essa mesma correção para QUALQUER botão que direcione para uma seção
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            history.pushState(null, null, `#${targetId}`);
            scrollToSection(targetId);
        });
    });

    // Intersection Observer para ativar a categoria quando a seção estiver visível
    const sections = document.querySelectorAll('section');
    const categoryItems = document.querySelectorAll('.category-item');
    const observerOptions = { threshold: 0.3 };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
                categoryItems.forEach(item => item.classList.remove('active'));
                const sectionId = entry.target.id;
                const targetCategory = document.querySelector(`.category-item[data-target="${sectionId}"]`);
                if (targetCategory) {
                    targetCategory.classList.add('active');
                    history.replaceState(null, null, `#${sectionId}`);
                }
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));

    // Remover o hash da URL ao entrar no footer
    if (footer) {
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('🛑 Entrou no footer, removendo # da URL');
                    history.replaceState(null, null, window.location.pathname);
                }
            });
        }, { threshold: 0.5 });

        footerObserver.observe(footer);
    }
});
