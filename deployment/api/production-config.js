// Production configuration for GoDaddy deployment
// Copy this to .env file and update with your actual values

const productionConfig = {
  NODE_ENV: 'production',
  PORT: 3001,
  DB_HOST: 'your_database_host', // e.g., 'mysql123.secureserver.net'
  DB_USER: 'your_database_username',
  DB_PASSWORD: 'your_database_password',
  DB_NAME: 'autos-direct',
  DB_PORT: 3306,
  JWT_SECRET: 'your_jwt_secret_key_here'
};

module.exports = productionConfig;
