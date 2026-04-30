process.stdout.write("What's your name? ");
process.stdin.on("data", (d) => {
    process.stdout.write("صباح الكيك على عينيك");
    console.log(d.toString().trim());
    process.exit(0);
});