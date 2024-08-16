import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FirestoreUtils {
  // This is here so Jasmine can spyOn this function.
  // https://jasmine.github.io/tutorials/module_mocking#angular
  public createId = () => {
    let code = '';
    const alpha =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const codeLength = 20;

    for (let i = 0; i < codeLength; i++) {
      code += alpha.charAt(Math.floor(Math.random() * alpha.length));
    }

    return code;
  };
}
