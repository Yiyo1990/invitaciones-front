import { EnvironmentProviders, provideAppInitializer, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AuthService } from './services/auth.service';

export function provideAuthInitializer(): EnvironmentProviders {
  return provideAppInitializer(() => {
    const authService = inject(AuthService);
    return firstValueFrom(authService.initializeSession());
  });
}
