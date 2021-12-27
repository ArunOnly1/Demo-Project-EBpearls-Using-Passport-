const mongoose = require('mongoose')
const debug = require('debug')('db_connect ')

const db_connect = () => {
  try {
    // use encodeURI to have password having special characters
    mongoose.connect(encodeURI(process.env.DB_CONNECT), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    const conn = mongoose.connection
    conn.on('connected', () => {
      debug('DB CONNECTED')
      console.log('DB is connected')
    })

    conn.on('error', (err) => {
      debug(`DB CONNECTION ERROR  ${err}`)
      process.exit(0)
    })

    conn.on('disconnected', () => {
      debug('DB DISCONNECTED')
    })

    return conn
  } catch (error) {
    debug({ message: error.message })
  }
}

module.exports = db_connect
