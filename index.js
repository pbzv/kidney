import { handleScroll, Liquid_ReminderApp } from "./modules/notify_app.js";

const App = new Liquid_ReminderApp();
handleScroll(document.querySelector('header'));

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

// Dark mode toggle
const style = document.createElement('style');

style.textContent = `
    body {
        background: radial-gradient(circle at top, #0f2a24, #020617) scroll;
    }

    .scrolled {
        background: rgba(11, 34, 37, 0.5);
        backdrop-filter: blur(20px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    }

    .menu-icon svg {
        fill: #d4d4d4;
    }
    .nav-menu {
        background: rgb(11, 34, 37);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .nav-menu ul li a[href="#"] {
        color: #67e3a3;
    }
    .nav-menu ul li .darkmode_note {
        color: #fafafa
    }
    #logout {
        box-shadow: 0 0 12px rgba(28, 26, 26, 0.3);
    }

    #Head .main-header {
        color: #67e3a3;
    }
    #Head .main-header-caption {
        color: #fafafa;
    }

    .card {
        background: rgba(11, 34, 37);
        box-shadow: 0 0 12px rgba(0, 0, 0, 0.25);
    }

    .title {
        color: #fafafa;
    }

    .time-left, .medicine, .diagnosis {
        color: #67e3a3;
    }

    .switch input:checked + .slider {
        background: #67e3a3;
    }

    #alerts {
        border: 1.5px solid #67e3a3;
    }
    .reminder-settings label {
        color: #67e3a3;
    }
`;

const Darkmode_switch = document.querySelector(".darkmode_switch input");

function Darkmode() {
    document.head.appendChild(style);
    Darkmode_switch.checked = true;
}
function Lightmode() {
    if(style.parentNode) document.head.removeChild(style);
    Darkmode_switch.checked = false;
}


if(localStorage.getItem("darkmode_enabled") !== null){
    localStorage.getItem("darkmode_enabled") === "true" ? Darkmode() : Lightmode();
}
else{
    window.matchMedia('(prefers-color-scheme: dark)').matches ? Darkmode() : Lightmode();
}


Darkmode_switch.addEventListener("change", () => {
    Darkmode_switch.checked ? Darkmode() : Lightmode()
    localStorage.setItem("darkmode_enabled", Darkmode_switch.checked ? "true" : "false");
});


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

    localStorage.setItem("Reminder-Wakeuptime", App.WakeupTime.value);
    localStorage.setItem("Reminder-Bedtime", App.Bedtime.value);

    App.obtainPermission().then(permission => {
        if (permission === 'granted') {
            App.Notify();
        }
        App.SwitchInput.checked = true;
        App.showSwitch();
    });
});