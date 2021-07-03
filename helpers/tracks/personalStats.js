import {getTornData} from '../torn.js'

export default class PersonalStats {
    constructor(client) {
        Object.defineProperty(this, 'client', { value: client })
        this.key = 'personalstats'
        this.ageKey = 'personalstatsage'
        this.load()
    }

    async load() {
        this.recordsAge = this.client.db.data[this.ageKey]
        this.apiKey = this.client.db.data.tornApiKey
    }

    async nextItem() {
        let tracks = this.client.db.data.tracks
        if (!this.recordsAge) {
            this.recordsAge = {}
            tracks.forEach(v => {
                this.recordsAge[v.uid] = 0
            })
        }
        tracks.forEach(v => {
            if (!Object.prototype.hasOwnProperty.call(this.recordsAge, v.uid)) {
                this.recordsAge[v.uid] = 0
            }
        })
        for (const uid in this.recordsAge) {
            if (!tracks.some(v => v.uid === uid)) delete this.recordsAge[uid]
        }
        if (Object.keys(this.recordsAge).length === 0) return {uid: false}
        let recordsAge = Object.entries(this.recordsAge)
        recordsAge.sort((a, b) => a[1] - b[1])
        return recordsAge[0]
    }

    async getTrackedDiff() {
        if (!this.apiKey) return
        let nextItem = await this.nextItem()
        if (!nextItem) return
        let uid = nextItem[0]
        let data = await getTornData('user', 'basic,personalstats,timestamp', this.apiKey, uid)
        if (!data.success) return
        let cachedData = this.client.db.data[`${this.key}${uid}`]
        if (!cachedData) return
        let trackedStats = await this.getTrackedStats(uid)
        if (!isNaN(data.data.timestamp)) {
            this.recordsAge[data.data.player_id] = data.data.timestamp
        }
        await this.cacheData(data.data)
        return trackedStats.filter(v => Object.prototype.hasOwnProperty.call(data.data.personalstats, v.statsKey)).map(tracked => {
            return {
                user: `${data.data.name} [${data.data.player_id}]`,
                statsKey: tracked.statsKey,
                diff: data.data.personalstats[tracked.statsKey] - cachedData.personalstats[tracked.statsKey],
                channelId: tracked.channelId,
            }
        })
    }

    async cacheData(data) {
        let age = this.client.db.data[this.ageKey]
        let tracks = this.client.db.data.tracks
        if (!age) {
            age = {}
        }
        age[data.player_id] = data.timestamp
        for (const uid in age) {
            if (!tracks.some(v => v.uid === uid)) delete age[uid]
        }
        this.client.db.data[this.ageKey] = age
        this.client.db.data[`${this.key}${data.player_id}`] = data
        await this.client.db.write()
    }

    async getTrackedStats(uid) {
        return this.client.db.data.tracks.filter(v => v.uid === uid)
    }

    async process() {
        try {
            this.getTrackedDiff().then(diff => {
                if (!diff) return
                if (diff.length === 0) return
                for (let d of diff) {
                    if (d.diff > 0) {
                        this.client.channels.cache.get(d.channelId).send(`\`\`\`md\n[${this.currentTimestamp()}](${d.user}) ${d.diff} ${d.statsKey}\n\`\`\``)
                    }
                }
            })
        } catch(err) {
            console.error(err)
        }
    }

    currentTimestamp() {
        return new Date().toLocaleString('en-GB', {timeZone: 'UTC'})
    }
}
