import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

export interface ApiRequestOptions {
  params?: Record<string, string | number | boolean>;
}

/**
 * @scope shared
 * @type shared
 *
 * A thin, generic HTTP wrapper used by all domain data-access libraries.
 * This service does NOT contain any domain-specific logic.
 * Domain services inject this and build their own typed request methods on top.
 */
@Injectable({ providedIn: "root" })
export class ApiHttpService {
  private http = inject(HttpClient);

  constructor() {}

  get<T>(url: string, options?: ApiRequestOptions): Observable<T> {
    let params = new HttpParams();
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        params = params.set(key, String(value));
      });
    }
    return this.http.get<T>(url, { params });
  }

  post<T>(url: string, body: unknown): Observable<T> {
    return this.http.post<T>(url, body);
  }

  put<T>(url: string, body: unknown): Observable<T> {
    return this.http.put<T>(url, body);
  }

  patch<T>(url: string, body: unknown): Observable<T> {
    return this.http.patch<T>(url, body);
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url);
  }
}
