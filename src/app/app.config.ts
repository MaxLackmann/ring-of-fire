import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'ringoffire-f1f45',
        appId: '1:606980940573:web:2c26525d17880fd050f7f4',
        storageBucket: 'ringoffire-f1f45.appspot.com',
        apiKey: 'AIzaSyDmEjZ3TzgeywUg7gcVFZ7vgHwVbFT3wvg',
        authDomain: 'ringoffire-f1f45.firebaseapp.com',
        messagingSenderId: '606980940573',
      })
    ),
    provideFirestore(() => getFirestore()),
  ],
};
