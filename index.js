let name;

process.stdout.write("What's your name? ");
process.stdin.on("data", data => {
	name = data.toString().trim();
	process.stdout.write("Nice to meet you, %s!", name);
});