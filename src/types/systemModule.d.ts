export interface APIKeyFormWhenCreating {
  name: string;
  expired_at: string;
  desc: string;
  enable: boolean;
}

export interface APIKey extends APIKeyFormWhenCreating {
  api_key: string;
  api_secret: string;
  created_at: string;
}

export type APIKeyFormWhenEditing = Pick<
  APIKey,
  "name" | "expired_at" | "desc" | "enable"
>;
