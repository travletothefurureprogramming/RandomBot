# RandomBot

A lightweight Slack bot for managing a team list and picking people at random. Built with Node.js, `@slack/bolt`, and Socket Mode. Uses a local JSON file for data persistence.

## Features

- Add / remove people from the list
- Pick a random person
- View current list members
- Persistent storage across restarts

## Quick Start

Invite the bot to any channel:

```text
/invite @RandomBot
```

## Commands

* /randombot-add [name] - Add someone to the list
* /randombot-pick - Pick a random person
* /randombot-list - Show current list
* /randombot-clear - Clear the list
* /randombot-help - Show available commands


## License

MIT
