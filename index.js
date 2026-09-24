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
  const name = command.text.trim();

  const people = JSON.parse(fs.readFileSync("people.json"));
  
  if (name.length === 0) {
    await respond("The name can not be empty!");
    return;
  }

  if (people.includes(name)) {
    await respond(`The name ${name} is already in the list!`);
    return;
  }

  people.push(name);

  fs.writeFileSync("people.json", JSON.stringify(people, null, 2));

  await respond(`Added ${name} to the list!`);
});


app.command("/randombot-list", async ({ ack, respond }) => {
  await ack();

  const people = JSON.parse(fs.readFileSync("people.json"));
  
  if (people.length === 0) {
    await respond("The list is empty!");
    return;
  }

  const list = people
    .map((person, index) => `${index + 1}. ${person}`)
    .join("\n");

  await respond(`People in the list:\n\n${list}\n\nTotal: ${people.length} people`);
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

app.command("/randombot-clear", async ({ ack, respond}) => {
    await ack();

    fs.writeFileSync("people.json", "[]");

    await respond("The list has cleared succesfully!");

});

app.command("/randombot-info", async ({ ack, respond}) => {
    await ack();

    await respond(`
        RandomBot

        RandomBot is a simple Slack bot that manages a list of people and can randomly pick someone from it.

        You can add people, view the list, randomly pick a person, clear the list, and see all available commands directly from Slack.

        The bot is built with JavaScript, Node.js, Slack Bolt and Socket Mode. The list is saved locally in a JSON file so it can stay between restarts.
    `);

});



(async () => {
  await app.start();
  console.log("bot is running!");
})();