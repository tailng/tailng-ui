import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { provideAppInitializer, inject } from '@angular/core';
import { bootstrapAlarm, bootstrapBell, bootstrapCheck2Circle, bootstrapClipboard, 
  bootstrapFunnel, bootstrapSearch, bootstrapCopy, 
  bootstrapArrowUp,
  bootstrapArrowDown,
  bootstrapClock} from '@ng-icons/bootstrap-icons';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { DemoShikiHighlighterService } from './app/shared/demo-shiki-highlighter.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideIcons({
      bootstrapAlarm,
      bootstrapBell,
      bootstrapFunnel,
      bootstrapSearch,
      bootstrapClipboard,
      bootstrapCheck2Circle,
      bootstrapCopy,
      bootstrapArrowUp,
      bootstrapArrowDown,
      bootstrapClock
    }),

    provideAppInitializer(() => {
      const shiki = inject(DemoShikiHighlighterService);
      return shiki.init(); // can return Promise<void>
    }),
  ],
}).catch((err) => console.error(err));