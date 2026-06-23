import { Liquid_ReminderApp } from "./modules/notify_app.js";

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