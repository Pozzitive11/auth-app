import { FormControl, FormGroup } from '@angular/forms';

export const removeFormError = (
  formEntity: FormControl | FormGroup,
  errorName: string
) => {
  const errors = { ...formEntity.errors };
  delete errors[errorName];
  formEntity.setErrors(errors);
};
