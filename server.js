const express = require('express');
const path = require('path');
const { readFileSync, writeFileSync, writeFile } = require('fs');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

/* =========================
   MIDDLEWARES
========================= */

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(`${req.socket.remoteAddress} -> ${req.method} ${req.url}`);
    next();
});

/* =========================
   UTIL FUNCTIONS
========================= */

function render(template, data) {
    return template.replace(
        /\{\{(\w+)\}\}/g,
        (_, key) => data[key] || ""
    );
}

/* =========================
   PAGES
========================= */

app.get('/', (req, res) => {
    const userId = req.cookies.userId;
    const db = JSON.parse(readFileSync("users.json", 'utf-8'));

    if (userId && db[userId]) {
        let htmlPage = readFileSync(
            path.join(__dirname, "Frontend", "main", "main.html"),
            'utf-8'
        );

        htmlPage = render(htmlPage, {
            user: db[userId].user,
            appointment: db[userId].info.appointment,
            date: db[userId].info.date,
            medicine: db[userId].info.medicine,
            dosage: db[userId].info.dosage,
            notes: db[userId].info.notes
        });

        return res.send(htmlPage);
    }

    res.sendFile(
        path.join(__dirname, 'Frontend', 'landing', 'index.html')
    );
});

app.get('/api/liquid', (req, res) => {
    const userId = req.cookies.userId;
    const db = JSON.parse(readFileSync("users.json", 'utf-8'));
    return res.json({
        maxDrinkAmount: db[userId].info.liquidAmount
    });
});

app.get('/login', (req, res) => {
    res.sendFile(
        path.join(__dirname, 'Frontend', 'login', 'login.html')
    );
});

/* =========================
   STATIC FILES
========================= */

app.get(/^\/([a-zA-Z0-9_-]+)(\.(css|js))?$/, (req, res) => {
    const name = req.params[0];
    const extension = req.params[2] || 'html';

    const filePath = path.join(
        __dirname,
        "Frontend",
        name,
        `${name}.${extension}`
    );

    res.sendFile(filePath, err => {
        if (err) {
            res.sendStatus(404);
        }
    });
});

app.use('/modules', express.static(
    path.join(__dirname, 'Frontend', 'main', 'modules')
));

app.use('/icons', express.static(
    path.join(__dirname, 'Frontend', 'icons')
));

app.use('/zain-font', express.static(
    path.join(__dirname, 'Frontend', 'zain-font')
));


/* =========================
   API ROUTES
========================= */

app.post('/login', (req, res) => {
    const {input} = req.body;

    if (!input) {
        return res.status(400).json({
            success: false,
            message: 'Bad Request'
        });
    }

    const db = JSON.parse(readFileSync(path.join(__dirname, "users.json"), 'utf-8'));
    const user = db[input];

    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid login'
        });
    }

    res.cookie("userId", input, {
        httpOnly: true,
        sameSite: "strict",
    });

    return res.json({
        success: true,
        redirect: '/'
    });
});

app.post('/logout', (req, res) => {
    res.clearCookie("userId", {
        httpOnly: true,
        sameSite: "strict",
    });

    return res.json({
        success: true,
        redirect: "/"
    });
})

app.post('/report', (req, res) => {
    const report = req.body;
    console.log(report);
    if (!report) {
        return res.status(400).json({
            success: false,
            message: "invalid input"
        });
    }

    const db = JSON.parse(readFileSync(path.join(__dirname, "users.json"), 'utf-8'));
    let keys = Object.keys(report);
    console.log(keys);
    keys.forEach(k => db["01234"].info[k] = report[k]);

    writeFileSync(
        path.join(__dirname, "users.json"),
        JSON.stringify(db, null, 4)
    );
    console.log("The value was saved");
    return res.json({
        received: true
    });
});

/* =========================
   SERVER START
========================= */

const IP = '0.0.0.0';
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server listening on http://${IP}:${PORT}`);
});