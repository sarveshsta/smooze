const { createLogger, format , transports} = require("winston");
var { URL } = require('./constants/constants');
const logger = createLogger({
    
  transports: [
    new transports.Console(),
    new transports.File({
      level: "warn",
      filename: 'logsWarnings.log'
    }),
    new transports.File({
      level: "error",
      filename: 'logsErrors.log'
    }),
    new transports.File({
      level: "info",
      filename: 'logsInfos.log'
    })
    // new transports.MongoDB({
    //   db: URL,
    //   collection: 'logs'
    // })

  ],
  format: format.combine(
    format.json(),
    format.timestamp(),
    format.metadata(),
    format.prettyPrint()
  )
})




module.exports = logger;