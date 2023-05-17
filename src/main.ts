import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'zone.js';
import 'zone.js/dist/long-stack-trace-zone.js';
import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
