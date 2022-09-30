import type { ApiError } from '@supabase/supabase-js';

export function convertToUserFriendlyMessage(error: ApiError) {
	if (error.status === 500) {
		return 'Đã xảy ra sự cố, vui lòng thử lại';
	}

	//find pattern that has a keyword that contain inside the error message, and return its user friendly message
	const errorMessage = error.message.toLowerCase();
	return (
		errorPatterns.find(p => p.keywords.some(k => errorMessage.includes(k)))?.message ??
		'Đã xảy ra lỗi có thể liên quan đến đường truyền mạng, vui lòng thử lại'
	);
}

const errorPatterns: Array<ErrorPattern> = [
	{ keywords: ['password'], message: 'Mật khẩu không đúng (phải lớn hơn 6 ký tự)' },
	{ keywords: ['already registered'], message: 'Email này đã được sử dụng bởi một tài khoản khác' }
];

interface ErrorPattern {
	keywords: string[];
	message: string;
}
