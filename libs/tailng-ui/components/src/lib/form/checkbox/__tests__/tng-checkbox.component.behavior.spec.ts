import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngCheckboxComponent } from '../tng-checkbox.component';

@Component({
  imports: [TngCheckboxComponent],
  template: `
    <tng-checkbox
      data-testid="checkbox"
      [checked]="checked()"
      [indeterminate]="indeterminate()"
      [disabled]="disabled()"
      [readonly]="readonly()"
      [required]="required()"
      [invalid]="invalid()"
      [name]="name()"
      [value]="value()"
      [ariaDescribedBy]="ariaDescribedBy()"
      (checkedChange)="onCheckedChange($event)"
      (indeterminateChange)="onIndeterminateChange($event)"
    >
      {{ label() }}
    </tng-checkbox>
  `,
})
class CheckboxComponentHostComponent {
  public readonly ariaDescribedBy = signal<string | null>(null);
  public readonly checked = signal(false);
  public readonly disabled = signal(false);
  public readonly indeterminate = signal(false);
  public readonly invalid = signal(false);
  public readonly label = signal('Accept terms');
  public readonly name = signal<string | null>(null);
  public readonly readonly = signal(false);
  public readonly required = signal(false);
  public readonly value = signal('on');

  public readonly checkedChanges: boolean[] = [];
  public readonly indeterminateChanges: boolean[] = [];

  public onCheckedChange(next: boolean): void {
    this.checkedChanges.push(next);
  }

  public onIndeterminateChange(next: boolean): void {
    this.indeterminateChanges.push(next);
  }
}

function queryCheckboxHost(fixture: ReturnType<typeof TestBed.createComponent>): HTMLElement {
  const host = fixture.nativeElement.querySelector('[data-testid="checkbox"]');
  if (!(host instanceof HTMLElement)) {
    throw new Error('Expected checkbox host.');
  }

  return host;
}

function queryNativeInput(host: HTMLElement): HTMLInputElement {
  const input = host.querySelector('input[type="checkbox"]');
  if (!(input instanceof HTMLInputElement)) {
    throw new Error('Expected native checkbox input.');
  }

  return input;
}

function click(el: HTMLElement): void {
  el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }));
}

describe('tng-checkbox component behavior', () => {
  it('renders projected label content', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CheckboxComponentHostComponent],
    }).createComponent(CheckboxComponentHostComponent);

    fixture.detectChanges();

    const host = queryCheckboxHost(fixture);
    const label = host.querySelector('.tng-checkbox-label');
    expect(label?.textContent?.trim()).toBe('Accept terms');
  });

  it('forwards checked/indeterminate/disabled/required to native input', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CheckboxComponentHostComponent],
    }).createComponent(CheckboxComponentHostComponent);

    fixture.componentInstance.checked.set(true);
    fixture.componentInstance.indeterminate.set(true);
    fixture.componentInstance.disabled.set(true);
    fixture.componentInstance.required.set(true);
    fixture.detectChanges();

    const input = queryNativeInput(queryCheckboxHost(fixture));
    expect(input.checked).toBe(true);
    expect(input.indeterminate).toBe(true);
    expect(input.disabled).toBe(true);
    expect(input.required).toBe(true);
  });

  it('forwards name, value, and aria-describedby', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CheckboxComponentHostComponent],
    }).createComponent(CheckboxComponentHostComponent);

    fixture.componentInstance.name.set('consent');
    fixture.componentInstance.value.set('yes');
    fixture.componentInstance.ariaDescribedBy.set('hint-id');
    fixture.detectChanges();

    const input = queryNativeInput(queryCheckboxHost(fixture));
    expect(input.getAttribute('name')).toBe('consent');
    expect(input.getAttribute('value')).toBe('yes');
    expect(input.getAttribute('aria-describedby')).toBe('hint-id');
  });

  it('emits checkedChange on input change', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CheckboxComponentHostComponent],
    }).createComponent(CheckboxComponentHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const input = queryNativeInput(queryCheckboxHost(fixture));

    input.checked = true;
    input.indeterminate = false;
    input.dispatchEvent(new Event('change', { bubbles: true }));

    expect(host.checkedChanges).toEqual([true]);
    expect(host.indeterminateChanges).toEqual([]);

    input.checked = false;
    input.indeterminate = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));

    expect(host.checkedChanges).toEqual([true, false]);
    expect(host.indeterminateChanges).toEqual([]);
  });

  it('clears mixed state and emits true when a mixed checkbox is changed', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CheckboxComponentHostComponent],
    }).createComponent(CheckboxComponentHostComponent);

    fixture.componentInstance.indeterminate.set(true);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const input = queryNativeInput(queryCheckboxHost(fixture));

    input.checked = false;
    input.indeterminate = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));

    expect(host.checkedChanges).toEqual([true]);
    expect(host.indeterminateChanges).toEqual([false]);
  });

  it('emits checkedChange on direct input click interaction', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CheckboxComponentHostComponent],
    }).createComponent(CheckboxComponentHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const input = queryNativeInput(queryCheckboxHost(fixture));

    click(input);
    fixture.detectChanges();

    expect(host.checkedChanges).toEqual([true]);
  });

  it('emits checkedChange when clicking projected label text', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CheckboxComponentHostComponent],
    }).createComponent(CheckboxComponentHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const label = queryCheckboxHost(fixture).querySelector('.tng-checkbox-label');
    expect(label).toBeTruthy();

    click(label!);
    fixture.detectChanges();

    expect(host.checkedChanges).toEqual([true]);
  });

  it('does not emit change events when readonly=true', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CheckboxComponentHostComponent],
    }).createComponent(CheckboxComponentHostComponent);

    fixture.componentInstance.readonly.set(true);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const input = queryNativeInput(queryCheckboxHost(fixture));

    input.checked = true;
    input.indeterminate = false;
    input.dispatchEvent(new Event('change', { bubbles: true }));

    expect(host.checkedChanges).toEqual([]);
    expect(host.indeterminateChanges).toEqual([]);
  });

  it('does not emit change events when disabled=true', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CheckboxComponentHostComponent],
    }).createComponent(CheckboxComponentHostComponent);

    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const input = queryNativeInput(queryCheckboxHost(fixture));

    input.checked = true;
    input.indeterminate = false;
    input.dispatchEvent(new Event('change', { bubbles: true }));

    expect(host.checkedChanges).toEqual([]);
    expect(host.indeterminateChanges).toEqual([]);
  });
});
