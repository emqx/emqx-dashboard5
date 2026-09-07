import { PostLoginVerify401Code } from '@/types/schemas/dashboard.schemas'

/**
 * from back end
 */
export const BAD_TOKEN = 'BAD_TOKEN'

export const TOKEN_TIME_OUT = 'TOKEN_TIME_OUT'

export const {
  BAD_MFA_TOKEN: MFA_REQUIRED,
  BAD_USERNAME_OR_PWD: NAME_PWD_ERROR,
  LOGIN_LOCKED,
  SCRAM_CHALLENGE_INVALID,
} = PostLoginVerify401Code

export const UNAUTHORIZED_ROLE = 'UNAUTHORIZED_ROLE'
