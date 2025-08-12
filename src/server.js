import 'dotenv/config';
import app from './app.js';
import db from './models/index.js';

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await db.sequelize.authenticate();
    console.log('DB successfully connected');
    await db.sequelize.sync({ alter: true });
    app.listen(PORT, () => {
      console.log(`Server is up and listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
