import { Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngSelect, TngSlotMap, TngSelectSlot } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-select-styling',
  templateUrl: './select-styling.component.html',
  imports: [
    ReactiveFormsModule,
    TngSelect,
    TngTag,
    ExampleBlockComponent,
    TngExampleDemo,
  ],
})
export class SelectStylingComponent {
  fruits = ['Apple', 'Banana', 'Cherry'];
  form = new FormGroup({
    fruit: new FormControl<string | null>(null),
  });
  displayFruit = (v: string) => v;

  // Slot examples
  containerSlot: TngSlotMap<TngSelectSlot> = {
    container: 'max-w-xs',
  };

  triggerButtonSlot: TngSlotMap<TngSelectSlot> = {
    triggerButton: 'w-full flex items-center justify-between border-2 border-primary rounded-lg px-4 py-2 text-sm bg-bg text-fg focus:ring-2 focus:ring-primary',
  };

  triggerValueSlot: TngSlotMap<TngSelectSlot> = {
    triggerValue: 'truncate text-left font-semibold text-primary',
  };

  triggerPlaceholderSlot: TngSlotMap<TngSelectSlot> = {
    triggerPlaceholder: 'text-disable italic',
  };

  triggerIconSlot: TngSlotMap<TngSelectSlot> = {
    triggerIcon: 'ml-2 text-primary text-lg',
  };

  overlayPanelSlot: TngSlotMap<TngSelectSlot> = {
    overlayPanel: 'rounded-xl border-2 border-primary shadow-xl',
  };

  optionListContainerSlot: TngSlotMap<TngSelectSlot> = {
    optionListContainer: 'p-2 space-y-0.5',
  };

  optionSlot: TngSlotMap<TngSelectSlot> = {
    option: 'px-3 py-2 rounded-md cursor-pointer',
  };

  optionActiveSlot: TngSlotMap<TngSelectSlot> = {
    optionActive: 'bg-primary text-on-primary font-semibold',
  };

  optionInactiveSlot: TngSlotMap<TngSelectSlot> = {
    optionInactive: 'hover:bg-primary/10 text-fg',
  };

  optionListEmptySlot: TngSlotMap<TngSelectSlot> = {
    optionListContainer: 'p-2',
    optionListEmpty: 'px-3 py-4 text-center text-disable text-sm',
  };

  // HTML examples
  readonly containerSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-select formControlName="fruit" [options]="fruits" [displayWith]="displayFruit"
    [slot]="{ container: 'max-w-xs' }" />
</form>
`,
  );

  readonly containerSlotTs = computed(
    () => `
import { TngSelect, TngSlotMap, TngSelectSlot } from '@tailng-ui/ui/form';

slot: TngSlotMap<TngSelectSlot> = { container: 'max-w-xs' };
`,
  );

  readonly triggerButtonSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-select formControlName="fruit" [options]="fruits" [displayWith]="displayFruit"
    [slot]="{ triggerButton: 'w-full flex items-center justify-between border-2 border-primary rounded-lg px-4 py-2' }" />
</form>
`,
  );

  readonly triggerButtonSlotTs = computed(
    () => `
import { TngSelect, TngSlotMap, TngSelectSlot } from '@tailng-ui/ui/form';

slot: TngSlotMap<TngSelectSlot> = {
  triggerButton: 'w-full flex items-center justify-between border-2 border-primary rounded-lg px-4 py-2',
};
`,
  );

  readonly triggerValueSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-select formControlName="fruit" [options]="fruits" [displayWith]="displayFruit"
    [slot]="{ triggerValue: 'truncate text-left font-semibold text-primary' }" />
</form>
`,
  );

  readonly triggerValueSlotTs = computed(
    () => `
slot: TngSlotMap<TngSelectSlot> = {
  triggerValue: 'truncate text-left font-semibold text-primary',
};
`,
  );

  readonly triggerPlaceholderSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-select formControlName="fruit" [options]="fruits" [displayWith]="displayFruit"
    placeholder="Choose…" [slot]="{ triggerPlaceholder: 'text-disable italic' }" />
</form>
`,
  );

  readonly triggerPlaceholderSlotTs = computed(
    () => `slot: TngSlotMap<TngSelectSlot> = { triggerPlaceholder: 'text-disable italic' };`,
  );

  readonly triggerIconSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-select formControlName="fruit" [options]="fruits" [displayWith]="displayFruit"
    [slot]="{ triggerIcon: 'ml-2 text-primary text-lg' }" />
</form>
`,
  );

  readonly triggerIconSlotTs = computed(
    () => `slot: TngSlotMap<TngSelectSlot> = { triggerIcon: 'ml-2 text-primary text-lg' };`,
  );

  readonly overlayPanelSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-select formControlName="fruit" [options]="fruits" [displayWith]="displayFruit"
    [slot]="{ overlayPanel: 'rounded-xl border-2 border-primary shadow-xl' }" />
</form>
`,
  );

  readonly overlayPanelSlotTs = computed(
    () => `slot: TngSlotMap<TngSelectSlot> = { overlayPanel: 'rounded-xl border-2 border-primary shadow-xl' };`,
  );

  readonly optionSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-select formControlName="fruit" [options]="fruits" [displayWith]="displayFruit"
    [slot]="{ option: 'px-3 py-2 rounded-md cursor-pointer' }" />
</form>
`,
  );

  readonly optionSlotTs = computed(
    () => `slot: TngSlotMap<TngSelectSlot> = { option: 'px-3 py-2 rounded-md cursor-pointer' };`,
  );

  readonly optionActiveSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-select formControlName="fruit" [options]="fruits" [displayWith]="displayFruit"
    [slot]="{ optionActive: 'bg-primary text-on-primary font-semibold' }" />
</form>
`,
  );

  readonly optionActiveSlotTs = computed(
    () => `slot: TngSlotMap<TngSelectSlot> = { optionActive: 'bg-primary text-on-primary font-semibold' };`,
  );

  readonly optionListSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-select formControlName="fruit" [options]="[]" [displayWith]="displayFruit"
    [slot]="{ optionListContainer: 'p-2', optionListEmpty: 'px-3 py-4 text-center text-disable text-sm' }" />
</form>
`,
  );

  readonly optionListSlotTs = computed(
    () => `slot: TngSlotMap<TngSelectSlot> = {
  optionListContainer: 'p-2',
  optionListEmpty: 'px-3 py-4 text-center text-disable text-sm',
};`,
  );

  readonly combinedSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-select formControlName="fruit" [options]="fruits" [displayWith]="displayFruit"
    [slot]="{
      triggerButton: 'border-2 border-primary',
      overlayPanel: 'rounded-xl border-primary',
      optionActive: 'bg-primary text-on-primary'
    }" />
</form>
`,
  );
}
