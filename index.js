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
        Notification.requestPermission().then(permission => {
            if(permission === "granted"){
                const notify = new Notification("Kidney App",
                    {
                        body: "Don't forget to drink water and stay hydrated!",
                        icon: "logo.png",
                        requireInteraction: true
                    }
                )
                notify.onclick = () => {
                    window.focus();
                    notify.close();
                }
            }
        })
    } else {
        console.log("Switch is OFF")
    }
});