class Liquid_ReminderApp {
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
        this.Alert_note.style.display = 'none';
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
            this.Alert_note.style.display = 'block';
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

    disable_notifications() {
        localStorage.removeItem("notification-reminder");
        localStorage.removeItem("Wakeup");
        localStorage.removeItem("Bedtime");
        this.SwitchInput.checked = false;
        this.showSwitch();
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
            document.querySelector('#Head')
        ];
        blurTargets.forEach(el => el.style.filter = 'blur(2px)');

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
}

const MenuToggle = document.querySelector("#menu-toggle");
const MenuIcon = document.querySelector(".menu-icon svg");
const NavMenu = document.querySelector(".nav-menu");

MenuToggle.addEventListener("change", () => {
    if(MenuToggle.checked){
        MenuIcon.classList.add("svg-checked");
        NavMenu.classList.add("nav-menu-checked");
        
        document.addEventListener("click", (e) => {
            if(MenuToggle.checked && !MenuIcon.contains(e.target) && !NavMenu.contains(e.target)){
                MenuIcon.classList.remove("svg-checked");
                NavMenu.classList.remove("nav-menu-checked");
            }
        });
    }
    else{
        MenuIcon.classList.remove("svg-checked");
        NavMenu.classList.remove("nav-menu-checked");
    }
});

const logoutBtn = document.getElementById("logout");
logoutBtn.onclick = function(){
    fetch("/logout", {
        method: "POST",
        credentials: "include"
    }).then(() => {
        localStorage.clear();
        window.location.reload();
    });
}


function getToday(){
    return new Date().toISOString().split("T")[0];
}

function saveDrink(amount) {
    const data = {
        amount: amount,
        date: getToday()
    };

    localStorage.setItem("drinkData", JSON.stringify(data));
}

function loadDrink() {
    const data = JSON.parse(localStorage.getItem("drinkData"));

    if (!data){
        return 0
    };

    if (data.date !== getToday()) {
        saveDrink(0);
        return 0;
    }

    return data.amount;
}

const drinkBtn = document.getElementById('drink_btn');
let drankAmount = loadDrink();

let maxDrinkAmount;

function circleBar(maxDrinkAmount, drankAmount) {
    const drinkPercent = document.querySelector('.drink_percentage span');
    let percentage = Math.round((drankAmount / maxDrinkAmount) * 100);
    drinkPercent.textContent = `${drankAmount}L / ${maxDrinkAmount}L`;
    document.querySelector('.percentage').textContent = `${percentage}%`;

    setTimeout(() => {
        document.documentElement.style.setProperty(
            '--percentage',
            percentage
        );
    }, 500);
}


fetch('/api/liquid')
    .then(res => res.json())
    .then(data => {
        maxDrinkAmount = data.maxDrinkAmount;
        document.documentElement.style.setProperty('--percentage', '0');
        circleBar(maxDrinkAmount, drankAmount);

        drinkBtn.onclick = () => {
            if (drankAmount < maxDrinkAmount) {
                drankAmount = Number((drankAmount + 0.2).toFixed(1));
                saveDrink(drankAmount);

            if (drankAmount > maxDrinkAmount) {
                drankAmount = maxDrinkAmount;
            }

                circleBar(maxDrinkAmount, drankAmount);
            }
        };
    })
    .catch(console.error);


const App = new Liquid_ReminderApp();

if (localStorage.getItem("notification-reminder") === "enabled") {
    App.SwitchInput.checked = true;
    App.SwitchLabel.classList.add('visible');
    App.Alert_note.classList.add('visible');
} 
else {
    localStorage.setItem("notification-reminder", "disabled");
    App.SwitchInput.checked = false;
    App.showSwitch();
}

App.SwitchInput.addEventListener("change", () => {
    if (App.SwitchInput.checked) {
        App.showSettings();
    } 
    else {
        App.SwitchInput.checked = true;
        App.showToast('هل تريد إلغاء تفعيل التذكير؟');
    }
});

App.RejectBtn.addEventListener('click', () => {
    App.showSwitch();
    App.Error_msg.textContent = "";
    App.Error_msg.style.display = "none";
    App.SwitchInput.checked = false;
});

App.SubmitBtn.addEventListener('click', () => {
    if (!App.WakeupTime.value || !App.Bedtime.value) {
        App.Error_msg.textContent = "رجاءً قم بتحديد وقت الاستيقاظ والنوم";
        App.Error_msg.style.display = "block";
        return;
    }

    App.Error_msg.textContent = "";
    App.Error_msg.style.display = "none";

    localStorage.removeItem("Reminder-Wakeuptime");
    localStorage.removeItem("Reminder-Bedtime");

    App.obtainPermission().then(permission => {
        if (permission === 'granted') {
            App.Notify();
        }
        App.SwitchInput.checked = true;
        App.showSwitch();
    });
});