import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';

type SeoData = { title?: string; description?: string };

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  init(): void {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        const data = this.getDeepestData(this.route) as SeoData | undefined;
        if (data?.title) this.title.setTitle(data.title);
        if (data?.description) this.meta.updateTag({ name: 'description', content: data.description });
      });
  }

  private getDeepestData(route: ActivatedRoute): unknown {
    let r: ActivatedRoute | null = route;
    while (r?.firstChild) r = r.firstChild;
    return r?.snapshot.data;
  }
}
