import bcrypt from 'bcryptjs';
import { getSession } from './session.server';

export async function verifyPassword(password: string, hash: string) {
	return await bcrypt.compare(password, hash);
}

export async function hashPassword(password: string) {
	return await bcrypt.hash(password, 12);
}

export async function getUserId(request: Request): Promise<string> {
	const session = await getSession(request.headers.get('Cookie'));
	if (!session.get("userId")) {
		throw new Error('Not authenticated');
	}

	return session.get("userId")!;
}

