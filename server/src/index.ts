import app from './app';
import { config } from './config';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🏦 Property Finance Advisory Backend API`);
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`🌐 Public API: http://localhost:${PORT}/api/public`);
  console.log(`🔐 Admin API:  http://localhost:${PORT}/api/admin`);
  console.log(`⏱ Timezone:   ${config.timezone}`);
  console.log(`======================================================\n`);
});
