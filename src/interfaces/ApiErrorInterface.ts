import { HttpStatusCode } from 'axios';

export interface ApiErrorResponse {
  message: string;
  error?: string;
  code: HttpStatusCode;
}
