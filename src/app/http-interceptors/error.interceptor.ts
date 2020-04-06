import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { apiRetry } from '../api-utils';
import { retry, catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        retry(apiRetry),
        catchError((error: HttpErrorResponse) => {
          let errorMsg: string;
          if (error.error instanceof ErrorEvent) {
            // Client side
            errorMsg = `Error: ${error.error.message}`;
          } else {
            // Server side
            errorMsg = `Error Status: ${error.status}\nMessage: ${error.message}`;
          }
          console.log(errorMsg);
          return throwError(errorMsg);
        })
      )
  }
}
