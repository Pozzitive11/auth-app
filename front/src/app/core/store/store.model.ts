import { AuthState } from '@modules/auth';
import { User } from '@modules/user/models';

export interface AppState {
  error: AuthState;
  user: User;
}
