import type UserProfile from '$lib/types/UserProfile';
import { writable } from 'svelte/store';

export const userProfile = writable<UserProfile | null>(null);
