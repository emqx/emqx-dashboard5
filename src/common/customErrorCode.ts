import { PostLogin401Code } from '@/types/schemas/dashboard.schemas'

/**
 * from back end
 */
export const BAD_TOKEN = 'BAD_TOKEN'

export const TOKEN_TIME_OUT = 'TOKEN_TIME_OUT'

export const { LOGIN_LOCKED } = PostLogin401Code

export const NAME_PWD_ERROR = 'BAD_USERNAME_OR_PWD'

export const MFA_REQUIRED = 'BAD_MFA_TOKEN'

export const UNAUTHORIZED_ROLE = 'UNAUTHORIZED_ROLE'
