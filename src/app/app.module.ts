import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectModule } from '@angular/material/select';
import { ParentComponent } from './parent/parent.component';
import { CustomMatSelectNotDependentComponent } from './shared/custom-mat-select-not-dependent/custom-mat-select-not-dependent.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectInfiniteScrollModule } from 'ng-mat-select-infinite-scroll';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    NgxMatSelectSearchModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSelectInfiniteScrollModule,
    MatInputModule,
  ],
  declarations: [
    AppComponent,
    ParentComponent,
    CustomMatSelectNotDependentComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
