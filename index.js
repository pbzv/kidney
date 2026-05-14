import { handleScroll, Liquid_ReminderApp } from "./functions.js";

const App = new Liquid_ReminderApp();
handleScroll(document.querySelector('header'));

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("notification-reminder") === "enabled") {
        App.SwitchInput.checked = true;
        App.SwitchLabel.classList.add('visible');
        App.Alert_note.classList.add('visible');
    } else {
        localStorage.setItem("notification-reminder", "disabled");
        App.SwitchInput.checked = false;
        App.showSwitch();
    }
});

App.SwitchInput.addEventListener("change", () => {
    if (App.SwitchInput.checked) {
        App.showSettings();
    } 
    else {
        App.disable_notifications();
        App.SwitchInput.checked = false;
    }
});

App.RejectBtn.addEventListener('click', () => {
    App.showSwitch();
});

App.SubmitBtn.addEventListener('click', () => {
    if (!App.WakeupTime.value || !App.Bedtime.value) {
        alert('رجاءً قم بتحديد وقت الاستيقاظ ووقت النوم');
        return;
    }
    localStorage.setItem("Wakeup", `${App.WakeupTime.value}`);
    localStorage.setItem("Bedtime", `${App.Bedtime.value}`);

    App.obtainPermission().then(permission => {
        if (permission === 'granted') {
            App.Notify();
        }
        App.showSwitch();
        App.SwitchInput.querySelector("input").checked = true;
    });
});