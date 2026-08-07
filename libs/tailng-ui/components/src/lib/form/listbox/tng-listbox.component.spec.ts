import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngListboxComponent } from './tng-listbox.component';

type PriorityId = 'low' | 'medium' | 'high';
type ChannelId = 'docs' | 'support' | 'team';

type PriorityOption = {
  readonly description: string;
  readonly disabled?: boolean;
  readonly id: PriorityId;
  readonly label: string;
};

type ChannelOption = {
  readonly copy: string;
  readonly key: ChannelId;
  readonly title: string;
  readonly unavailable?: boolean;
};

const PRIORITY_OPTIONS: readonly PriorityOption[] = [
  {
    id: 'low',
    label: 'Low priority',
    description: 'Queue behind roadmap and maintenance work.',
  },
  {
    id: 'medium',
    label: 'Medium priority',
    description: 'Schedule into the next planning window.',
  },
  {
    id: 'high',
    label: 'High priority',
    description: 'Promote into the current delivery sprint.',
    disabled: true,
  },
];

const CHANNEL_OPTIONS: readonly ChannelOption[] = [
  {
    key: 'docs',
    title: 'Docs',
    copy: 'Public docs synchronization and snippets.',
  },
  {
    key: 'support',
    title: 'Support',
    copy: 'Customer success and support queues.',
  },
  {
    key: 'team',
    title: 'Team updates',
    copy: 'Internal status updates.',
    unavailable: true,
  },
];

@Component({
  imports: [TngListboxComponent],
  template: `
    <tng-listbox
      data-testid="listbox"
      [ariaLabel]="ariaLabel()"
      [options]="options()"
      [value]="value()"
      (valueChange)="onValueChange($event)"
    ></tng-listbox>
  `,
})
class BasicListboxHostComponent {
  public readonly ariaLabel = signal('Priority queue');
  public readonly options = signal<readonly PriorityOption[]>(PRIORITY_OPTIONS);
  public readonly value = signal<PriorityId | null>('medium');
  public readonly changes: (PriorityId | readonly PriorityId[] | null)[] = [];

  public onValueChange(value: PriorityId | readonly PriorityId[] | null): void {
    this.changes.push(value);
    const next: PriorityId | null = Array.isArray(value) ? (value as readonly PriorityId[])[0] ?? null : (value as PriorityId | null);
    this.value.set(next);
  }
}

@Component({
  imports: [TngListboxComponent],
  template: `
    <tng-listbox
      data-testid="listbox"
      [multiple]="true"
      [options]="options()"
      [getOptionValue]="getOptionValue"
      [getOptionLabel]="getOptionLabel"
      [getOptionDescription]="getOptionDescription"
      [isOptionDisabled]="isOptionDisabled"
      [value]="value()"
      (valueChange)="onValueChange($event)"
    ></tng-listbox>
  `,
})
class MultiListboxHostComponent {
  public readonly options = signal<readonly ChannelOption[]>(CHANNEL_OPTIONS);
  public readonly value = signal<readonly ChannelId[]>(['docs']);
  public readonly changes: (readonly ChannelId[])[] = [];

  public readonly getOptionValue = (option: ChannelOption): ChannelId => option.key;
  public readonly getOptionLabel = (option: ChannelOption): string => option.title;
  public readonly getOptionDescription = (option: ChannelOption): string => option.copy;
  public readonly isOptionDisabled = (option: ChannelOption): boolean => option.unavailable === true;

  public onValueChange(value: ChannelId | readonly ChannelId[] | null): void {
    const next = value == null ? [] : Array.isArray(value) ? (value as readonly ChannelId[]) : [value as ChannelId];
    this.changes.push(next);
    this.value.set(next);
  }
}

@Component({
  imports: [TngListboxComponent],
  template: `
    <tng-listbox
      data-testid="listbox"
      [options]="options()"
      [getOptionValue]="getOptionValue"
      [getOptionLabel]="getOptionLabel"
      [getOptionDescription]="getOptionDescription"
      [isOptionDisabled]="isOptionDisabled"
      [value]="value()"
      (valueChange)="onValueChange($event)"
    >
      <ng-template #tngListboxOptionTpl let-item>
        <span class="custom-option-label">{{ item.label }}</span>
        <span class="custom-option-copy">{{ item.description }}</span>
      </ng-template>
    </tng-listbox>
  `,
})
class TemplateListboxHostComponent {
  public readonly options = signal<readonly ChannelOption[]>(CHANNEL_OPTIONS);
  public readonly value = signal<ChannelId | null>('support');

  public readonly getOptionValue = (option: ChannelOption): ChannelId => option.key;
  public readonly getOptionLabel = (option: ChannelOption): string => option.title;
  public readonly getOptionDescription = (option: ChannelOption): string => option.copy;
  public readonly isOptionDisabled = (option: ChannelOption): boolean => option.unavailable === true;

  public onValueChange(value: ChannelId | readonly ChannelId[] | null): void {
    const next: ChannelId | null = Array.isArray(value) ? (value as readonly ChannelId[])[0] ?? null : (value as ChannelId | null);
    this.value.set(next);
  }
}

@Component({
  imports: [TngListboxComponent],
  template: `
    <tng-listbox
      data-testid="listbox"
      [options]="options()"
      [multiple]="true"
      [orientation]="'horizontal'"
      [disabled]="disabled()"
      [ariaLabelledby]="labelledby()"
      [ariaDescribedBy]="describedBy()"
      [value]="value()"
      (valueChange)="onValueChange($event)"
    ></tng-listbox>
  `,
})
class HostAttrsListboxComponent {
  public readonly options = signal<readonly PriorityOption[]>(PRIORITY_OPTIONS);
  public readonly disabled = signal(false);
  public readonly labelledby = signal('  field-label  ');
  public readonly describedBy = signal('  field-help  ');
  public readonly value = signal<readonly PriorityId[]>(['medium']);
  public readonly changes: (readonly PriorityId[])[] = [];

  public onValueChange(value: PriorityId | readonly PriorityId[] | null): void {
    const next = value == null ? [] : Array.isArray(value) ? (value as readonly PriorityId[]) : [value as PriorityId];
    this.changes.push(next);
    this.value.set(next);
  }
}

@Component({
  imports: [TngListboxComponent],
  template: `
    <tng-listbox
      data-testid="listbox"
      [options]="options()"
      [value]="value()"
      (valueChange)="onValueChange($event)"
    ></tng-listbox>
  `,
})
class DynamicSingleListboxHostComponent {
  public readonly options = signal<readonly PriorityOption[]>(PRIORITY_OPTIONS);
  public readonly value = signal<PriorityId | null>('medium');
  public readonly changes: (PriorityId | null)[] = [];

  public onValueChange(value: PriorityId | readonly PriorityId[] | null): void {
    const next: PriorityId | null = Array.isArray(value) ? (value as readonly PriorityId[])[0] ?? null : (value as PriorityId | null);
    this.changes.push(next);
    this.value.set(next);
  }
}

@Component({
  imports: [TngListboxComponent],
  template: `
    <tng-listbox
      data-testid="listbox"
      [multiple]="true"
      [options]="options()"
      [getOptionValue]="getOptionValue"
      [getOptionLabel]="getOptionLabel"
      [getOptionDescription]="getOptionDescription"
      [isOptionDisabled]="isOptionDisabled"
      [value]="value()"
      (valueChange)="onValueChange($event)"
    ></tng-listbox>
  `,
})
class DynamicMultiListboxHostComponent {
  public readonly options = signal<readonly ChannelOption[]>(CHANNEL_OPTIONS);
  public readonly value = signal<readonly ChannelId[]>(['docs', 'support']);
  public readonly changes: (readonly ChannelId[])[] = [];

  public readonly getOptionValue = (option: ChannelOption): ChannelId => option.key;
  public readonly getOptionLabel = (option: ChannelOption): string => option.title;
  public readonly getOptionDescription = (option: ChannelOption): string => option.copy;
  public readonly isOptionDisabled = (option: ChannelOption): boolean => option.unavailable === true;

  public onValueChange(value: ChannelId | readonly ChannelId[] | null): void {
    const next = value == null ? [] : Array.isArray(value) ? (value as readonly ChannelId[]) : [value as ChannelId];
    this.changes.push(next);
    this.value.set(next);
  }
}

function getListboxHost(fixture: { nativeElement: HTMLElement }): HTMLElement {
  const host = fixture.nativeElement.querySelector('[data-testid="listbox"]');
  if (!(host instanceof HTMLElement)) {
    throw new Error('Expected listbox host.');
  }

  return host;
}

function getOptions(host: HTMLElement): HTMLButtonElement[] {
  return Array.from(host.querySelectorAll('.tng-listbox-option'));
}

function pointerSelect(option: HTMLButtonElement): void {
  option.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 }));
}

function focusHost(host: HTMLElement): void {
  host.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
}

function key(host: HTMLElement, keyValue: string): void {
  host.dispatchEvent(new KeyboardEvent('keydown', { key: keyValue, bubbles: true }));
}

function renderAndRegister(fixture: { detectChanges(): void }): void {
  fixture.detectChanges();
  fixture.detectChanges();
}

describe('tng-listbox component', () => {
  it('renders options and forwards host accessibility attributes', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [BasicListboxHostComponent],
    }).createComponent(BasicListboxHostComponent);

    renderAndRegister(fixture);

    const host = getListboxHost(fixture);
    const options = getOptions(host);

    expect(host.getAttribute('role')).toBe('listbox');
    expect(host.getAttribute('aria-label')).toBe('Priority queue');
    expect(host.getAttribute('tabindex')).toBe('0');
    expect(host.getAttribute('data-slot')).toBe('listbox-component');
    expect(options).toHaveLength(3);
    expect(options[0]?.textContent).toContain('Low priority');
    expect(options[0]?.textContent).toContain('Queue behind roadmap and maintenance work.');
    expect(options[1]?.hasAttribute('data-selected')).toBe(true);
    expect(options[2]?.getAttribute('aria-disabled')).toBe('true');
    expect(options[2]?.hasAttribute('disabled')).toBe(true);
  });

  it('reflects the controlled value as selected state', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [BasicListboxHostComponent],
    }).createComponent(BasicListboxHostComponent);

    renderAndRegister(fixture);

    const host = fixture.componentInstance;
    host.value.set('low');
    renderAndRegister(fixture);

    const options = getOptions(getListboxHost(fixture));
    expect(options[0]?.hasAttribute('data-selected')).toBe(true);
    expect(options[1]?.hasAttribute('data-selected')).toBe(false);
  });

  it('emits valueChange and updates selection on pointer interaction', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [BasicListboxHostComponent],
    }).createComponent(BasicListboxHostComponent);

    renderAndRegister(fixture);

    const host = fixture.componentInstance;
    const options = getOptions(getListboxHost(fixture));
    pointerSelect(options[0]);
    fixture.detectChanges();

    expect(host.changes).toEqual(['low']);
    expect(host.value()).toBe('low');
    expect(options[0]?.hasAttribute('data-selected')).toBe(true);
  });

  it('does not emit changes for disabled options', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [BasicListboxHostComponent],
    }).createComponent(BasicListboxHostComponent);

    renderAndRegister(fixture);

    const host = fixture.componentInstance;
    const options = getOptions(getListboxHost(fixture));
    pointerSelect(options[2]);
    fixture.detectChanges();

    expect(host.changes).toEqual([]);
    expect(host.value()).toBe('medium');
    expect(options[2]?.hasAttribute('data-selected')).toBe(false);
  });

  it('supports multi-select values and custom accessors', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MultiListboxHostComponent],
    }).createComponent(MultiListboxHostComponent);

    renderAndRegister(fixture);

    const host = fixture.componentInstance;
    const options = getOptions(getListboxHost(fixture));
    expect(options[0]?.hasAttribute('data-selected')).toBe(true);

    pointerSelect(options[1]);
    fixture.detectChanges();

    expect(host.changes.at(-1)).toEqual(['docs', 'support']);
    expect(host.value()).toEqual(['docs', 'support']);
    expect(options[1]?.hasAttribute('data-selected')).toBe(true);
  });

  it('preserves keyboard navigation and selection on the host element', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [BasicListboxHostComponent],
    }).createComponent(BasicListboxHostComponent);

    renderAndRegister(fixture);

    const hostCmp = fixture.componentInstance;
    const host = getListboxHost(fixture);
    focusHost(host);
    key(host, 'Enter');
    fixture.detectChanges();

    expect(hostCmp.changes.length).toBeGreaterThan(0);
    expect(hostCmp.value()).toBe('low');
    expect(getOptions(host)[0]?.hasAttribute('data-selected')).toBe(true);
  });

  it('supports typeahead selection on the host element', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MultiListboxHostComponent],
    }).createComponent(MultiListboxHostComponent);

    renderAndRegister(fixture);

    const hostCmp = fixture.componentInstance;
    const host = getListboxHost(fixture);
    focusHost(host);
    key(host, 'S');
    key(host, 'Enter');
    fixture.detectChanges();

    expect(hostCmp.changes.at(-1)).toEqual(['docs', 'support']);
    expect(getOptions(host)[1]?.hasAttribute('data-selected')).toBe(true);
  });

  it('renders a custom option template when supplied', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TemplateListboxHostComponent],
    }).createComponent(TemplateListboxHostComponent);

    renderAndRegister(fixture);

    const host = getListboxHost(fixture);
    const customLabel = host.querySelector('.custom-option-label');
    const customCopy = host.querySelector('.custom-option-copy');

    expect(customLabel?.textContent).toContain('Docs');
    expect(customCopy?.textContent).toContain('Public docs synchronization and snippets.');
  });

  it('forwards host attrs for multiple, orientation, disabled, labelledby, and describedby', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostAttrsListboxComponent],
    }).createComponent(HostAttrsListboxComponent);

    renderAndRegister(fixture);

    const hostCmp = fixture.componentInstance;
    const host = getListboxHost(fixture);

    expect(host.getAttribute('aria-multiselectable')).toBe('true');
    expect(host.getAttribute('data-orientation')).toBe('horizontal');
    expect(host.getAttribute('aria-labelledby')).toBe('field-label');
    expect(host.getAttribute('aria-describedby')).toBe('field-help');
    expect(getOptions(host)[1]?.hasAttribute('data-selected')).toBe(true);

    hostCmp.disabled.set(true);
    fixture.detectChanges();

    expect(host.getAttribute('aria-disabled')).toBe('true');
    expect(host.getAttribute('tabindex')).toBe('-1');
    pointerSelect(getOptions(host)[0]);
    fixture.detectChanges();
    expect(hostCmp.changes).toEqual([]);
  });

  it('clears the controlled value when the selected single option is removed', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DynamicSingleListboxHostComponent],
    }).createComponent(DynamicSingleListboxHostComponent);

    renderAndRegister(fixture);

    const hostCmp = fixture.componentInstance;
    hostCmp.options.set(PRIORITY_OPTIONS.filter((option) => option.id !== 'medium'));
    fixture.detectChanges();

    expect(hostCmp.changes.at(-1)).toBeNull();
    expect(hostCmp.value()).toBeNull();
    expect(getOptions(getListboxHost(fixture))).toHaveLength(2);
  });

  it('filters removed values out of multi-select state', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DynamicMultiListboxHostComponent],
    }).createComponent(DynamicMultiListboxHostComponent);

    renderAndRegister(fixture);

    const hostCmp = fixture.componentInstance;
    hostCmp.options.set(CHANNEL_OPTIONS.filter((option) => option.key !== 'support'));
    fixture.detectChanges();

    expect(hostCmp.changes.at(-1)).toEqual(['docs']);
    expect(hostCmp.value()).toEqual(['docs']);
    const options = getOptions(getListboxHost(fixture));
    expect(options).toHaveLength(2);
    expect(options[0]?.hasAttribute('data-selected')).toBe(true);
    expect(options[1]?.hasAttribute('data-selected')).toBe(false);
  });
});
