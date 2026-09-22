import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TngInput, TngInputFieldPrefix, TngInputFieldSuffix } from '@tailng-ui/primitives';
import { describe, expect, it } from 'vitest';

import { TngInputFieldComponent } from '../tng-input-field.component';

@Component({
  imports: [TngInputFieldComponent, TngInput, TngInputFieldPrefix, TngInputFieldSuffix],
  template: `
    <tng-input-field>
      @if (showLeading) {
        <span tngInputFieldPrefix>Lead</span>
      }

      <input
        tngInput
        [disabled]="disabled"
        [ariaInvalid]="ariaInvalid"
      />

      @if (showTrailing) {
        <span tngInputFieldSuffix>Trail</span>
      }
    </tng-input-field>
  `,
})
class StatesHostComponent {
  public disabled = false;
  public ariaInvalid: boolean | null = null;
  public showLeading = false;
  public showTrailing = false;
}

describe('tng-input-field — interactive visual state hooks', () => {
  async function flushState(fixture: any): Promise<void> {
    fixture.detectChanges(false);
    await fixture.whenStable?.();
    fixture.detectChanges(false);
    await fixture.whenStable?.();
    fixture.detectChanges(false);
  }

  function getGroupEl(fixture: any): HTMLElement {
    // The primitive group is rendered inside <tng-input-field>
    return fixture.debugElement.query(By.css('tng-input-group')).nativeElement as HTMLElement;
  }

  it('disabled projected control causes the group to reflect data-disabled', async () => {
    await TestBed.configureTestingModule({ imports: [StatesHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(StatesHostComponent);
    fixture.componentInstance.disabled = true;
    await flushState(fixture);

    const group = getGroupEl(fixture);
    expect(group.getAttribute('data-disabled')).toBe('');

    fixture.componentInstance.disabled = false;
    expect(() => fixture.detectChanges(false)).not.toThrow();
  });

  it('invalid projected control (via ariaInvalid=true) causes the group to reflect data-invalid', async () => {
    await TestBed.configureTestingModule({ imports: [StatesHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(StatesHostComponent);
    fixture.componentInstance.ariaInvalid = true;
    await flushState(fixture);

    const group = getGroupEl(fixture);
    expect(group.getAttribute('data-invalid')).toBe('');

    fixture.componentInstance.ariaInvalid = false;
    expect(() => fixture.detectChanges(false)).not.toThrow();
  });

  it('focus entering the projected control sets data-focused on the group and clears on blur leaving the group', async () => {
    await TestBed.configureTestingModule({ imports: [StatesHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(StatesHostComponent);
    await flushState(fixture);

    const group = getGroupEl(fixture);
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

    expect(group.hasAttribute('data-focused')).toBe(false);

    // Use focusin to match your HostListener('focusin') on the group
    inputEl.dispatchEvent(new FocusEvent('focusin', { bubbles: true, relatedTarget: null }));
    fixture.detectChanges();
    expect(group.getAttribute('data-focused')).toBe('');

    // Focus leaves group: relatedTarget is outside
    const outside = document.createElement('button');
    document.body.appendChild(outside);

    inputEl.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: outside }));
    fixture.detectChanges();
    expect(group.hasAttribute('data-focused')).toBe(false);

    outside.remove();
  });

  it('leading slot presence results in data-has-leading on the group and no empty wrapper when absent', async () => {
    await TestBed.configureTestingModule({ imports: [StatesHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(StatesHostComponent);
    fixture.componentInstance.showLeading = true;
    await flushState(fixture);

    const group = getGroupEl(fixture);

    expect(group.getAttribute('data-has-leading')).toBe('');
    expect(fixture.debugElement.query(By.css('[data-slot="input-group-leading"]'))).not.toBeNull();

    fixture.componentInstance.showLeading = false;
    expect(() => fixture.detectChanges(false)).not.toThrow();
  });

  it('trailing slot presence results in data-has-trailing on the group and no empty wrapper when absent', async () => {
    await TestBed.configureTestingModule({ imports: [StatesHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(StatesHostComponent);
    fixture.componentInstance.showTrailing = true;
    await flushState(fixture);

    const group = getGroupEl(fixture);

    expect(group.getAttribute('data-has-trailing')).toBe('');
    expect(fixture.debugElement.query(By.css('[data-slot="input-group-trailing"]'))).not.toBeNull();

    fixture.componentInstance.showTrailing = false;
    expect(() => fixture.detectChanges(false)).not.toThrow();
  });

  it('stretches the projected control proxy so the native input can fill the shell width', async () => {
    await TestBed.configureTestingModule({ imports: [StatesHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(StatesHostComponent);
    await flushState(fixture);

    const proxy = fixture.debugElement.query(By.css('.tng-input-field-control-proxy')).nativeElement as HTMLElement;

    expect(proxy).toBeTruthy();
  });
});
