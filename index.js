const head = document.querySelector('header');

window.addEventListener('scroll', () => {
    if(window.scrollY > 60) {
        head.classList.add('scrolled');
    } else {
        head.classList.remove('scrolled');
    }
});

const toggle = document.getElementById('toggle');

toggle.addEventListener('change', () => {
    if(toggle.checked) {
        console.log("Switch is ON")
    } else {
        console.log("Switch is OFF")
    }
});