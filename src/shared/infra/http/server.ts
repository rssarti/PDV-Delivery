import express from 'express';
import { DataSource } from 'typeorm';
import { DatabaseProviderFactory } from '../database';
import routes from '../routes';

// Extend global interface
declare global {
  var getDataSource: () => DataSource;
}

const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

async function initializeServer() {
  try {
    const databaseProvider = DatabaseProviderFactory.createFromEnv();
    await databaseProvider.connect();
    const dataSource = databaseProvider.getDataSource();

    if (!dataSource.isInitialized) {
      throw new Error('Database connection failed');
    }

    global.getDataSource = () => dataSource;

    // Initialize container after DataSource is ready
    import('../../container').then(({ TYPES }) => {
      console.log('🔧 Container initialized with types:', Object.keys(TYPES));
    });

    app.use('/api', routes);

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

process.on('uncaughtException', error => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

const gracefulShutdown = (signal: string) => {
  console.log(`${signal} received, shutting down gracefully...`);
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

initializeServer();
