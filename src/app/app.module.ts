import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TestMapComponent } from './map/main-map.component';

import { RestService } from './rest.service';
import { HttpClientModule } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    TestMapComponent,
  ],
  imports: [
    NgbModule,
    HttpClientModule,
    BrowserModule,
    GoogleMapsModule,
    AppRoutingModule,
    FormsModule
  ],
  entryComponents: [
  ],
  providers: [
    RestService,
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
