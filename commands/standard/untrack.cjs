const { Command } = require('discord.js-commando')

module.exports = class Untrack extends Command {
    constructor(client){
        super(client,{
            name: 'untrack',
            group: 'standard',
            memberName: 'untrack',
            description: 'Remove item to be tracked (`!untrack <uid> xantaken`)',
            args: [
                {
                    key: 'uid',
                    prompt: 'Enter user id you want to untrack',
                    type: 'string',
                    default: '',
                },
                {
                    key: 'statsKey',
                    prompt: 'Stop tracking for particular personal stats',
                    type: 'string',
                    default: '',
                }
            ]
        })
    }

    async run(message, {uid, statsKey}) {
        if (uid === 'all') {
            message.client.db.data.tracks = []
            if (message.client.personalStatsTracker.isRunning) {
                message.client.personalStatsTracker.destroy()
            }
            return message.reply('All tracked items have been cleared.')
        }
        if (uid === '' || statsKey === '') {
            return message.reply('Command is `!untrack <uid> xantaken`')
        }
        this.tracks = message.client.db.data.tracks
        if (!this.tracks || !Array.isArray(this.tracks)) {
            return message.reply(`Nothing is currently tracked. Unable to untrack.`)
        }
        if (!this.tracks.some(v => v.uid === uid && v.statsKey === statsKey)) {
            return message.reply(`Specified parameters wasn't being tracked.`)
        }
        this.tracks.splice(this.tracks.findIndex(v => v.uid === uid && v.statsKey === statsKey), 1)
        await message.client.db.write()
        await message.reply(`${statsKey} for ${uid} has been removed from track list.`)
        if (this.tracks.length === 0 && message.client.personalStatsTracker.isRunning) {
            message.client.personalStatsTracker.destroy()
        } else if (message.client.personalStatsTracker.isRunning) {
            message.client.personalStatsTracker.load()
        }
    }
}
