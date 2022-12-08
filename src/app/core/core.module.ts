import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './modules/home/home.component';
import { LoginComponent } from './auth/login/login.component';

@NgModule({
  declarations: [HomeComponent, LoginComponent],
  imports: [CommonModule],
  exports: [HomeComponent, LoginComponent],
})
export class CoreModule {}
