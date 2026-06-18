const express = require('express');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.socket.remoteAddress} -> ${req.method} ${req.url}`);
    next();
});

// Serve all static files automatically
app.use('/', express.static(
    path.join(__dirname, 'Frontend', 'landing page')
));
app.use('/icons', express.static(
    path.join(__dirname, 'Frontend', 'icons')
));
app.use('/zain-font', express.static(
    path.join(__dirname, 'Frontend', 'zain-font')
));
app.use('/login', express.static(
    path.join(__dirname, 'Frontend', 'login')
));
app.use('/user', express.static(
    path.join(__dirname, 'Frontend', 'main page')
));



// Pages
app.get('/', (req, res) => {
    res.sendFile(
        path.join(__dirname, 'Frontend', 'landing page', 'index.html')
    );
});

app.get('/login', (req, res) => {
    res.sendFile(
        path.join(__dirname, 'Frontend', 'login', 'login.html')
    );
});

app.get('/user', (req, res) => {
    res.sendFile(
        path.join(__dirname, 'Frontend', 'main page', 'main.html')
    );
});

// Login API
app.post('/login', (req, res) => {
    const { input } = req.body;

    if (!input) {
        return res.status(400).json({
            success: false,
            message: 'Input is required'
        });
    }

    if (input === 'admin') {
        return res.json({
            success: true,
            redirect: '/user'
        });
    }

    res.status(401).json({
        success: false,
        message: 'Invalid login'
    });
});


let IP = '0.0.0.0';
const PORT = 80;

app.listen(PORT, () => {
    console.log(`Server listening on http://${IP}:${PORT}`);
});
