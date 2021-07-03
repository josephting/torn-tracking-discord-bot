# torn-tracking-discord-bot

## Configuring bot

1. Copy `.env.sample` to `.env` and edit the content to use your credentials

    i. [`BOT_TOKEN`](https://discord.com/developers/applications)

    ii. `OWNER_ID` is your own user ID on discord

2. Run `npm install` to install dependencies

3. Run `npm start` to start the bot

## Configuring tracker

1. Add [API Key](https://www.torn.com/preferences.php#tab=api) by doing `!apikey <apikey>`

## Bot commands

### 1. `!apikey`

Set api key that will be used to retrieve data from Torn.

### 2. `!delay`

Set delay in seconds of which will be the timer before next API call will be made. Default is 3 seconds.

Bot will only request update every 3 seconds by default.

Do note that this is regardless of how many data points you have added to be tracked.

### 3. `!track`

#### i. Add new tracked data

`!track <uid> <personalstats_item>`

Eg. `!track 1 rehabs` will send a notification whenever Ched rehabs.

#### ii. List currently tracked data

`!track list`

This will list the data being tracked and be alerted whenever there is a change.

### 4. `!untrack`

#### i. Remove tracked data

`!untrack <uid> <personalstats_item>`

Eg. `!untrack 1 rehabs` will stop sending notification whenever Ched rehabs.

If there is no more tracks that's for uid 1, no more API calls will be made to fetch personal stats of Ched.

#### ii. Clear all tracks

`!untrack all`

This will clear all the items currently being tracked.
