/**
 * Improved TypeScript Omit type.
 *
 * Omit type does not validate keys correctly
 * https://github.com/microsoft/TypeScript/issues/52871
 * 
 * https://dev.to/przemyslawjanbeigert/improve-typescript-omit-type-3d90
 *
 * @example
 * ```
 * type T = {a:number, b: number}
 * type O = Omit<T, 'invalid_prop'> // typescript does not produce error
 * type P = Pick<T, 'invalid_prop'> // OK: error `Type '"invalid_prop"' does not satisfy the constraint 'keyof T'.`
 * ```
 
Ban Omit using eslint.
```
// eslintrc.js

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    "@typescript-eslint/ban-types": [
      "error",
      {
        "types": {
          "Omit": "Use Omit2 from type.utils instead",
        },
        "extendDefaults": true
      }
    ]
}
```    
*/
export type Omit2<T extends {}, K extends keyof T> = Pick<
  T,
  Exclude<keyof T, K>
>;
