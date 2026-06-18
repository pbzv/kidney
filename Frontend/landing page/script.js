const loginBtn = document.querySelector('#login');
loginBtn.addEventListener('click', () => {
    window.location.pathname = '/login';
});

const arrow = document.querySelector('.arrow');
arrow.addEventListener('click', () => {
    window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
    });
});