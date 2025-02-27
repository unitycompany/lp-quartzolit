var swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    breakpoints: {
        768: { slidesPerView: 2 }
    }
});

// Vinculando botões personalizados ao Swiper
document.getElementById("prevSlide").addEventListener("click", function () {
    swiper.slidePrev();
});

document.getElementById("nextSlide").addEventListener("click", function () {
    swiper.slideNext();
});


// Selecionando os elementos
const openSearch = document.getElementById("openSearch");
const searchModal = document.getElementById("searchModal");
const closeSearch = document.getElementById("closeSearch");

// Evento para abrir o modal
openSearch.addEventListener("click", () => {
    searchModal.classList.add("show");
});

// Evento para fechar o modal
closeSearch.addEventListener("click", () => {
    searchModal.classList.remove("show");
});

// Fechar modal ao clicar fora da caixa de busca
searchModal.addEventListener("click", (e) => {
    if (e.target === searchModal) {
        searchModal.classList.remove("show");
    }
});