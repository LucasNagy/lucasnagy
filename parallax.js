const container = document.querySelector(".lucas-container");

window.addEventListener("scroll", () => {
    const distance = window.scrollY;
    container.style.transform = `translateY(${distance*0.4}px)`;
});