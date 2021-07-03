const { Command } = require('discord.js-commando')

module.exports = class Track extends Command {
    constructor(client){
        super(client,{
            name: 'track',
            group: 'standard',
            memberName: 'track',
            description: 'Add item to be tracked (`!track <uid> xantaken`)',
            args: [
                {
                    key: 'uid',
                    prompt: 'Enter user id you want to track',
                    type: 'string',
                    default: '',
                },
                {
                    key: 'statsKey',
                    prompt: 'Enter personal stats key to be tracked',
                    type: 'string',
                    default: '',
                }
            ]
        })
    }

    async run(message, {uid, statsKey}) {
        if (uid === 'list') {
            let trackListMessage = await this.buildTrackingListMessage(message)
            return message.reply(trackListMessage)
        }
        if (uid === '' || statsKey === '') {
            return message.reply('Command is `!track <uid> xantaken`')
        }
        message.client.db.data.tracks ||= []
        let newItem = {
            uid,
            statsKey,
            channelId: message.channel.id,
        }
        if (!message.client.db.data.tracks || !Array.isArray(message.client.db.data.tracks)) {
            message.client.db.data.tracks = [newItem]
        } else {
            if (message.client.db.data.tracks.some(v => v.uid === uid && v.statsKey === statsKey)) {
                return message.reply(`${statsKey} for ${uid} is already being tracked.`)
            }
            message.client.db.data.tracks.push(newItem)
        }
        await message.client.db.write()
        await message.reply(`${statsKey} for ${uid} will now be tracked.`)
        if (!message.client.personalStatsTracker.isRunning) {
            message.client.personalStatsTracker.start()
        } else {
            message.client.personalStatsTracker.load()
        }
    }

    async buildTrackingListMessage(message) {
        if (!message.client.db.data.tracks || (Array.isArray(message.client.db.data.tracks) && message.client.db.data.tracks.length === 0)) {
            return 'Nothing is currently being tracked.'
        }
        let trackListMessage = `Currently tracking:\n\`\`\`md`
        message.client.db.data.tracks.forEach(v => {
            trackListMessage += `\n[${v.uid}](${v.statsKey})`
        })
        trackListMessage += `\n\`\`\``
        return trackListMessage
    }
}
