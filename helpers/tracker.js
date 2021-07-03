import {sleep} from './index.js'
import PersonalStats from './tracks/personalStats.js'

export default class Tracker {
    constructor(client) {
        Object.defineProperty(this, 'client', { value: client })
    }

    get isRunning() {
        return this.destroy !== true
    }

    async load() {
        this.tornDelay = this.client.db.data.tornDelay
        this.tracks = this.client.db.data.tracks
        if (this.personalStatsTracker) {
            this.personalStatsTracker.load()
        }
    }

    async start() {
        delete this.destroy
        await this.load()
        this.personalStatsTracker = new PersonalStats(this.client)
        if (!this.tornDelay || !this.tracks) return this.destroy()
        if (Array.isArray(this.tracks) && this.tracks.length === 0) return this.destroy()
        this.tick()
    }

    async tick() {
        await sleep(this.tornDelay * 1000)
        if (this.tornDelay < 0) this.destroy()
        if (this.destroy !== true) this.tick()
        try {
            this.personalStatsTracker.process()
        } catch(err) {
            console.error(err)
        }
    }

    destroy() {
        console.log('Destroyed')
        this.destroy = true
        return false
    }
}
