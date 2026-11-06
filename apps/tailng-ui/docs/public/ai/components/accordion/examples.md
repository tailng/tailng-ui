---
id: "components/accordion/examples"
title: "Accordion examples"
description: "Accordion examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["accordion","layout","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/accordion/tng-accordion.component.ts","apps/tailng-ui/docs/src/app/pages/components/layout/accordion/routes.ts","apps/tailng-ui/docs/src/app/pages/components/layout/accordion/sections/examples/accordion-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/layout/accordion/sections/examples/accordion-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/layout/accordion/sections/examples/accordion-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/layout/accordion/examples"
componentGroup: "layout"
symbols: ["TngAccordionComponent","TngAccordionItemComponent","TngAccordionPanelComponent","TngAccordionTriggerComponent"]
selectors: ["tng-accordion","tng-accordion-item","tng-accordion-panel","tng-accordion-trigger"]
productId: "accordion"
section: "examples"
officialCatalog: true
generated: true
---

# Accordion examples

## Examples

Production-friendly wrapper patterns for FAQ groups, settings clusters, and disabled sections.

### accordion-examples-faq-plain-css.component.ts

```ts
import { Component } from '@angular/core';
import {
  TngAccordionComponent,
  TngAccordionItemComponent,
  TngAccordionPanelComponent,
  TngAccordionTriggerComponent,
} from '@tailng-ui/components';

@Component({
  selector: 'app-accordion-examples-faq-plain-css',
  standalone: true,
  imports: [
    TngAccordionComponent,
    TngAccordionItemComponent,
    TngAccordionTriggerComponent,
    TngAccordionPanelComponent,
  ],
  templateUrl: './accordion-examples-faq-plain-css.component.html',
  styleUrl: './accordion-examples-faq-plain-css.component.css',
})
export class AccordionExamplesFaqPlainCssComponent {}
```

### accordion-examples-faq-plain-css.component.html

```html
<div class="accordion-example-shell accordion-example-shell--plain">
  <tng-accordion ariaLabel="Project FAQ" [defaultValue]="'timeline'">
    <tng-accordion-item value="timeline">
      <tng-accordion-trigger class="accordion-example-trigger">Timeline</tng-accordion-trigger>
      <tng-accordion-panel class="accordion-example-panel">Roadmap and release cadence.</tng-accordion-panel>
    </tng-accordion-item>
    <tng-accordion-item value="governance">
      <tng-accordion-trigger class="accordion-example-trigger">Governance</tng-accordion-trigger>
      <tng-accordion-panel class="accordion-example-panel">Contribution and review policy.</tng-accordion-panel>
    </tng-accordion-item>
  </tng-accordion>
</div>
```

### accordion-examples-faq-plain-css.component.css

```css
.accordion-example-panel {
  color: var(--tng-semantic-foreground-secondary);
}
```

### accordion-examples-faq-tailwind.component.ts

```ts
import { Component } from '@angular/core';
import {
  TngAccordionComponent,
  TngAccordionItemComponent,
  TngAccordionPanelComponent,
  TngAccordionTriggerComponent,
} from '@tailng-ui/components';

@Component({
  selector: 'app-accordion-examples-faq-tailwind',
  standalone: true,
  imports: [
    TngAccordionComponent,
    TngAccordionItemComponent,
    TngAccordionTriggerComponent,
    TngAccordionPanelComponent,
  ],
  templateUrl: './accordion-examples-faq-tailwind.component.html',
  styleUrl: './accordion-examples-faq-tailwind.component.css',
})
export class AccordionExamplesFaqTailwindComponent {}
```

### accordion-examples-faq-tailwind.component.html

```html
<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
  <tng-accordion ariaLabel="Project FAQ" [defaultValue]="'release'">
    <tng-accordion-item value="release">
      <tng-accordion-trigger class="accordion-example-trigger font-medium text-slate-900 dark:text-slate-100">
        Release model
      </tng-accordion-trigger>
      <tng-accordion-panel class="accordion-example-panel text-slate-700 dark:text-slate-300">
        Weekly patch and monthly minor cadence.
      </tng-accordion-panel>
    </tng-accordion-item>
    <tng-accordion-item value="quality">
      <tng-accordion-trigger class="accordion-example-trigger font-medium text-slate-900 dark:text-slate-100">
        Quality gates
      </tng-accordion-trigger>
      <tng-accordion-panel class="accordion-example-panel text-slate-700 dark:text-slate-300">
        Tests and lint pass before merge.
      </tng-accordion-panel>
    </tng-accordion-item>
  </tng-accordion>
</div>
```

### accordion-examples-faq-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```

### accordion-examples-settings-plain-css.component.ts

```ts
import { Component } from '@angular/core';
import {
  TngAccordionComponent,
  TngAccordionItemComponent,
  TngAccordionPanelComponent,
  TngAccordionTriggerComponent,
} from '@tailng-ui/components';

@Component({
  selector: 'app-accordion-examples-settings-plain-css',
  standalone: true,
  imports: [
    TngAccordionComponent,
    TngAccordionItemComponent,
    TngAccordionTriggerComponent,
    TngAccordionPanelComponent,
  ],
  templateUrl: './accordion-examples-settings-plain-css.component.html',
  styleUrl: './accordion-examples-settings-plain-css.component.css',
})
export class AccordionExamplesSettingsPlainCssComponent {}
```

### accordion-examples-settings-plain-css.component.html

```html
<div class="accordion-example-shell accordion-example-shell--plain">
  <tng-accordion type="multiple" [defaultValue]="['alerts']" ariaLabel="System settings">
    <tng-accordion-item value="alerts">
      <tng-accordion-trigger class="accordion-example-trigger">Alerts</tng-accordion-trigger>
      <tng-accordion-panel class="accordion-example-panel">PagerDuty, email, and Slack routing.</tng-accordion-panel>
    </tng-accordion-item>
    <tng-accordion-item value="audits">
      <tng-accordion-trigger class="accordion-example-trigger">Audits</tng-accordion-trigger>
      <tng-accordion-panel class="accordion-example-panel">Retention and export scheduling.</tng-accordion-panel>
    </tng-accordion-item>
    <tng-accordion-item value="billing" disabled>
      <tng-accordion-trigger class="accordion-example-trigger">Billing (disabled)</tng-accordion-trigger>
      <tng-accordion-panel class="accordion-example-panel">Disabled sections stay locked.</tng-accordion-panel>
    </tng-accordion-item>
  </tng-accordion>
</div>
```

### accordion-examples-settings-plain-css.component.css

```css
tng-accordion-item[disabled] {
  opacity: 0.65;
}
```

### accordion-examples-settings-tailwind.component.ts

```ts
import { Component } from '@angular/core';
import {
  TngAccordionComponent,
  TngAccordionItemComponent,
  TngAccordionPanelComponent,
  TngAccordionTriggerComponent,
} from '@tailng-ui/components';

@Component({
  selector: 'app-accordion-examples-settings-tailwind',
  standalone: true,
  imports: [
    TngAccordionComponent,
    TngAccordionItemComponent,
    TngAccordionTriggerComponent,
    TngAccordionPanelComponent,
  ],
  templateUrl: './accordion-examples-settings-tailwind.component.html',
  styleUrl: './accordion-examples-settings-tailwind.component.css',
})
export class AccordionExamplesSettingsTailwindComponent {}
```

### accordion-examples-settings-tailwind.component.html

```html
<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
  <tng-accordion type="multiple" [defaultValue]="['alerts']" ariaLabel="System settings">
    <tng-accordion-item value="alerts">
      <tng-accordion-trigger class="accordion-example-trigger font-medium text-slate-900 dark:text-slate-100">
        Alerts
      </tng-accordion-trigger>
      <tng-accordion-panel class="accordion-example-panel text-slate-700 dark:text-slate-300">
        PagerDuty, email, and Slack routing.
      </tng-accordion-panel>
    </tng-accordion-item>
    <tng-accordion-item value="audits">
      <tng-accordion-trigger class="accordion-example-trigger font-medium text-slate-900 dark:text-slate-100">
        Audits
      </tng-accordion-trigger>
      <tng-accordion-panel class="accordion-example-panel text-slate-700 dark:text-slate-300">
        Retention and export scheduling.
      </tng-accordion-panel>
    </tng-accordion-item>
  </tng-accordion>
</div>
```

### accordion-examples-settings-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```
