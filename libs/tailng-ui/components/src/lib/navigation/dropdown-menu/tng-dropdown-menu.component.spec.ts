import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TngDropdownMenuComponent } from './tng-dropdown-menu.component';

@Component({
  imports: [TngDropdownMenuComponent],
  template: `
    <tng-dropdown-menu label="Actions">
      <li role="menuitem">Archive</li>
    </tng-dropdown-menu>
  `,
})
class HostComponent {}

describe('tng-dropdown-menu component', () => {
  it('exports the dropdown-menu component', () => {
    expect(typeof TngDropdownMenuComponent).toBe('function');
  });

  it('closes when the page scrolls while open', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="menu"]')).not.toBeNull();

    window.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="menu"]')).toBeNull();
  });

  it('keeps the closing panel inert until its exit animation completes', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    const panel = fixture.nativeElement.querySelector('[role="menu"]') as HTMLElement;
    panel.style.animationName = 'test-dropdown-menu-exit';
    panel.style.animationDuration = '10s';
    panel.style.animationDelay = '0s';

    window.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="menu"]')).toBe(panel);
    expect(panel.getAttribute('data-presence')).toBe('exiting');
    expect(panel.getAttribute('aria-hidden')).toBe('true');
    expect(panel.hasAttribute('inert')).toBe(true);

    panel.dispatchEvent(new Event('animationend', { bubbles: true }));
    await Promise.resolve();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="menu"]')).toBeNull();
  });
});
