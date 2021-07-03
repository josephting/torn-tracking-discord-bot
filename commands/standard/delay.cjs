const { Command } = require('discord.js-commando')

module.exports = class Delay extends Command {
    constructor(client){
        super(client,{
            name: 'delay',
            group: 'standard',
            memberName: 'delay',
            description: 'Set api calls delay in seconds',
            args: [
                {
                    key: 'delay',
                    prompt: 'Enter number of seconds interval between each API calls',
                    type: 'float',
                    default: 0,
                }
            ]
        })
    }

    async run(message, {delay}) {
        message.delete()
        if (delay === 0) {
            await message.reply(`API delay: ${message.client.tornDelay} seconds`).then(async msg => {
                await sleep(5000)
                await msg.delete()
            })
            return
        }
        message.client.tornDelay = delay
        message.client.db.data.tornDelay = delay
        await message.client.db.write()
        await message.reply(`API delay set to ${message.client.tornDelay} seconds`).then(async msg => {
            await message.client.helpers.sleep(5000)
            await msg.delete()
        })
        if (message.client.personalStatsTracker.isRunning) {
            message.client.personalStatsTracker.load()
        } else {
            message.client.personalStatsTracker.start()
        }
    }
}
