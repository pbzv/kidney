const Client = document.getElementById("client");

function distance(p1, p2){
    return Math.sqrt(
        Math.pow(p2.x - p1.x, 2) +
        Math.pow(p2.y - p1.y, 2)
    );
}

let last_coords = {x: 0, y: 0};
let last_time = Date.now();

document.addEventListener("mousemove", e => {
    let current_coords = {
        x: e.clientX,
        y: e.clientY
    };

    let current_time = Date.now();

    let d = distance(last_coords, current_coords);
    let t = current_time - last_time;

    if (t === 0) return;

    let V = d / (t / 1000); // px per second

    Client.textContent = `Speed: ${V.toFixed(2)} px/s`;

    last_coords = current_coords;
    last_time = current_time;
});