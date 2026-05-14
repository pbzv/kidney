export function handleScroll(header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

export class Liquid_ReminderApp {
    constructor() {
        this.SwitchLabel  = document.querySelector('.switch');
        this.SwitchInput  = document.querySelector('.switch input');
        this.Alert_note   = document.querySelector('.alert');
        this.Settings     = document.querySelector('.reminder-settings');
        this.WakeupTime   = document.querySelector('#wakeuptime');
        this.Bedtime      = document.querySelector('#bedtime');
        this.SubmitBtn    = document.querySelector('.submit-btn');
        this.RejectBtn    = document.querySelector('.reject-btn');
        this.Error_msg    = document.querySelector("#error_msg");
        this.wakeupTimeValue = null;
        this.bedtimeValue    = null;
    }

    showSettings() {
        this.SwitchLabel.classList.remove('visible');
        this.Alert_note.classList.remove('visible');
        setTimeout(() => {
            this.Settings.style.display = 'flex';
            requestAnimationFrame(() => {
                this.Settings.classList.add('visible');
            });
        }, 400);
    }

    showSwitch() {
        this.Settings.classList.remove('visible');
        setTimeout(() => {
            this.Settings.style.display = 'none';
            this.SwitchLabel.classList.add('visible');
            this.Alert_note.classList.add('visible');
        }, 400);
    }

    obtainPermission() {
        return Notification.requestPermission()
            .then(permission => {
                if (permission === 'granted') {
                    localStorage.setItem("notification-reminder", "enabled");
                }
                return permission;
            });
    }

    Notify() {
        const notify = new Notification("رفيق الكلى", {
            body: "تذكير: حان وقت شرب الماء! حافظ على ترطيب جسمك.",
            icon: "logo.png",
            tag: "liquid-reminder",
            requireInteraction: true
        });
        notify.onclick = () => {
            window.focus();
            notify.close();
        };
    }

    showToast(message, color = '#a81638') {
        const toast = document.createElement('div');
        const toastbtn = document.createElement('button');
        toastbtn.textContent = "تأكيد";

        toast.style.cssText = `
            width: 350px; height: 200px;
            background-color: ${color}; color: #f2e5c5;
            border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.2), 0 0 5px #d03156;
            position: fixed; top: 50%; right: 50%; transform: translate(50%, -50%); z-index: 1000;
            display: flex; flex-direction: column; align-items: center; justify-content: space-around;
            font-size: 2rem; font-family:'Amiri', sans-serif; font-style: italic; text-align: center;
            opacity: 1; transition: opacity 0.4s ease;
        `;

        toastbtn.style.cssText = `
            display: block; position: relative;
            width: 95px; height: 45px;
            background-color: #e6486c; color: #f2e5c5;
            border: none; border-radius: .25em; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            font-size: 1.2rem; font-family:'Amiri', sans-serif; font-style: italic;
            cursor: pointer; transition: transform .2s ease;
        `;

        toastbtn.addEventListener('mouseover', () => toastbtn.style.transform = 'scale(1.05)');
        toastbtn.addEventListener('mouseleave', () => toastbtn.style.transform = 'scale(1)');
        toastbtn.addEventListener('mousedown', () => toastbtn.style.transform = 'scale(0.85)');

        // ← النص في عنصر منفصل حتى لا يُمسح الزر
        const toastText = document.createElement('p');
        toastText.textContent = message;

        toast.appendChild(toastText);
        toast.appendChild(toastbtn);
        document.body.appendChild(toast);

        // Blur
        const blurTargets = [
            document.querySelector('main'),
            document.querySelector('header'),
            document.querySelector('#Head')
        ];
        blurTargets.forEach(el => el.style.filter = 'blur(5px)');

        const closeToast = () => {
            toast.style.opacity = '0';
            blurTargets.forEach(el => el.style.filter = 'none');
            setTimeout(() => toast.remove(), 400);
        };

        // إغلاق عند الضغط على الزر
        toastbtn.addEventListener('click', () => {
            this.disable_notifications();
            closeToast();
        });

        // إغلاق تلقائي بعد 5 ثوانٍ
        setTimeout(closeToast, 5000);
        }

    disable_notifications() {
        localStorage.removeItem("notification-reminder");
        localStorage.removeItem("Wakeup");
        localStorage.removeItem("Bedtime");
        this.SwitchInput.checked = false;
        this.showSwitch();
    }
}