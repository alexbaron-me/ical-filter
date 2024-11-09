import { type LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { eq } from "drizzle-orm";
import db from "~/db";
import { users } from "~/db/schema";
import { getSession } from "~/session.server";

function makeRedirect(request: Request) {
	const from = new URL(request.url);

	const redirectTo = new URL("/login", from.origin);
	redirectTo.searchParams.set("redirectTo", from.pathname);

	return redirectTo.toString();
}

export async function loader({ request }: LoaderFunctionArgs) {
	const session = await getSession(request.headers.get("Cookie"));
	if (!session.has("userId")) throw redirect(makeRedirect(request));
	
	const userId = session.get("userId")!;
	const user = await db.query.users.findFirst({ where: eq(users.id, userId) });

	if (!user) throw redirect(makeRedirect(request));

	return json({})
}

export default function AuthLayout() {
	return <Outlet />;
}

