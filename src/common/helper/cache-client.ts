import {createClient} from 'redis'
import appConfig from '../../app.config'
const redisUrl = appConfig.redis.url;
const options = { url: redisUrl }
const cacheClient = createClient(options)

export default cacheClient;