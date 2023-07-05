export interface AuthState {
  authError: string | null;
}
export interface AuthRes {
  accessToken: string;
  user: {
    id: number;
    email: string;
  };
}

export enum Auth {
  accessToken = 'ACCESS_TOKEN',
}
