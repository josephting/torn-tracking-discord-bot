import dotenv from 'dotenv'

dotenv.config()

import discordjsCommando from 'discord.js-commando'
const {CommandoClient} = discordjsCommando
import {dirname} from 'dirname-filename-esm'
import path from 'path'
import {Low, JSONFile} from 'lowdb'
import Tracker from './helpers/tracker.js'
import * as helpers from './helpers/index.js'

const __dirname = dirname(import.meta)

const client = new CommandoClient({
    commandPrefix: '!',
    owner: process.env.OWNER_ID
})

const dbFile = path.join(__dirname, 'db.json')
const dbAdapter = new JSONFile(dbFile)
const db = new Low(dbAdapter)
client.db = db
await client.db.read()
client.db.data ||= {}
client.db.data.tornDelay ||= 3

client.helpers = helpers

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['standard', 'Standard'],
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn({
        dirname: path.join(__dirname, 'commands'),
        filter: /^([^\.].*)\.cjs$/,
    })

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}! (${client.user.id})`)
    client.tornApiKey = client.db.data.tornApiKey
    client.tornDelay = client.db.data.tornDelay
    if (!client.tornApiKey) {
        console.log('No API key registered yet. Please register with !apikey <apikey>')
    } else {
        console.log(`Loaded API key: ${client.tornApiKey}`)
    }
    console.log(`API call delays: ${client.tornDelay} seconds`)
    client.personalStatsTracker = new Tracker(client)
    client.personalStatsTracker.start()
})

client.on('error', console.error)

client.login(process.env.BOT_TOKEN)
