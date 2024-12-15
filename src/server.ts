import http from 'http';

import {PORT} from './config';

import app from './app';
import {connectDB, disconnectDB} from './utils';
import {Logger} from './utils';
import {debug} from 'console';

const server = http.createServer(app);

async function startServer() {
  server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
}

startServer()
  .then(async () => {
    await connectDB();
  })
  .catch(err => {
    Logger.error(err);
    console.log(err.stack);
    throw err;
  });

// process.on('SIGINT', () => {
//   handleShutdown();
// });

process.on('SIGTERM', () => {
  handleShutdown();
});

process.on('uncaughtExceptionMonitor', async err => {
  Logger.error(err, `Unexpected Server shutdown, ${err.stack}`);
});

function handleShutdown() {
  server.close(async () => {
    await disconnectDB();
    // await closeQueues();

    debug('HTTP Server closed');
  });
}
