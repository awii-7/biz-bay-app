import { AbstractControl, ValidationErrors } from '@angular/forms';
  
export class TitleValidation {
    static cannotContainSpace(control: AbstractControl) : ValidationErrors | null {
        const isWhitespace = (control.value || '').trim().length === 0;
        const isValid = !isWhitespace;
        return isValid ? null : { 'whitespace': true };
    }
}