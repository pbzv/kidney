import { handleScroll, Liquid_ReminderApp } from "./modules/notify_app.js";

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
        App.SwitchInput.checked = true;
        App.showToast('هل تريد إلغاء تفعيل التذكير؟');
    }
});

App.RejectBtn.addEventListener('click', () => {
    App.showSwitch();
});

App.SubmitBtn.addEventListener('click', () => {
    if (!App.WakeupTime.value || !App.Bedtime.value) {
        App.Error_msg.textContent = "رجاءً قم بتحديد وقت الاستيقاظ والنوم";
        App.Error_msg.style.display = "block";
        return;
    }

    App.Error_msg.textContent = "";
    App.Error_msg.style.display = "none";

    localStorage.setItem("Wakeup", App.WakeupTime.value);
    localStorage.setItem("Bedtime", App.Bedtime.value);

    App.obtainPermission().then(permission => {
        if (permission === 'granted') {
            App.Notify();
        }
        App.SwitchInput.checked = true;
        App.showSwitch();
    });
});