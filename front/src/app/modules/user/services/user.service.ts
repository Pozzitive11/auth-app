import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { UserActions, selectUser } from '../store';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
  currentUser$ = new BehaviorSubject<User>(null);
  user$ = this.store.pipe(select(selectUser));

  constructor(private store: Store) {
    this.user$.subscribe();
  }

  getUserById(id: number): void {
    this.store.dispatch(UserActions.loadUser({ id }));
  }

  getUser() {
    return {
      email: 'qwe@gmail.com',
      id: 1,
      type: '[User] Load user Success',
    };
  }
}
