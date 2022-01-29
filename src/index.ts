import server from './api/server';

import config from './config';

server.listen(config.PORT, () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`listening on http://localhost:${config.PORT}`);
  }
});
