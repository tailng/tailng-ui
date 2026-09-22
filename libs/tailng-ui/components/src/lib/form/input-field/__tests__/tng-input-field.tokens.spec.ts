import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TngInput } from '@tailng-ui/primitives';
import { describe, expect, it } from 'vitest';

import { TngInputFieldComponent } from '../tng-input-field.component';

@Component({
  imports: [TngInputFieldComponent, TngInput],
  template: `
    <tng-input-field
      [size]="size"
      [appearance]="appearance"
      [tone]="tone"
      [fullWidth]="fullWidth"
    >
      <input tngInput />
    </tng-input-field>
  `,
})
class TokensHostComponent {
  public size: 'sm' | 'md' | 'lg' = 'md';
  public appearance: 'outline' | 'solid' | 'ghost' = 'outline';
  public tone: 'neutral' | 'primary' | 'success' | 'danger' = 'neutral';
  public fullWidth = true;
}

describe('tng-input-field — design tokens & host data attributes', () => {
  async function flush(fixture: any): Promise<void> {
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable?.();
  }

  it('applies data-size reflecting the size input', async () => {
    await TestBed.configureTestingModule({ imports: [TokensHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(TokensHostComponent);
    await flush(fixture);

    const host = fixture.debugElement.query(By.css('tng-input-field')).nativeElement as HTMLElement;
    expect(host.getAttribute('data-size')).toBe('md');
  });

  it('applies data-appearance reflecting the appearance input', async () => {
    await TestBed.configureTestingModule({ imports: [TokensHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(TokensHostComponent);
    await flush(fixture);

    const host = fixture.debugElement.query(By.css('tng-input-field')).nativeElement as HTMLElement;
    expect(host.getAttribute('data-appearance')).toBe('outline');
  });

  it('applies data-tone reflecting the tone input', async () => {
    await TestBed.configureTestingModule({ imports: [TokensHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(TokensHostComponent);
    await flush(fixture);

    const host = fixture.debugElement.query(By.css('tng-input-field')).nativeElement as HTMLElement;
    expect(host.getAttribute('data-tone')).toBe('neutral');
  });

  it('applies data-full-width when fullWidth=true and removes it when fullWidth=false', async () => {
    await TestBed.configureTestingModule({ imports: [TokensHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(TokensHostComponent);
    await flush(fixture);

    const hostCmp = fixture.componentInstance;
    const host = fixture.debugElement.query(By.css('tng-input-field')).nativeElement as HTMLElement;

    expect(host.hasAttribute('data-full-width')).toBe(true);

    hostCmp.fullWidth = false;
    await flush(fixture);
    expect(host.hasAttribute('data-full-width')).toBe(false);
  });

  it('updates token attributes when inputs change at runtime', async () => {
    await TestBed.configureTestingModule({ imports: [TokensHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(TokensHostComponent);
    await flush(fixture);

    const hostCmp = fixture.componentInstance;
    const host = fixture.debugElement.query(By.css('tng-input-field')).nativeElement as HTMLElement;

    hostCmp.size = 'lg';
    hostCmp.appearance = 'solid';
    hostCmp.tone = 'primary';
    await flush(fixture);

    expect(host.getAttribute('data-size')).toBe('lg');
    expect(host.getAttribute('data-appearance')).toBe('solid');
    expect(host.getAttribute('data-tone')).toBe('primary');
  });
});
