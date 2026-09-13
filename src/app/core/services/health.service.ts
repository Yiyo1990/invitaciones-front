import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { HealthResponse } from '../models/health-response';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HealthService {
  private readonly http = inject(HttpClient);

  /** Calls the real backend endpoint `GET /api/health`. */
  check(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(`${environment.apiUrl}/health`);
  }
}
