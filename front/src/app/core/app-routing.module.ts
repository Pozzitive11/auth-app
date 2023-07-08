import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from '@pages/home';
import { WelcomePageComponent } from '@pages/welcome';
import { RegistrationPageComponent } from '@pages/registration';
import { LoginPageComponent } from '@pages/login';
import { NotFoundPageComponent } from '@pages/not-found';
import { AuthGuard } from '@modules/auth';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  {
    path: 'welcome',
    component: WelcomePageComponent,
    canActivate: [AuthGuard],
  },
  { path: 'registration', component: RegistrationPageComponent },
  { path: 'login', component: LoginPageComponent },
  {
    path: 'not-found',
    component: NotFoundPageComponent,
    data: { message: 'Page not found!' },
  },
  { path: '**', redirectTo: '/not-found', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
