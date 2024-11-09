import { type ActionFunctionArgs, redirect, json } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { verifyPassword } from "~/auth.server";
import Alert from "~/components/Alert";
import Button from "~/components/Button";
import Input from "~/components/Input";
import db from "~/db";
import { users } from "~/db/schema";
import { commitSession, getSession } from "~/session.server";

export async function action({ request }: ActionFunctionArgs) {
	const redirectTo = new URL(request.url).searchParams.get("redirectTo") || "/";

	const formData = await request.formData();
	const email = formData.get("email")?.toString().toUpperCase();
	const password = formData.get("password")?.toString();
	if (!email || !password) throw new Response("Missing email or password", { status: 400 })

	const user = await db.query.users.findFirst({ where: eq(users.email, email) });
	if (!user) return json({ error: "Invalid email or password" });

	const passwordMatch = await verifyPassword(password, user.passwordHash);
	if (!passwordMatch) return json({ error: "Invalid email or password" });

	const session = await getSession(request.headers.get("Cookie"));
	session.set("userId", user.id);
	return redirect(redirectTo, { headers: { "Set-Cookie": await commitSession(session) } })
}

export default function LoginPage() {
	const actionData = useActionData<typeof action>();
	const [searchParams] = useSearchParams();

	const signinHref = "/signup" + (searchParams.get("redirectTo") ? "?redirectTo=" + searchParams.get("redirectTo") : "");

	return (
		<>
			<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<img
						className="mx-auto h-10 w-auto"
						src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
						alt="Logo"
					/>
					<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
						Sign in to your account
					</h2>
				</div>

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<Form className="space-y-4" method="post">
						{actionData?.error && (
							<Alert>{actionData.error}</Alert>
						)}

						<Input name="email" type="email" label="Email" />
						<Input name="password" type="password" label="Password" />

						<Button className="w-full">Sign in</Button>
						<Link to={signinHref} className="block text-center text-sm text-indigo-600 hover:text-indigo-500">
							Create an account
						</Link>
					</Form>
				</div>
			</div>
		</>
	)
}

