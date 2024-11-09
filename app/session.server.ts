import { createCookieSessionStorage } from "@remix-run/node";

export type SessionData = {
	userId: string;
}

export type SessionFlashData = {
	error: string;
}

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>(
    {
      cookie: {
        name: "__session",

        domain: process.env.COOKIE_DOMAIN,

        httpOnly: true,
        maxAge: 60 * 60,
        path: "/",
        sameSite: "strict",
        secrets: process.env.COOKIE_SECRETS!.split(","),
        secure: true,
      },
    }
  );

export { getSession, commitSession, destroySession };

