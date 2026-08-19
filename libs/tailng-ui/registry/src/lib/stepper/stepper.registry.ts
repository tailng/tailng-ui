import type { RegistryItem } from '../registry.types';

const stepperPrimitiveTsTemplate = `import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngStepper]',
  exportAs: 'tngStepper',
})
export class TngStepperPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'stepper' as const;
}
`;

const stepperComponentTsTemplate = `import { Component, input } from '@angular/core';
import { TngStepperPrimitive } from './tng-stepper-primitive';

@Component({
  selector: 'tng-stepper',
  imports: [TngStepperPrimitive],
  templateUrl: './tng-stepper.html',
  styleUrl: './tng-stepper.css',
})
export class TngStepper {
  public readonly ariaLabel = input<string>('Stepper');
}
`;

const stepperTemplateHtml = `<section tngStepper class="tng-stepper" [attr.aria-label]="ariaLabel()">
  <ng-content />
</section>
`;

const stepperTemplateCss = `:host {
  display: block;
}

.tng-stepper {
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  display: grid;
  gap: 0.5rem;
  padding: 0.9rem 1rem;
}
`;

const stepperIndexTsTemplate = `export * from './tng-stepper';
export * from './tng-stepper-primitive';
`;

export const stepperRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for stepper primitive and styled wrapper.',
  install: {
    importPath: './tailng-ui/stepper',
    importSymbols: ['TngStepper', 'TngStepperPrimitive'],
  },
  files: [
    {
      content: stepperPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/stepper/tng-stepper-primitive.ts',
    },
    {
      content: stepperComponentTsTemplate,
      path: 'src/app/tailng-ui/stepper/tng-stepper.ts',
    },
    {
      content: stepperTemplateHtml,
      path: 'src/app/tailng-ui/stepper/tng-stepper.html',
    },
    {
      content: stepperTemplateCss,
      path: 'src/app/tailng-ui/stepper/tng-stepper.css',
    },
    {
      content: stepperIndexTsTemplate,
      path: 'src/app/tailng-ui/stepper/index.ts',
    },
  ],
  name: 'stepper',
} satisfies RegistryItem;
