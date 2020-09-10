import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FileSaverModule} from 'ngx-filesaver';

import { AppComponent } from './app.component';
import { FileReaderComponent } from './file-reader/file-reader.component';

@NgModule({
  declarations: [
    AppComponent,
    FileReaderComponent
  ],
  imports: [
    BrowserModule,
    FileSaverModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
