import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { readTngTextareaEventValue, TngTextareaComponent } from './tng-textarea.component';

@Component({
  imports: [TngTextareaComponent],
  styles: [
    `
      :host {
        --tng-semantic-accent-brand: rgb(37, 99, 235);
        --tng-semantic-background-surface: rgb(255, 255, 255);
        --tng-semantic-border-strong: rgb(127, 146, 170);
        --tng-semantic-focus-ring: rgb(37, 99, 235);
        --tng-semantic-foreground-muted: rgb(100, 116, 139);
        --tng-semantic-foreground-primary: rgb(31, 41, 55);
      }
    `,
  ],
  template: `<tng-textarea ariaLabel="Summary" />`,
})
class TextareaHostComponent {}

const inputThemeContractCss = readFileSync(
  join(process.cwd(), 'libs/tailng-ui/theme/src/lib/component-contracts/form/input/input.css'),
  'utf8',
);
const textareaComponentCss = readFileSync(
  join(
    process.cwd(),
    'libs/tailng-ui/components/src/lib/form/textarea/tng-textarea.component.css',
  ),
  'utf8',
);

describe('tng-textarea component', () => {
  let themeStyleElement: HTMLStyleElement | null = null;

  beforeAll(() => {
    themeStyleElement = document.createElement('style');
    themeStyleElement.textContent = `${inputThemeContractCss}\n${textareaComponentCss}`;
    document.head.appendChild(themeStyleElement);
  });

  afterAll(() => {
    themeStyleElement?.remove();
    themeStyleElement = null;
  });

  it('exports the public TngTextarea symbol', () => {
    expect(typeof TngTextareaComponent).toBe('function');
  });

  it('keeps its own border when the standalone textarea is focused', async () => {
    await TestBed.configureTestingModule({ imports: [TextareaHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(TextareaHostComponent);
    fixture.detectChanges();

    const textarea = fixture.debugElement.query(By.css('textarea'))
      .nativeElement as HTMLTextAreaElement;
    expect(textarea.getAttribute('data-slot')).toBe('input');
    expect(getComputedStyle(textarea).borderWidth).toBe('1px');

    textarea.focus();

    expect(document.activeElement).toBe(textarea);
    expect(getComputedStyle(textarea).borderWidth).toBe('1px');
    expect(getComputedStyle(textarea).borderStyle).toBe('solid');
  });

  it('reads textarea value from DOM event targets', () => {
    const element = document.createElement('textarea');
    element.value = 'long form input';

    const inputEvent = new Event('input');
    Object.defineProperty(inputEvent, 'target', { value: element });

    expect(readTngTextareaEventValue(inputEvent)).toBe('long form input');
  });

  it('returns null for non-textarea event targets', () => {
    const badEvent = new Event('input');
    Object.defineProperty(badEvent, 'target', { value: document.createElement('div') });

    expect(readTngTextareaEventValue(badEvent)).toBeNull();
  });
});
