const fs = require('fs');

const handleServerLog = async (req, res, next) => {
  const log = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;

  fs.appendFile('server.log', log, (err) => {
    if (err) console.error('Error writing to log file:', err);
  });

  next();
};

module.exports = {handleServerLog};
