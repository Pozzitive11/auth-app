import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './ui';
import { AppRoutingModule } from './app-routing.module';

import { HomePageComponent } from '@pages/home';
import { RegistrationPageComponent } from '@pages/registration';
import { LoginPageComponent } from '@pages/login';
import { WelcomePageComponent } from '@pages/welcome';
import { NotFoundPageComponent } from '@pages/not-found';
import { ApiInterceptor } from '@shared/api/interceptors';
import { HeaderComponent } from '@components/header';
import { AuthEffects, authReducer } from '@modules/auth/store';
import { UserEffects, userReducer } from '@modules/user/store';
import { AuthInterceptor } from '@modules/auth';

@NgModule({
  declarations: [
    AppComponent,
    RegistrationPageComponent,
    HeaderComponent,
    LoginPageComponent,
    HomePageComponent,
    WelcomePageComponent,
    NotFoundPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    StoreModule.forRoot({ error: authReducer, user: userReducer }),
    EffectsModule.forRoot([AuthEffects, UserEffects]),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
