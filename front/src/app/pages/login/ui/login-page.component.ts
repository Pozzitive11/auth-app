import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  DestroyRef,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged } from 'rxjs';
import { AuthService } from '@modules/auth';
import { createBEValidator } from '@shared/utils';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;

  readonly BE_ERROR = 'isIncorrect';
  error$ = this.authService.getAuthError();

  get emailControl(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [
        'qwe@gmail.com',
        [Validators.required, Validators.email],
        createBEValidator({
          controlName: 'email',
          error$: this.error$,
          errorName: this.BE_ERROR,
        }),
      ],
      password: [
        '',
        [Validators.required, Validators.minLength(6)],
        createBEValidator({
          controlName: 'password',
          error$: this.error$,
          errorName: this.BE_ERROR,
        }),
      ],
    });

    this.handleInputError('email');
    this.handleInputError('password');
  }

  handleInputError(controlName: string) {
    const control = this.loginForm.get(controlName) as FormControl;
    this.error$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => control.updateValueAndValidity());

    control.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef), distinctUntilChanged())
      .subscribe(() => {
        if (control?.errors?.hasOwnProperty(this.BE_ERROR)) {
          this.authService.clearAuthError();
        }
      });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(
        this.loginForm.value.email,
        this.loginForm.value.password
      );
    }
  }
}
