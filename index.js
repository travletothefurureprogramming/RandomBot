require("dotenv").config();

const { App } = require("@slack/bolt");

const fs = require("fs");

if (!fs.existsSync("people.json")) {
    fs.writeFileSync("people.json", "[]")
}

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/randombot-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
        `Available Commands:
        /randombot-add [name] - It adds a new person to the list
        /randombot-help - Return supported commands
        `
  });
});

app.command("/randombot-add", async ({ command, ack, respond }) => {
  await ack();

  const people = JSON.parse(fs.readFileSync("people.json"));

  people.push(command.text);

  fs.writeFileSync("people.json", JSON.stringify(people, null, 2));

  await respond(`Added ${command.text} to the list!`);
});


app.command("/randombot-list", async ({ command, ack, respond }) => {
  await ack();

  const people = JSON.parse(fs.readFileSync("people.json"));

  await respond(`The folowing people is on the list: ${people}`);
});

app.command("/randombot-pick", async ({ ack, respond }) => {
  await ack();

  const people = JSON.parse(fs.readFileSync("people.json"));

  if (people.length === 0) {
    await respond("The list is empty!");
    return;
  }

  const randomPerson = people[Math.floor(Math.random() * people.length)];

  await respond(`I picked: ${randomPerson}`);
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();