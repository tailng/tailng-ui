import type { RegistryItem } from '../registry.types';

const cardPrimitiveTsTemplate = `import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngCard]',
  exportAs: 'tngCard',
})
export class TngCardPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'card' as const;
}

@Directive({
  selector: '[tngCardHeader]',
  exportAs: 'tngCardHeader',
})
export class TngCardHeaderPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'card-header' as const;
}

@Directive({
  selector: '[tngCardTitle]',
  exportAs: 'tngCardTitle',
})
export class TngCardTitlePrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'card-title' as const;
}

@Directive({
  selector: '[tngCardDescription]',
  exportAs: 'tngCardDescription',
})
export class TngCardDescriptionPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'card-description' as const;
}

@Directive({
  selector: '[tngCardContent]',
  exportAs: 'tngCardContent',
})
export class TngCardContentPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'card-content' as const;
}

@Directive({
  selector: '[tngCardFooter]',
  exportAs: 'tngCardFooter',
})
export class TngCardFooterPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'card-footer' as const;
}
`;

const cardComponentTsTemplate = `import { Component } from '@angular/core';
import {
  TngCardContentPrimitive,
  TngCardDescriptionPrimitive,
  TngCardFooterPrimitive,
  TngCardHeaderPrimitive,
  TngCardPrimitive,
  TngCardTitlePrimitive,
} from './tng-card-primitive';

@Component({
  selector: 'tng-card',
  imports: [TngCardPrimitive],
  templateUrl: './tng-card.html',
  styleUrl: './tng-card.css',
})
export class TngCard {
}

@Component({
  selector: 'tng-card-header',
  imports: [TngCardHeaderPrimitive],
  templateUrl: './tng-card-header.html',
  styleUrl: './tng-card.css',
})
export class TngCardHeader {
}

@Component({
  selector: 'tng-card-title',
  imports: [TngCardTitlePrimitive],
  templateUrl: './tng-card-title.html',
  styleUrl: './tng-card.css',
})
export class TngCardTitle {
}

@Component({
  selector: 'tng-card-description',
  imports: [TngCardDescriptionPrimitive],
  templateUrl: './tng-card-description.html',
  styleUrl: './tng-card.css',
})
export class TngCardDescription {
}

@Component({
  selector: 'tng-card-content',
  imports: [TngCardContentPrimitive],
  templateUrl: './tng-card-content.html',
  styleUrl: './tng-card.css',
})
export class TngCardContent {
}

@Component({
  selector: 'tng-card-footer',
  imports: [TngCardFooterPrimitive],
  templateUrl: './tng-card-footer.html',
  styleUrl: './tng-card.css',
})
export class TngCardFooter {
}
`;

const cardTemplateHtml = `<article tngCard class="tng-card">
  <ng-content />
</article>
`;

const cardHeaderTemplateHtml = `<header tngCardHeader class="tng-card-header">
  <ng-content />
</header>
`;

const cardTitleTemplateHtml = `<h3 tngCardTitle class="tng-card-title">
  <ng-content />
</h3>
`;

const cardDescriptionTemplateHtml = `<p tngCardDescription class="tng-card-description">
  <ng-content />
</p>
`;

const cardContentTemplateHtml = `<section tngCardContent class="tng-card-content">
  <ng-content />
</section>
`;

const cardFooterTemplateHtml = `<footer tngCardFooter class="tng-card-footer">
  <ng-content />
</footer>
`;

const cardTemplateCss = `:host {
  display: block;
}

.tng-card {
  background: var(--tng-semantic-background-surface, #ffffff);
  border: 1px solid var(--tng-semantic-border-strong, #64748b);
  border-radius: 1rem;
  color: var(--tng-semantic-foreground-primary, #0f172a);
  display: grid;
  gap: 1rem;
  padding: 1rem;
}

.tng-card-header {
  display: grid;
  gap: 0.35rem;
}

.tng-card-title {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
}

.tng-card-description {
  color: var(--tng-semantic-foreground-muted, #64748b);
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
}

.tng-card-content {
  display: grid;
  gap: 0.75rem;
}

.tng-card-footer {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: flex-end;
}
`;

const cardIndexTsTemplate = `export * from './tng-card';
export * from './tng-card-primitive';
`;

export const cardRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for card primitives and styled wrappers.',
  install: {
    importPath: './tailng-ui/card',
    importSymbols: [
      'TngCard',
      'TngCardHeader',
      'TngCardTitle',
      'TngCardDescription',
      'TngCardContent',
      'TngCardFooter',
      'TngCardPrimitive',
      'TngCardHeaderPrimitive',
      'TngCardTitlePrimitive',
      'TngCardDescriptionPrimitive',
      'TngCardContentPrimitive',
      'TngCardFooterPrimitive',
    ],
  },
  files: [
    {
      content: cardPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/card/tng-card-primitive.ts',
    },
    {
      content: cardComponentTsTemplate,
      path: 'src/app/tailng-ui/card/tng-card.ts',
    },
    {
      content: cardTemplateHtml,
      path: 'src/app/tailng-ui/card/tng-card.html',
    },
    {
      content: cardHeaderTemplateHtml,
      path: 'src/app/tailng-ui/card/tng-card-header.html',
    },
    {
      content: cardTitleTemplateHtml,
      path: 'src/app/tailng-ui/card/tng-card-title.html',
    },
    {
      content: cardDescriptionTemplateHtml,
      path: 'src/app/tailng-ui/card/tng-card-description.html',
    },
    {
      content: cardContentTemplateHtml,
      path: 'src/app/tailng-ui/card/tng-card-content.html',
    },
    {
      content: cardFooterTemplateHtml,
      path: 'src/app/tailng-ui/card/tng-card-footer.html',
    },
    {
      content: cardTemplateCss,
      path: 'src/app/tailng-ui/card/tng-card.css',
    },
    {
      content: cardIndexTsTemplate,
      path: 'src/app/tailng-ui/card/index.ts',
    },
  ],
  name: 'card',
} satisfies RegistryItem;
