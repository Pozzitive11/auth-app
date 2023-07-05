import { Component, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { selectUser } from '@modules/user/store';
import { AuthService } from '@modules/auth';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  user$ = this.store.pipe(select(selectUser));

  constructor(
    private store: Store,
    private authService: AuthService,
    private destroyRef: DestroyRef
  ) {}

  logout() {
    this.authService
      .logout()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
