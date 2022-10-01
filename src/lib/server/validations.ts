export const validUsername = (username: string) => /^[a-zA-Z0-9_]{4,15}$/.test(username);

export const validPassword = (password: string) => /^[a-zA-Z0-9_]{6,50}$/.test(password);

export const validEmail = (email: string) => /(?=^.{5,254}$)^\S+@\S+\.\S+$/.test(email);
