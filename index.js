const head = document.querySelector('header');

window.addEventListener('scroll', () => {
    if(window.scrollY > 60) {
        head.classList.add('scrolled');
    }
    else {
        head.classList.remove('scrolled');
    }
});