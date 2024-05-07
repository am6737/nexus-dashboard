export interface User {
  id: string;
  name?: string;
  avatar?: string;
  email?: string;
  toekn?: string;

  [key: string]: unknown;
}
