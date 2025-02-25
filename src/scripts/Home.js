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
