document.addEventListener('DOMContentLoaded', function () {
    const categoryContainer = document.querySelector('.category');
    const footer = document.querySelector('.footer'); // Captura o footer

    if (categoryContainer) {
        function handleCategoryClick(event) {
            console.log('➡ Clique detectado:', event.target);

            let item = event.target.closest('.category-item');

            if (item) {
                console.log('✅ Categoria clicada:', item);

                // Remover a classe 'active' de todas as categorias e adicionar na clicada
                document.querySelectorAll('.category-item').forEach(el => el.classList.remove('active'));
                item.classList.add('active');

                // Obter a seção alvo
                const targetId = item.getAttribute('data-target');
                if (targetId) {
                    const targetSection = document.getElementById(targetId);
                    if (targetSection) {
                        console.log('📌 Scrolling para:', targetId);

                        // Atualizar a URL sem recarregar a página
                        history.pushState(null, null, `#${targetId}`);

                        setTimeout(() => {
                            window.scrollTo({
                                top: targetSection.offsetTop - 20, // Ajuste para compensar header sticky
                                behavior: 'smooth'
                            });
                        }, 100);
                    } else {
                        console.warn('⚠ Seção alvo não encontrada:', targetId);
                    }
                }
            } else {
                console.warn('⚠ Clique detectado, mas não encontrou `.category-item`');
            }
        }

        // Teste se os eventos estão disparando no mobile
        categoryContainer.addEventListener('click', handleCategoryClick);
        categoryContainer.addEventListener('touchstart', handleCategoryClick, { passive: true });
    }

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
                    // Atualizar URL quando a seção entrar na tela
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
                    history.replaceState(null, null, window.location.pathname); // Remove o hash
                }
            });
        }, { threshold: 0.5 }); // 50% do footer visível já remove a URL

        footerObserver.observe(footer);
    }

    // Verificar compatibilidade de scroll no iOS e aplicar fallback
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
        console.warn("⚠ Smooth Scroll não suportado, ativando fallback");
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
