import { redirect } from '@sveltejs/kit';

export const redirectHome = () => redirect(303, '/');
