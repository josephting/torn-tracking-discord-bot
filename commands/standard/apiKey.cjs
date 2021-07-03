const { Command } = require('discord.js-commando')

module.exports = class ApiKey extends Command {
    constructor(client){
        super(client,{
            name: 'apikey',
            group: 'standard',
            memberName: 'apikey',
            description: 'Add API key to be used to consume Torn API',
            args: [
                {
                    key: 'key',
                    prompt: 'Enter API key - https://www.torn.com/preferences.php#tab=api',
                    type: 'string',
                    default: '',
                }
            ]
        })
    }

    async run(message, {key}) {
        if (key === '') {
            return message.reply(`API key: ${message.client.tornApiKey}`)
        }
        message.client.tornApiKey = key
        message.client.db.data.tornApiKey = key
        await message.client.db.write()
        await message.delete()
        message.reply('API key set.').then(async msg => {
            await message.client.helpers.sleep(5000)
            await msg.delete()
        })
        console.log(`API key set: ${message.client.tornApiKey}`)
        if (message.client.personalStatsTracker.isRunning) {
            message.client.personalStatsTracker.load()
        }
    }
}
