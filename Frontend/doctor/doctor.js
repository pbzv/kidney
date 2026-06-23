const toast = document.getElementById("toast");
let toastTimer;

function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("show");
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function flashButton(button, cls, text) {
    const original = button.querySelector("span").textContent;

    button.classList.add(cls);
    button.querySelector("span").textContent = text;

    setTimeout(() => {
        button.classList.remove(cls);
        button.querySelector("span").textContent = original;
    }, 1600);
}



function hasFilledField(form) {
    const fields = form.querySelectorAll("input, textarea");
    return Array.from(fields).some(f => f.value.trim() !== "");
}

function handleCardSubmit(formId, emptyMessage, successMessage) {
    const form = document.getElementById(formId);
    if(!form){
        return;
    };

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!hasFilledField(form)) {
            showToast(emptyMessage);
            return;
        }

        // Collect form data
        let data = new FormData(form);
        data = Object.fromEntries(data.entries());
        
        const button = form.querySelector(".send-btn");
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {controller.abort()}, 2000);

        fetch("http://127.0.0.1:5000/report", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            signal: controller.signal
        })
        .then(response => {
            if(!response.ok){
                throw new Error(`HTTP ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if(data.received){
                flashButton(button, "sent", "تم الإرسال ✓");
                showToast(successMessage);
            }
            else{
                flashButton(button, "err", "فشل الإرسال ✗");
                showToast("عطل: لم نتمكن من استكمال الطلب");
            }
        })
        .catch(err => {
            if (err.name === "AbortError") {
                showToast("انتهت مهلة الاتصال");
            }
            else{
                showToast("فشل الاتصال بالخادم");
            }
            flashButton(button, "err", "فشل الإرسال ✗");
        })
        .finally(() => {
            clearTimeout(timeoutId);
        });
    });
}

handleCardSubmit(
    "liquidCard",
    "حدد كمية السوائل أولاً",
    "تم إرسال كمية السوائل المطلوبة"
);

handleCardSubmit(
    "appointmentCard",
    "حدد تاريخ أو وقت الموعد أولاً",
    "تم إرسال موعد الجلسة القادمة"
);

handleCardSubmit(
    "prescriptionCard",
    "اكتب اسم الدواء أو الجرعة أولاً",
    "تم إرسال الوصفة الطبية"
);

handleCardSubmit(
    "notesCard",
    "اكتب الملاحظات أولاً",
    "تم إرسال ملاحظات الطبيب"
);