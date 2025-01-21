import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./components/admin/alogin/alogin.component').then((c) => c.AloginComponent),
  },
  {
    path: 'admin/dashboard',
    loadComponent: () =>
      import('./components/admin/adashboard/adashboard.component').then((c) => c.AdashboardComponent),
  },
  {
    path: 'support/login',
    loadComponent: () =>
      import('./components/support/slogin/slogin.component').then((c) => c.SloginComponent),
  },
  { 
    path: 'forgot-password',
    loadComponent: () =>
      import('./components/auth/forgot-password/forgot-password.component').then((c) => c.ForgotPasswordComponent) //,
  },

  {
    path: 'usersupport/dashboard',
    loadComponent: () =>
      import('./components/shared/support/support.component').then((c) => c.SupportComponent),
  },
  {
    path: 'event-organiser/dashboard',
    loadComponent: () =>
      import('./components/event-organiser/edashboard/edashboard.component').then((c) => c.EdashboardComponent),
  },
  {
    path: 'event-organiser/post-event',
    loadComponent: () =>
      import('./components/event-organiser/post-new-event/post-new-event.component').then(
        (c) => c.PostNewEventComponent
      ),
  },
  {
    path: 'events',
    loadComponent: () =>
      import('./components/shared/home-event-list/home-event-list.component').then(
        (c) => c.HomeEventListComponent
      ),
  },

  {
    path: 'support/dashboard',
    loadComponent: () =>
      import('./components/support/sdashboard/sdashboard.component').then((c) => c.SdashboardComponent),
  },
  {
    path: 'events/:id',
    loadComponent: () =>
      import('./components/event-detail/event-detail.component').then(
        (c) => c.EventDetailComponent
      ),
  },
  {
    path: 'events/seat-selection/:eventId/:scheduleId',
    loadComponent: () =>
      import('./components/seat/seat.component').then((c) => c.SeatComponent),
  },
  {
    path: 'signuphome',
    loadComponent: () =>
      import('./components/signuphome/signuphome.component').then((c) => c.SignuphomeComponent),
  },
  {
    path: ':option/register',
    loadComponent: () =>
      import('./components/auth/register/register.component').then((c) => c.RegisterComponent),
  },
  {
    path: ':option/login',
    loadComponent: () =>
      import('./components/auth/login/login.component').then((c) => c.LoginComponent),
  },
  { 
    path: 'event-organiser/edit-schedules/:id',
    loadComponent:()=>
      import('./components/event-organiser/edit-schedules/edit-schedules.component').then((c) => c.EditSchedulesComponent),
  },
  { path: '', redirectTo: 'events', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
