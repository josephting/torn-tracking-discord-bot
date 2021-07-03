import axios from 'axios'
import querystring from 'querystring'
import config from '../config.js'
const {torn_api_comment,torn_api_base} = config

export function getTornApiLink(object, selections, key=process.env.MAINAPIKEY, objectId='', query={}) {
    selections = typeof selections === 'string' ? selections : selections.join(',')
    if (torn_api_comment) query.comment = torn_api_comment
    let qs = querystring.stringify({
        selections,
        key,
        ...query
    })
    return `${torn_api_base}/${object}/${objectId}?${qs}`
}

export function getTornData(object, selections, key=process.env.MAINAPIKEY, objectId='') {
    return axios.get(getTornApiLink(object, selections, key, objectId))
        .then(response => {
            if ('error' in response.data) {
                console.error(response.data.error)
                return { success: false, data: response.data.error }
            }
            return { success: true, data: response.data }
        })
        .catch(axiosErrorHandler)
}

function axiosErrorHandler(error) {
    if (error.response) {
        console.error({
            error: error.response.data,
            status: error.response.status,
            headers: error.response.headers
        })
    } else if (error.request) {
        console.error(error.request)
    } else {
        console.error(error.message)
    }
    return {success:false}
}
