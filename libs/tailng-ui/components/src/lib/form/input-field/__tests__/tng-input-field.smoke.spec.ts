import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TngInput, TngInputFieldPrefix, TngInputFieldSuffix } from '@tailng-ui/primitives';
import { describe, expect, it } from 'vitest';

// TODO: update import paths once implemented
import { TngInputFieldComponent } from '../tng-input-field.component';

@Component({
  imports: [TngInputFieldComponent, TngInput],
  template: `
    <tng-input-field>
      <input tngInput />
    </tng-input-field>
  `,
})
class StyledSmokeHostComponent {}

@Component({
  imports: [TngInputFieldComponent, TngInput, TngInputFieldPrefix, TngInputFieldSuffix],
  template: `
    <tng-input-field>
      <span tngInputFieldPrefix>Leading</span>
      <input tngInput />
      <span tngInputFieldSuffix>Trailing</span>
    </tng-input-field>
  `,
})
class StyledSlotsHostComponent {}

describe('<tng-input-field> shell — smoke & composition', () => {
  it.skip('renders <tng-input-field> without errors with a projected <input tngInput>', async () => {
    await TestBed.configureTestingModule({ imports: [StyledSmokeHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(StyledSmokeHostComponent);
    expect(() => fixture.detectChanges()).not.toThrow();

    const input = fixture.debugElement.query(By.css('input'));
    expect(input).toBeTruthy();
  });

  it.skip('renders <tng-input-field> with both leading and trailing content without errors', async () => {
    await TestBed.configureTestingModule({ imports: [StyledSlotsHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(StyledSlotsHostComponent);
    expect(() => fixture.detectChanges()).not.toThrow();

    const host = fixture.debugElement.query(By.css('tng-input')).nativeElement as HTMLElement;
    expect(host.textContent).toContain('Leading');
    expect(host.textContent).toContain('Trailing');
  });

  it.skip('applies expected base styling class hooks on the group and control (if asserted)', async () => {
    await TestBed.configureTestingModule({ imports: [StyledSmokeHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(StyledSmokeHostComponent);
    fixture.detectChanges();

    // Example: if your component renders a group wrapper with class hooks
    const group = fixture.debugElement.query(By.css('[data-slot="input-group"]'));
    expect(group).toBeTruthy();
  });

  it.skip('does not require consumers to pass any optional styling inputs', async () => {
    await TestBed.configureTestingModule({ imports: [StyledSmokeHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(StyledSmokeHostComponent);
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});