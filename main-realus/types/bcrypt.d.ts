declare module 'bcrypt' {
  /**
   * Generate a salt
   * @param rounds Number of rounds to use, defaults to 10 if omitted
   * @param callback Callback receiving the error, if any, and the generated salt
   */
  export function genSalt(rounds?: number, callback?: (err: Error | null, salt: string) => void): Promise<string>;

  /**
   * Generate a salt synchronously
   * @param rounds Number of rounds to use, defaults to 10 if omitted
   */
  export function genSaltSync(rounds?: number): string;

  /**
   * Hash data using a salt
   * @param data The data to be hashed
   * @param saltOrRounds The salt to be used to hash the password, or the number of rounds to generate a salt
   * @param callback Callback receiving the error, if any, and the hashed data
   */
  export function hash(data: string, saltOrRounds: string | number, callback?: (err: Error | null, encrypted: string) => void): Promise<string>;

  /**
   * Hash data using a salt synchronously
   * @param data The data to be hashed
   * @param saltOrRounds The salt to be used to hash the password, or the number of rounds to generate a salt
   */
  export function hashSync(data: string, saltOrRounds: string | number): string;

  /**
   * Compare data with a hash
   * @param data The data to be compared
   * @param encrypted The hash to be compared with
   * @param callback Callback receiving the error, if any, and the comparison result
   */
  export function compare(data: string, encrypted: string, callback?: (err: Error | null, same: boolean) => void): Promise<boolean>;

  /**
   * Compare data with a hash synchronously
   * @param data The data to be compared
   * @param encrypted The hash to be compared with
   */
  export function compareSync(data: string, encrypted: string): boolean;
}