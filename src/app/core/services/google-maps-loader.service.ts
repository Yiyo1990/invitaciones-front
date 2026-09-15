import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

declare global {
  interface Window {
    google?: typeof google;
  }
}

/**
 * Loads the Google Maps JavaScript API once (Maps + Places).
 * Does not log the API key.
 */
@Injectable({ providedIn: 'root' })
export class GoogleMapsLoaderService {
  private loadPromise: Promise<typeof google> | null = null;

  hasApiKey(): boolean {
    return !!environment.googleMapsApiKey?.trim();
  }

  load(): Promise<typeof google> {
    if (typeof window !== 'undefined' && window.google?.maps) {
      return Promise.resolve(window.google);
    }

    if (!this.hasApiKey()) {
      return Promise.reject(new Error('GOOGLE_MAPS_API_KEY_MISSING'));
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = new Promise<typeof google>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>('script[data-google-maps]');
      if (existing) {
        existing.addEventListener('load', () => {
          if (window.google?.maps) {
            resolve(window.google);
          } else {
            reject(new Error('GOOGLE_MAPS_LOAD_FAILED'));
          }
        });
        existing.addEventListener('error', () => reject(new Error('GOOGLE_MAPS_LOAD_FAILED')));
        return;
      }

      const script = document.createElement('script');
      script.dataset['googleMaps'] = 'true';
      script.async = true;
      script.defer = true;
      const key = environment.googleMapsApiKey.trim();
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places&v=weekly&loading=async`;
      script.onload = () => {
        if (window.google?.maps) {
          resolve(window.google);
        } else {
          reject(new Error('GOOGLE_MAPS_LOAD_FAILED'));
        }
      };
      script.onerror = () => reject(new Error('GOOGLE_MAPS_LOAD_FAILED'));
      document.head.appendChild(script);
    });

    return this.loadPromise;
  }
}
