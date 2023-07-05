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
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationPageComponent implements OnInit {
  registrationForm: FormGroup;

  readonly BE_ERROR = 'isIncorrect';
  error$ = this.authService.getAuthError();

  get emailControl(): FormControl {
    return this.registrationForm.get('email') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.registrationForm.get('password') as FormControl;
  }

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit() {
    this.registrationForm = this.formBuilder.group({
      email: [
        'qwe@gmail.com',
        [Validators.required, Validators.email],
        createBEValidator({
          controlName: 'email',
          error$: this.error$,
          errorName: this.BE_ERROR,
        }),
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.handleInputError('email');
  }

  handleInputError(controlName: string) {
    const control = this.registrationForm.get(controlName) as FormControl;
    this.error$.subscribe(() => control.updateValueAndValidity());

    control.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef), distinctUntilChanged())
      .subscribe(() => {
        if (control?.errors?.hasOwnProperty(this.BE_ERROR)) {
          this.authService.clearAuthError();
        }
      });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      this.authService.register(
        this.registrationForm.value.email,
        this.registrationForm.value.password
      );
    }
  }
}
