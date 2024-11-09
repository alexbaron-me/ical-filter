import { ChevronRightIcon } from "@heroicons/react/20/solid";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { useState } from "react";
import { getUserId } from "~/auth.server";
import Button from "~/components/Button";
import Dialog from "~/components/Dialog";
import Input from "~/components/Input";
import db from "~/db";
import { calendars } from "~/db/schema";

export async function action({ request }: ActionFunctionArgs) {
	const userId = await getUserId(request);

	const formData = await request.formData();
	const name = formData.get("name")?.toString();
	const sourceUrl = formData.get("sourceUrl")?.toString();

	if (!name || !sourceUrl || name.length === 0 || sourceUrl.length === 0)
		return json({ message: "Missing required fields" }, { status: 400 });

	const calendar = await db
		.insert(calendars)
		.values({
			sourceUrl,
			name,
			userId,
		})
		.returning();
	const calendarId = calendar[0].id;

	return redirect(`/calendars/${calendarId}`);
}

export async function loader({ request }: LoaderFunctionArgs) {
	const userId = await getUserId(request);

	const calendarsBase = await db.query.calendars.findMany({
		where: eq(calendars.userId, userId),
	});
	const calendarsWithIcon = calendarsBase.map((c) => ({
		...c,
		iconUrl: `/api/favicon?url=${encodeURI(c.sourceUrl)}`,
	}));

	return json({ calendars: calendarsWithIcon });
}

export default function Calendars() {
	const { calendars } = useLoaderData<typeof loader>();
	const [showDialog, setShowDialog] = useState(false);

	return (
		<div className="flex h-full items-center justify-center bg-gray-100">
			<div className="max-w-4xl overflow-hidden bg-white shadow sm:rounded-lg">
				<div className="space-y-4 px-4 py-5 sm:p-6">
					<ul className="divide-y divide-gray-100">
						{calendars.map((calendar) => (
							<li key={calendar.id}>
								<Link
									to={`/calendars/${calendar.id}`}
									className="flex items-center gap-x-4 rounded px-2 py-5 hover:bg-gray-100"
								>
									<img
										className="h-12 w-12 flex-none rounded-full bg-gray-50"
										src={calendar.iconUrl}
										alt="Favicon for"
									/>
									<div className="min-w-0">
										<p className="text-sm font-semibold leading-6 text-gray-900">
											{calendar.name}
										</p>
										<p className="mt-1 max-w-[40ch] truncate text-xs leading-5 text-gray-500">
											{calendar.sourceUrl}
										</p>
									</div>
									<ChevronRightIcon
										className="ml-16 h-5 w-5 flex-none text-gray-400"
										aria-hidden="true"
									/>
								</Link>
							</li>
						))}
					</ul>

					<Button className="w-full" onClick={() => setShowDialog(true)}>
						Add new calendar
					</Button>
					<Dialog isOpen={showDialog} setOpen={setShowDialog}>
						<Form method="post">
							<div className="space-y-2 pb-8">
								<Input name="name" label="Name" />
								<Input
									name="sourceUrl"
									label="Source URL"
									addonPre="https://"
								/>
							</div>
							<div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
								<Button
									size="lg"
									color="secondary"
									className="w-full"
									onClick={() => setShowDialog(false)}
								>
									Cancel
								</Button>
								<Button size="lg" className="w-full" type="submit">
									Create Calendar
								</Button>
							</div>
						</Form>
					</Dialog>
				</div>
			</div>
		</div>
	);
}
