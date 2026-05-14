const Header = document.querySelector('header');
const Toggle = document.querySelector('#toggle');
const SwitchLabel = document.querySelector('.switch');
const Alert_note = document.querySelector('.alert');
const Settings = document.querySelector('.reminder-settings');
const WakeupTime = document.querySelector('#wakeuptime');
const Bedtime = document.querySelector('#bedtime');
const SubmitBtn = document.querySelector('.submit-btn');
const RejectBtn = document.querySelector('.reject-btn');
let wakeupTimeValue, bedtimeValue;
localStorage.setItem("notification-reminder", "disabled");


if(localStorage.getItem("notification-reminder") === "enabled"){
    SwitchLabel.querySelector("input").checked = true;
}
else{
    SwitchLabel.querySelector("input").checked = false;
}

// Header scroll effect
function handleScroll() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            Header.classList.add('scrolled');
        } else {
            Header.classList.remove('scrolled');
        }
    });
};

// Fade in settings
function showSettings() {
    SwitchLabel.classList.remove('visible');
    Alert_note.classList.remove('visible');

    setTimeout(() => {
        Settings.style.display = 'flex';
        requestAnimationFrame(() => {
            Settings.classList.add('visible');
        });
    }, 400);
}

function showSwitch() {
    Settings.classList.remove('visible');

    setTimeout(() => {
        Settings.style.display = 'none';
        SwitchLabel.classList.add('visible');
        Alert_note.classList.add('visible');
        SwitchLabel.querySelector('input').checked = false;
    }, 400);
}

// Obtain permission and send notification
function sendNotification() {
    Notification.requestPermission()
    .then(permission => {
        if (permission === 'granted') {
            const notify = new Notification("رفيق الكلى", {
                body: "تذكير: حان وقت شرب الماء! حافظ على ترطيب جسمك.",
                icon: "logo.png",
                requireInteraction: true
            });
            notify.onclick = () => {
                window.focus();
                notify.close();
            };
        } 
        else {
            alert('لم يتم تفعيل الإشعارات. يرجى السماح بالإشعارات لتلقي التنبيهات.');
        }
    });
}

// on page load — show switch, hide settings
showSwitch();

SwitchLabel.querySelector("input").addEventListener('change', () => {
    if (SwitchLabel.querySelector("input").checked) {
        showSettings();
    }
});

RejectBtn.addEventListener('click', () => {
    showSwitch();
});

SubmitBtn.addEventListener('click', () => {
    if (!WakeupTime.value || !Bedtime.value) {
        alert('رجاءً قم بتحديد وقت الاستيقاظ ووقت النوم');
        return;
    }
    wakeupTimeValue = WakeupTime.value;
    bedtimeValue = Bedtime.value;
    showSwitch();
    SwitchLabel.querySelector("input").checked = true;
    localStorage.setItem("notification-reminder", "enabled");
    sendNotification();
});