import { error } from '@sveltejs/kit';

export const error404 = (body: App.PageError) => error(404, body);

export const error401 = (body: App.PageError) => error(401, body);

export const error400 = (body: App.PageError) => error(400, body);

export const error500 = (body: App.PageError) => error(500, body);
