import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { AutocompleteExamplesPageComponent } from './autocomplete-examples-page.component';

describe('AutocompleteExamplesPageComponent', () => {
  let fixture: ComponentFixture<AutocompleteExamplesPageComponent>;

  async function renderPage(): Promise<void> {
    TestBed.configureTestingModule({
      imports: [AutocompleteExamplesPageComponent],
    });

    fixture = TestBed.createComponent(AutocompleteExamplesPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('keeps each country example independent while editing with Backspace', async () => {
    await renderPage();

    const countryInputs = Array.from(
      fixture.nativeElement.querySelectorAll<HTMLInputElement>(
        'input[data-slot="autocomplete-trigger"][aria-label="Country directory"]',
      ),
    );

    expect(countryInputs).toHaveLength(3);
    expect(countryInputs.map((input) => input.value)).toEqual(['Japan', 'Norway', 'Switzerland']);

    countryInputs[0].focus();
    countryInputs[0].value = 'Japa';
    countryInputs[0].dispatchEvent(new InputEvent('input', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(countryInputs[0].value).toBe('Japa');
    expect(countryInputs[1].value).toBe('Norway');
    expect(countryInputs[2].value).toBe('Switzerland');
  });
});
