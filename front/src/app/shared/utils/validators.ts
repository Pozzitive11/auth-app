import { AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, map, take } from 'rxjs';

export const createBEValidator = ({
  controlName,
  error$,
  errorName,
}: {
  controlName: string;
  error$: Observable<string>;
  errorName: string;
}): AsyncValidatorFn => {
  return (): Observable<ValidationErrors> => {
    return error$.pipe(
      take(1),
      map((error) => {
        if (error?.toLocaleLowerCase().includes(controlName)) {
          return { [errorName]: true };
        } else {
          return null;
        }
      })
    );
  };
};
