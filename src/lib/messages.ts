import { MAX_NUMBER_OF_TOPICS } from './constants';

export const MSG_USER_NOT_FOUND = 'Người dùng này không tồn tại';

export const MSG_POST_NOT_FOUND = 'Bài viết này không tồn tại hoặc đã bị chủ bài viết xóa';

export const MSG_SERVER_ERROR = 'Đã xảy ra sự cố máy chủ, vui lòng thử lại sau';

export const MSG_SERVER_ERROR_TRY_AGAIN = 'Đã xảy ra sự cố máy chủ, vui lòng thử lại sau';

export const MSG_NOT_ALLOW_EDIT_POST = 'Bạn không có quyền chỉnh sửa bài viết này';

// API Messages
export const MSG_API_TOPICS_EXCEEDED = `number of topic must not be larger than ${MAX_NUMBER_OF_TOPICS}`;

export const MSG_API_INVALID_TOPIC = 'Invalid topics';

export const MSG_API_ID_NOT_FOUND = 'Id not found';

export const MSG_API_ID_MISSING = 'Id missing';

export const MSG_API_PERMISSION_DENIED = 'Permission denided';
