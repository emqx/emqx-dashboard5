export interface APIKeyFormWhenCreating {
  name: string;
  /**
   * When the api key never expires, the value is undefined
   * (not submit to the interface)
   */
  expired_at?: string | undefined;
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
