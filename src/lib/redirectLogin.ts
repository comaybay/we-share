import { redirect } from '@sveltejs/kit';

export const redirectLogin = () => redirect(302, '/dang-nhap');
