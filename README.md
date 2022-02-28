# Discord Invite Tracker

A simple tracker that logs discord server invites to a default channel named #invite-logs

## Used Packages And Environment

 - [DiscordJs >=v13](https://discord.js.org/#/)
 - [NodeJs >=16](https://nodejs.org/en/)
 - [TypeScript >=4.5.5](https://www.npmjs.com/package/typescript)

## Configuration File

Create config.json in src/config with the following variables

```json
  {
      "ownerId": "",
      "botToken": "",
      "embedColor": 3447003,
      "defaultPrefix": ""
  }
```

## Usage

To run invite tracker for production

```bash
  npm run pm2
```

Run for development

```bash
  npm run start:dev
```

> :pencil: In order for the bot to work it requires server manager permissions, guild members intents and a default channel named #invite-logs

## License

[GPL-3.0](https://github.com/driwand/invite-tracker/blob/main/LICENSE)
