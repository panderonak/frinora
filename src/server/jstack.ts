import * as schema from '@/server/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { env } from 'hono/adapter';
import { HTTPException } from 'hono/http-exception';
import { InferMiddlewareOutput, jstack } from 'jstack';

interface Env {
  Bindings: { DATABASE_URL: string };
}

export const j = jstack.init<Env>();

/**
 * Type-safely injects database into all procedures
 *
 * @see https://jstack.app/docs/backend/middleware
 */

const databaseMiddleware = j.middleware(async ({ c, next }) => {
  const { DATABASE_URL } = env(c);

  const sql = neon(DATABASE_URL);
  const db = drizzle(sql, { schema });

  return await next({ db });
});

type DatabaseMiddlewareOutput = InferMiddlewareOutput<
  typeof databaseMiddleware
>;

const authMiddleware = j.middleware(async ({ c, next, ctx }) => {
  const authHeader = c.req.header('Authorization');

  const { db } = ctx as DatabaseMiddlewareOutput;

  if (authHeader) {
    const APIKEY = authHeader.split(' ')[1];

    const user = await db.query.user.findFirst({
      where: ({ apiKey }, { eq }) => eq(apiKey, APIKEY),
    });

    if (user) return next({ user });
  }

  const auth = await currentUser();

  if (!auth) {
    throw new HTTPException(401, { message: 'Unauthorised.' });
  }

  const user = await db.query.user.findFirst({
    where: ({ externalId }, { eq }) => eq(externalId, auth.id),
  });

  if (!user) {
    throw new HTTPException(401, { message: 'Unauthorised.' });
  }

  return next({ user });
});

/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */
export const publicProcedure = j.procedure.use(databaseMiddleware);
export const privateProcedure = publicProcedure.use(authMiddleware);
