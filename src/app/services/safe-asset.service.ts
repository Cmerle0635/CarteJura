// src/app/services/safe-asset.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SafeAssetService {
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  loadJSON<T>(url: string): Observable<T | null> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.get<T>(url);
    } else {
      console.warn(`[SafeAssetService] Skipped loading ${url} on the server`);
      return of(null);
    }
  }

  loadText(url: string): Observable<string | null> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.get(url, { responseType: 'text' });
    } else {
      console.warn(`[SafeAssetService] Skipped loading ${url} on the server`);
      return of(null);
    }
  }
  
}
