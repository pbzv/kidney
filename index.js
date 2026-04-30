let name;

process.stdout.write("What's your name? ");
process.stdin.on("data", (d) => {
    console.log(d.toString().trim());
    process.exit(0);
});