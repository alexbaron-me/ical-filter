import { redirect, type LoaderFunctionArgs } from "@remix-run/node";

const lookup = new Map<string, string>();

async function findFaviconUrl(url: URL): Promise<string | null> {
	const probeUrl = `${url.protocol}//${url.hostname}/favicon.ico`;
	if (lookup.has(probeUrl)) return lookup.get(probeUrl)!;

	console.log("Probing", probeUrl);
	const response = await fetch(probeUrl, { method: "HEAD" });
	console.log("Response ok:", response.ok);

	if (response.ok) return probeUrl;

	// Try removing one level of subdomain
	const hostnameParts = url.hostname.split(".");
	if (hostnameParts.length < 3) return null;
	hostnameParts.shift();
	const newHostname = hostnameParts.join(".");
	const result = await findFaviconUrl(new URL(`${url.protocol}//${newHostname}`));
	if (!result) return null;

	lookup.set(probeUrl, result);
	return result;
}

export async function loader({ request }: LoaderFunctionArgs) {
	let urlString = new URL(request.url).searchParams.get("url");
	if (!urlString) throw new Response("Missing url", { status: 400 });
	if (!urlString.startsWith("http"))
		urlString = "https://" + urlString
	const url = new URL(urlString);
	const faviconUrl = await findFaviconUrl(url);

	if (!faviconUrl) throw new Response("Not found", { status: 404 });
	return redirect(faviconUrl);
}
