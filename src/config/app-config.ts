export const appConfig = () => ({
  env: process.env.APP_ENV ?? 'development',
  port: parseInt(process.env.APP_PORT ?? '3000', 10),
  apiPrefix: process.env.API_PREFIX ?? 'api',
});
