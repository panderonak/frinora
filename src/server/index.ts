import { j } from '@/server/jstack';
import { authRouter } from '@/server/routers/auth-router';
import { categoryRouter } from '@/server/routers/category-router';
import { paymentRouter } from '@/server/routers/payment-router';
import { projectRouter } from '@/server/routers/project-router';

/**
 * This is your base API.
 * Here, you can handle errors, not-found responses, cors and more.
 *
 * @see https://jstack.app/docs/backend/app-router
 */
const api = j
  .router()
  .basePath('/api')
  .use(j.defaults.cors)
  .onError(j.defaults.errorHandler);

/**
 * This is the main router for your server.
 * All routers in /server/routers should be added here manually.
 */
const appRouter = j.mergeRouters(api, {
  auth: authRouter,
  category: categoryRouter,
  payment: paymentRouter,
  project: projectRouter,
});

export type AppRouter = typeof appRouter;

export default appRouter;
