import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnDestroy,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GoogleMap, MapMarker } from '@angular/google-maps';

import { buildGoogleMapsUrl } from '../../../../core/models/event-location';
import { GoogleMapsLoaderService } from '../../../../core/services/google-maps-loader.service';

@Component({
  selector: 'app-location-picker',
  imports: [ReactiveFormsModule, GoogleMap, MapMarker],
  templateUrl: './location-picker.html',
  styleUrl: './location-picker.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationPickerComponent implements AfterViewInit, OnDestroy {
  private readonly mapsLoader = inject(GoogleMapsLoaderService);
  private readonly destroyRef = inject(DestroyRef);

  /** Parent event form containing venue/location controls. */
  form = input.required<FormGroup>();

  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('placesSearch');

  protected readonly mapsLoading = signal(true);
  protected readonly mapsUnavailable = signal(false);
  protected readonly mapsReady = signal(false);
  private readonly formTick = signal(0);

  private autocomplete: google.maps.places.Autocomplete | null = null;
  private placeListener: google.maps.MapsEventListener | null = null;

  protected readonly mapCenter = computed(() => {
    this.formTick();
    const lat = this.readNumber('latitude');
    const lng = this.readNumber('longitude');
    if (lat != null && lng != null) {
      return { lat, lng };
    }
    return { lat: 25.6866, lng: -100.3161 };
  });

  protected readonly hasCoordinates = computed(() => {
    this.formTick();
    return this.readNumber('latitude') != null && this.readNumber('longitude') != null;
  });

  protected readonly markerPosition = computed(() => {
    this.formTick();
    const lat = this.readNumber('latitude');
    const lng = this.readNumber('longitude');
    return lat != null && lng != null ? { lat, lng } : null;
  });

  protected readonly mapOptions: google.maps.MapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    clickableIcons: false,
  };

  ngAfterViewInit(): void {
    void this.bootstrapMaps();

    this.form()
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.formTick.update((value) => value + 1));
  }

  ngOnDestroy(): void {
    this.placeListener?.remove();
    this.autocomplete = null;
  }

  protected onMapClick(event: google.maps.MapMouseEvent | google.maps.IconMouseEvent): void {
    const latLng = event.latLng;
    if (!latLng) {
      return;
    }

    const latitude = latLng.lat();
    const longitude = latLng.lng();
    const form = this.form();
    form.get('latitude')?.setValue(latitude);
    form.get('longitude')?.setValue(longitude);
    form.get('googleMapsUrl')?.setValue(
      buildGoogleMapsUrl({
        latitude,
        longitude,
        placeId: form.get('placeId')?.value || null,
        address: form.get('venueAddress')?.value || null,
      }),
    );
    form.get('latitude')?.markAsDirty();
    form.get('longitude')?.markAsDirty();
    form.get('googleMapsUrl')?.markAsDirty();
  }

  protected clearLocation(): void {
    const form = this.form();
    form.patchValue({
      venueName: '',
      venueAddress: '',
      latitude: null,
      longitude: null,
      placeId: null,
      googleMapsUrl: null,
    });
    ['venueName', 'venueAddress', 'latitude', 'longitude', 'placeId', 'googleMapsUrl'].forEach(
      (name) => form.get(name)?.markAsDirty(),
    );

    const inputEl = this.searchInput()?.nativeElement;
    if (inputEl) {
      inputEl.value = '';
    }
  }

  private async bootstrapMaps(): Promise<void> {
    this.mapsLoading.set(true);
    this.mapsUnavailable.set(false);

    if (!this.mapsLoader.hasApiKey()) {
      this.mapsLoading.set(false);
      this.mapsUnavailable.set(true);
      return;
    }

    try {
      await this.mapsLoader.load();
      this.mapsReady.set(true);
      this.mapsLoading.set(false);
      // Wait a tick so the search input exists in the DOM.
      queueMicrotask(() => this.initAutocomplete());
    } catch {
      this.mapsLoading.set(false);
      this.mapsUnavailable.set(true);
      this.mapsReady.set(false);
    }
  }

  private initAutocomplete(): void {
    const inputEl = this.searchInput()?.nativeElement;
    if (!inputEl || !window.google?.maps?.places) {
      return;
    }

    this.placeListener?.remove();
    this.autocomplete = new google.maps.places.Autocomplete(inputEl, {
      fields: ['place_id', 'name', 'formatted_address', 'geometry', 'url'],
    });

    this.placeListener = this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete?.getPlace();
      if (!place) {
        return;
      }

      const location = place.geometry?.location;
      const latitude = location?.lat() ?? null;
      const longitude = location?.lng() ?? null;
      const venueName = place.name?.trim() || '';
      const address = place.formatted_address?.trim() || '';
      const placeId = place.place_id ?? null;
      const googleMapsUrl =
        place.url ||
        buildGoogleMapsUrl({
          latitude,
          longitude,
          placeId,
          address,
        });

      const form = this.form();
      form.patchValue({
        venueName: venueName || form.get('venueName')?.value || '',
        venueAddress: address || form.get('venueAddress')?.value || '',
        latitude,
        longitude,
        placeId,
        googleMapsUrl,
      });
      ['venueName', 'venueAddress', 'latitude', 'longitude', 'placeId', 'googleMapsUrl'].forEach(
        (name) => form.get(name)?.markAsDirty(),
      );
    });
  }

  private readNumber(controlName: string): number | null {
    const value = this.form().get(controlName)?.value;
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const parsed = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
}
