import { redirect } from '@sveltejs/kit';

const redirectHome = () => redirect(303, '/');
export default redirectHome;
