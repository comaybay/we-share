import { useProtectedRoute } from 'src/lib/useProtectedRoute';
import type { PageLoad } from './$types';

export const load: PageLoad = async event => {
	await useProtectedRoute(event);
};
