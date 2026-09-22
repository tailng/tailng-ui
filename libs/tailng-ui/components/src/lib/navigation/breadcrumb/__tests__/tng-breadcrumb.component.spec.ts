import { Component, signal } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TngBreadcrumbItemComponent } from '../tng-breadcrumb-item.component';
import { TngBreadcrumbSeparatorTemplateDirective } from '../tng-breadcrumb-separator-template.directive';
import { TngBreadcrumbComponent } from '../tng-breadcrumb.component';

type BreadcrumbCrumb = {
  readonly current?: boolean;
  readonly currentAsLink?: boolean;
  readonly disabled?: boolean;
  readonly href?: string | null;
  readonly icon?: boolean;
  readonly id: string;
  readonly label: string;
  readonly routerLink?: string | readonly (number | string)[] | null;
};

function getByTestId<T extends Element>(fixture: ComponentFixture<unknown>, testId: string): T {
  const element = fixture.nativeElement.querySelector(`[data-testid="${testId}"]`);
  if (element === null) {
    throw new Error(`Expected element for data-testid="${testId}".`);
  }

  return element as T;
}

function queryByTestId<T extends Element>(
  fixture: ComponentFixture<unknown>,
  testId: string,
): T | null {
  return fixture.nativeElement.querySelector(`[data-testid="${testId}"]`) as T | null;
}

function getNav(fixture: ComponentFixture<unknown>, testId = 'breadcrumb'): HTMLElement {
  const breadcrumbHost = getByTestId<HTMLElement>(fixture, testId);
  const nav = breadcrumbHost.querySelector('nav');
  if (!(nav instanceof HTMLElement)) {
    throw new Error('Expected breadcrumb nav element.');
  }

  return nav;
}

function getAllVisibleListItems(fixture: ComponentFixture<unknown>): HTMLElement[] {
  const nav = getNav(fixture);
  const listItems = Array.from(nav.querySelectorAll('li'));
  return listItems.filter((item) => !item.hasAttribute('hidden'));
}

function getAriaCurrentNodes(fixture: ComponentFixture<unknown>): HTMLElement[] {
  return Array.from(getNav(fixture).querySelectorAll<HTMLElement>('[aria-current="page"]'));
}

function getVisibleCrumbLabels(fixture: ComponentFixture<unknown>): readonly string[] {
  return getAllVisibleListItems(fixture)
    .map((item) => {
      const labelNode = item.querySelector<HTMLElement>(
        '.tng-breadcrumb-item-link, .tng-breadcrumb-item-text, .tng-breadcrumb-item-ellipsis',
      );
      return labelNode?.textContent?.trim() ?? '';
    })
    .filter((label) => label.length > 0);
}

function click(element: HTMLElement): MouseEvent {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  element.dispatchEvent(event);
  return event;
}

function keydown(element: HTMLElement, key: string, shiftKey = false): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key, shiftKey });
  element.dispatchEvent(event);
  return event;
}

@Component({
  imports: [
    TngBreadcrumbComponent,
    TngBreadcrumbItemComponent,
    TngBreadcrumbSeparatorTemplateDirective,
  ],
  template: `
    <button data-testid="before-button" type="button">Before</button>

    <tng-breadcrumb
      data-testid="breadcrumb"
      class="consumer-breadcrumb"
      data-extra="extra-attr"
      [ariaLabel]="ariaLabel()"
      [collapseLabel]="collapseLabel()"
      [itemsAfterCollapse]="itemsAfterCollapse()"
      [itemsBeforeCollapse]="itemsBeforeCollapse()"
      [maxItems]="maxItems()"
      [separator]="separator()"
    >
      @if (useCustomSeparator()) {
        <ng-template tngBreadcrumbSeparatorTemplate>
          <span data-testid="custom-separator-template">|</span>
        </ng-template>
      }

      @for (crumb of crumbs(); track crumb.id) {
        <tng-breadcrumb-item
          [attr.data-testid]="'crumb-' + crumb.id"
          [current]="crumb.current ?? false"
          [currentAsLink]="crumb.currentAsLink ?? false"
          [disabled]="crumb.disabled ?? false"
          [href]="crumb.href ?? null"
          [routerLink]="crumb.routerLink ?? null"
        >
          @if (crumb.icon) {
            <span [attr.data-testid]="'crumb-icon-' + crumb.id" aria-hidden="true">★</span>
          }
          <span [attr.data-testid]="'crumb-label-' + crumb.id">{{ crumb.label }}</span>
        </tng-breadcrumb-item>
      }
    </tng-breadcrumb>

    <a data-testid="after-link" href="#after">After</a>
  `,
})
class BreadcrumbHarnessComponent {
  public readonly ariaLabel = signal<string | null>('Breadcrumb');
  public readonly collapseLabel = signal('More');
  public readonly crumbs = signal<readonly BreadcrumbCrumb[]>([
    { id: 'home', label: 'Home', href: '/home' },
    { id: 'docs', label: 'Docs', href: '/docs' },
    { id: 'breadcrumb', label: 'Breadcrumb', current: true },
  ]);
  public readonly itemsAfterCollapse = signal(2);
  public readonly itemsBeforeCollapse = signal(1);
  public readonly maxItems = signal<number | null>(null);
  public readonly separator = signal('/');
  public readonly useCustomSeparator = signal(false);
}

@Component({
  imports: [TngBreadcrumbComponent, TngBreadcrumbItemComponent],
  template: `
    <tng-breadcrumb data-testid="breadcrumb-one" [ariaLabel]="firstLabel()">
      <tng-breadcrumb-item data-testid="first-item-a" href="/alpha">Alpha</tng-breadcrumb-item>
      <tng-breadcrumb-item data-testid="first-item-b" [disabled]="true">Beta</tng-breadcrumb-item>
    </tng-breadcrumb>

    <tng-breadcrumb data-testid="breadcrumb-two" [ariaLabel]="secondLabel()">
      <tng-breadcrumb-item data-testid="second-item-a" href="/gamma">Gamma</tng-breadcrumb-item>
      <tng-breadcrumb-item data-testid="second-item-b">Delta</tng-breadcrumb-item>
    </tng-breadcrumb>
  `,
})
class MultipleBreadcrumbHarnessComponent {
  public readonly firstLabel = signal('First breadcrumb');
  public readonly secondLabel = signal('Second breadcrumb');
}

@Component({
  imports: [TngBreadcrumbComponent, TngBreadcrumbItemComponent],
  template: `
    @if (show()) {
      <tng-breadcrumb data-testid="destroyable-breadcrumb" [ariaLabel]="ariaLabel()">
        @for (crumb of crumbs(); track crumb.id) {
          <tng-breadcrumb-item
            [current]="crumb.current ?? false"
            [href]="crumb.href ?? null"
          >
            {{ crumb.label }}
          </tng-breadcrumb-item>
        }
      </tng-breadcrumb>
    }
  `,
})
class DestroyHarnessComponent {
  public readonly ariaLabel = signal('Destroy breadcrumb');
  public readonly crumbs = signal<readonly BreadcrumbCrumb[]>([
    { id: 'one', label: 'One', href: '/one' },
    { id: 'two', label: 'Two', current: true },
  ]);
  public readonly show = signal(true);
}

describe('tng-breadcrumb component behavior blocks A-L', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('A) Smoke / render', () => {
    it('renders the breadcrumb container without errors with default inputs', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);

      expect(() => fixture.detectChanges()).not.toThrow();
      expect(getNav(fixture)).toBeTruthy();
    });

    it('renders a breadcrumb with zero items without throwing', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);

      fixture.componentInstance.crumbs.set([]);
      expect(() => fixture.detectChanges()).not.toThrow();
      expect(getNav(fixture).querySelectorAll('li').length).toBe(0);
    });

    it('renders projected breadcrumb items in DOM order', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);
      fixture.detectChanges();

      expect(getVisibleCrumbLabels(fixture)).toEqual(['Home', 'Docs', 'Breadcrumb']);
    });

    it('preserves consumer-provided classes and unrelated attributes on the container host', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);
      fixture.detectChanges();

      const breadcrumbHost = getByTestId<HTMLElement>(fixture, 'breadcrumb');
      expect(breadcrumbHost.classList.contains('consumer-breadcrumb')).toBe(true);
      expect(breadcrumbHost.getAttribute('data-extra')).toBe('extra-attr');
    });
  });

  describe('B) Semantics & structure', () => {
    it('renders a nav container for the breadcrumb region', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);
      fixture.detectChanges();

      expect(getNav(fixture).tagName.toLowerCase()).toBe('nav');
    });

    it('applies aria-label="Breadcrumb" by default on the nav container', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);
      fixture.detectChanges();

      expect(getNav(fixture).getAttribute('aria-label')).toBe('Breadcrumb');
    });

    it('uses an ordered list <ol> for the breadcrumb list', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);
      fixture.detectChanges();

      expect(getNav(fixture).querySelector('ol')).toBeTruthy();
    });

    it('renders each crumb inside a list item <li>', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);
      fixture.detectChanges();

      expect(getNav(fixture).querySelectorAll('li').length).toBe(3);
    });

    it('does not introduce extra focusable elements beyond the crumb links', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);
      fixture.detectChanges();

      const focusables = Array.from(
        getNav(fixture).querySelectorAll(
          'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      );

      expect(focusables.length).toBe(2);
      expect(focusables.every((node) => node.tagName.toLowerCase() === 'a')).toBe(true);
    });
  });

  describe('C) Container API (ariaLabel, separator)', () => {
    it('uses the configured ariaLabel input when provided', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);

      fixture.componentInstance.ariaLabel.set('Product path');
      fixture.detectChanges();

      expect(getNav(fixture).getAttribute('aria-label')).toBe('Product path');
    });

    it('falls back to "Breadcrumb" when ariaLabel is null or empty', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);

      fixture.componentInstance.ariaLabel.set(null);
      fixture.detectChanges();
      expect(getNav(fixture).getAttribute('aria-label')).toBe('Breadcrumb');

      fixture.componentInstance.ariaLabel.set('   ');
      fixture.detectChanges();
      expect(getNav(fixture).getAttribute('aria-label')).toBe('Breadcrumb');
    });

    it('uses the default separator when none is provided', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);
      fixture.detectChanges();

      const separators = Array.from(
        getNav(fixture).querySelectorAll<HTMLElement>('.tng-breadcrumb-separator'),
      ).map((separator) => separator.textContent?.trim());

      expect(separators).toEqual(['/', '/']);
    });

    it('uses the configured separator string when provided', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);

      fixture.componentInstance.separator.set('>');
      fixture.detectChanges();

      const separators = Array.from(
        getNav(fixture).querySelectorAll<HTMLElement>('.tng-breadcrumb-separator'),
      ).map((separator) => separator.textContent?.trim());

      expect(separators).toEqual(['>', '>']);
    });

    it('updates separator rendering when separator input changes at runtime', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);
      fixture.detectChanges();

      fixture.componentInstance.separator.set('→');
      fixture.detectChanges();

      const separators = Array.from(
        getNav(fixture).querySelectorAll<HTMLElement>('.tng-breadcrumb-separator'),
      ).map((separator) => separator.textContent?.trim());

      expect(separators).toEqual(['→', '→']);
    });
  });

  describe('D) Items & links rendering', () => {
    it('renders an enabled breadcrumb item as a link when href is provided', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);
      fixture.detectChanges();

      const homeItem = getByTestId<HTMLElement>(fixture, 'crumb-home');
      const anchor = homeItem.querySelector('a');

      expect(anchor).toBeTruthy();
      expect(anchor?.getAttribute('href')).toBe('/home');
    });

    it('activates linked breadcrumb items on click without disabled prevention', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);
      fixture.detectChanges();

      const homeLink = getByTestId<HTMLElement>(fixture, 'crumb-home').querySelector('a');
      if (!(homeLink instanceof HTMLElement)) {
        throw new Error('Expected enabled breadcrumb link.');
      }

      const clickEvent = click(homeLink);
      expect(clickEvent.defaultPrevented).toBe(false);
    });

    it('renders a non-link breadcrumb item as plain text when no link is provided', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);
      fixture.detectChanges();

      const currentItem = getByTestId<HTMLElement>(fixture, 'crumb-breadcrumb');
      expect(currentItem.querySelector('a')).toBeNull();
      expect(currentItem.querySelector('.tng-breadcrumb-item-text')?.textContent?.trim()).toBe(
        'Breadcrumb',
      );
    });

    it('preserves projected link content inside an item', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);

      fixture.componentInstance.crumbs.set([
        { id: 'alpha', label: 'Alpha', href: '/alpha', icon: true },
        { id: 'beta', label: 'Beta', current: true },
      ]);
      fixture.detectChanges();

      const alphaItem = getByTestId<HTMLElement>(fixture, 'crumb-alpha');
      expect(alphaItem.textContent).toContain('★');
      expect(alphaItem.textContent).toContain('Alpha');
    });

    it('does not render separator after the last visible item', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);
      fixture.detectChanges();

      const visibleItems = getAllVisibleListItems(fixture);
      const lastItem = visibleItems[visibleItems.length - 1];
      expect(lastItem.querySelector('.tng-breadcrumb-separator')).toBeNull();
    });
  });

  describe('E) Current page contract (aria-current)', () => {
    it('applies aria-current="page" to exactly one item when a single item is marked current', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);
      fixture.detectChanges();

      const ariaCurrentNodes = getAriaCurrentNodes(fixture);
      expect(ariaCurrentNodes.length).toBe(1);
      expect(ariaCurrentNodes[0].textContent?.trim()).toContain('Breadcrumb');
    });

    it('does not apply aria-current when no item is marked current and there are multiple items', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);

      fixture.componentInstance.crumbs.set([
        { id: 'home', label: 'Home', href: '/home' },
        { id: 'docs', label: 'Docs', href: '/docs' },
      ]);
      fixture.detectChanges();

      expect(getAriaCurrentNodes(fixture).length).toBe(0);
    });

    it('when multiple items are current, resolves deterministically to the last current item', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);

      fixture.componentInstance.crumbs.set([
        { id: 'home', label: 'Home', current: true },
        { id: 'docs', label: 'Docs', current: true },
        { id: 'api', label: 'API', current: true },
      ]);
      fixture.detectChanges();

      const ariaCurrentNodes = getAriaCurrentNodes(fixture);
      expect(ariaCurrentNodes.length).toBe(1);
      expect(ariaCurrentNodes[0].textContent?.trim()).toContain('API');
    });

    it('renders the current item as plain text by default', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);

      fixture.componentInstance.crumbs.set([
        { id: 'home', label: 'Home', href: '/home' },
        { id: 'docs', label: 'Docs', href: '/docs', current: true },
      ]);
      fixture.detectChanges();

      const docsItem = getByTestId<HTMLElement>(fixture, 'crumb-docs');
      expect(docsItem.querySelector('a')).toBeNull();
      expect(docsItem.querySelector('[aria-current="page"]')).toBeTruthy();
    });

    it('when currentAsLink is true, keeps link rendering and still sets aria-current="page"', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);

      fixture.componentInstance.crumbs.set([
        { id: 'home', label: 'Home', href: '/home' },
        { id: 'docs', label: 'Docs', href: '/docs', current: true, currentAsLink: true },
      ]);
      fixture.detectChanges();

      const docsItem = getByTestId<HTMLElement>(fixture, 'crumb-docs');
      const docsLink = docsItem.querySelector('a');
      expect(docsLink).toBeTruthy();
      expect(docsLink?.getAttribute('aria-current')).toBe('page');
    });
  });

  describe('F) Disabled behavior', () => {
    it('renders disabled item with aria-disabled="true"', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);

      fixture.componentInstance.crumbs.set([
        { id: 'home', label: 'Home', href: '/home', disabled: true },
        { id: 'docs', label: 'Docs', current: true },
      ]);
      fixture.detectChanges();

      const homeLink = getByTestId<HTMLElement>(fixture, 'crumb-home').querySelector('a');
      expect(homeLink?.getAttribute('aria-disabled')).toBe('true');
    });

    it('disabled item does not navigate and prevents click actions', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);

      fixture.componentInstance.crumbs.set([
        { id: 'home', label: 'Home', href: '/home', disabled: true },
        { id: 'docs', label: 'Docs', current: true },
      ]);
      fixture.detectChanges();

      const homeLink = getByTestId<HTMLElement>(fixture, 'crumb-home').querySelector('a');
      if (!(homeLink instanceof HTMLElement)) {
        throw new Error('Expected disabled breadcrumb link.');
      }

      const clickEvent = click(homeLink);
      expect(clickEvent.defaultPrevented).toBe(true);
    });

    it('disabled item is removed from tab order when rendered as a link', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);

      fixture.componentInstance.crumbs.set([
        { id: 'home', label: 'Home', href: '/home', disabled: true },
        { id: 'docs', label: 'Docs', current: true },
      ]);
      fixture.detectChanges();

      const homeLink = getByTestId<HTMLElement>(fixture, 'crumb-home').querySelector('a');
      expect(homeLink?.getAttribute('tabindex')).toBe('-1');
    });

    it('applies disabled styling hook through data-disabled attribute', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);

      fixture.componentInstance.crumbs.set([
        { id: 'home', label: 'Home', href: '/home', disabled: true },
        { id: 'docs', label: 'Docs', current: true },
      ]);
      fixture.detectChanges();

      const homeItem = getByTestId<HTMLElement>(fixture, 'crumb-home').querySelector('li');
      expect(homeItem?.getAttribute('data-disabled')).toBe('true');
    });
  });

  describe('G) Separator behavior', () => {
    it('marks separator aria-hidden="true" when decorative', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);
      fixture.detectChanges();

      const separator = getNav(fixture).querySelector('.tng-breadcrumb-separator');
      expect(separator?.getAttribute('aria-hidden')).toBe('true');
    });

    it('separator does not become focusable', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);
      fixture.detectChanges();

      const separators = Array.from(
        getNav(fixture).querySelectorAll<HTMLElement>('.tng-breadcrumb-separator'),
      );
      expect(separators.every((separator) => separator.getAttribute('tabindex') === '-1')).toBe(true);
    });

    it('supports a custom separator template when provided', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);

      fixture.componentInstance.useCustomSeparator.set(true);
      fixture.detectChanges();

      expect(getNav(fixture).querySelectorAll('[data-testid="custom-separator-template"]').length).toBe(2);
    });

    it('separator placement remains stable with icon content in crumbs', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);

      fixture.componentInstance.crumbs.set([
        { id: 'alpha', label: 'Alpha', href: '/alpha', icon: true },
        { id: 'beta', label: 'Beta', href: '/beta', icon: true },
        { id: 'gamma', label: 'Gamma', current: true, icon: true },
      ]);
      fixture.detectChanges();

      const visibleItems = getAllVisibleListItems(fixture);
      expect(visibleItems[0].querySelector('.tng-breadcrumb-separator')).toBeTruthy();
      expect(visibleItems[1].querySelector('.tng-breadcrumb-separator')).toBeTruthy();
      expect(visibleItems[2].querySelector('.tng-breadcrumb-separator')).toBeNull();
    });
  });

  describe('H) Router integration', () => {
    it('renders an item using routerLink without breaking structure', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
        providers: [provideRouter([])],
      }).createComponent(BreadcrumbHarnessComponent);

      fixture.componentInstance.crumbs.set([
        { id: 'home', label: 'Home', routerLink: ['/home'] },
        { id: 'docs', label: 'Docs', current: true },
      ]);
      fixture.detectChanges();

      const homeLink = getByTestId<HTMLElement>(fixture, 'crumb-home').querySelector('a');
      expect(homeLink).toBeTruthy();
      expect(getNav(fixture).querySelectorAll('li').length).toBe(2);
    });

    it('applies aria-current correctly for a router-based current crumb', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
        providers: [provideRouter([])],
      }).createComponent(BreadcrumbHarnessComponent);

      fixture.componentInstance.crumbs.set([
        { id: 'home', label: 'Home', routerLink: ['/home'] },
        { id: 'docs', label: 'Docs', routerLink: ['/docs'], current: true, currentAsLink: true },
      ]);
      fixture.detectChanges();

      const docsLink = getByTestId<HTMLElement>(fixture, 'crumb-docs').querySelector('a');
      expect(docsLink?.getAttribute('aria-current')).toBe('page');
    });

    it('does not interfere with router navigation events for enabled items', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
        providers: [provideRouter([])],
      }).createComponent(BreadcrumbHarnessComponent);

      fixture.componentInstance.crumbs.set([
        { id: 'home', label: 'Home', routerLink: ['/home'] },
        { id: 'docs', label: 'Docs', current: true },
      ]);
      fixture.detectChanges();

      const homeLink = getByTestId<HTMLElement>(fixture, 'crumb-home').querySelector('a');
      if (!(homeLink instanceof HTMLElement)) {
        throw new Error('Expected router breadcrumb link.');
      }

      const clickEvent = click(homeLink);
      expect(clickEvent.defaultPrevented).toBe(true);
    });
  });

  describe('I) Overflow behavior — collapse middle', () => {
    it('collapses middle crumbs into an ellipsis item when item count exceeds maxItems', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);

      fixture.componentInstance.maxItems.set(4);
      fixture.componentInstance.crumbs.set([
        { id: 'home', label: 'Home', href: '/home' },
        { id: 'catalog', label: 'Catalog', href: '/catalog' },
        { id: 'mens', label: 'Mens', href: '/mens' },
        { id: 'shoes', label: 'Shoes', href: '/shoes' },
        { id: 'running', label: 'Running', current: true },
      ]);
      fixture.detectChanges();

      expect(getNav(fixture).querySelectorAll('.tng-breadcrumb-item-ellipsis').length).toBe(1);
    });

    it('applies data-collapsed on the ellipsis item when collapse mode is active', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);

      fixture.componentInstance.maxItems.set(4);
      fixture.componentInstance.crumbs.set([
        { id: 'home', label: 'Home', href: '/home' },
        { id: 'catalog', label: 'Catalog', href: '/catalog' },
        { id: 'mens', label: 'Mens', href: '/mens' },
        { id: 'shoes', label: 'Shoes', href: '/shoes' },
        { id: 'running', label: 'Running', current: true },
      ]);
      fixture.detectChanges();

      const collapsedItem = getNav(fixture).querySelector('li[data-collapsed="true"]');
      expect(collapsedItem).toBeTruthy();
      expect(collapsedItem?.querySelector('.tng-breadcrumb-item-ellipsis')).toBeTruthy();
    });

    it('preserves first crumb and last itemsAfterCollapse crumbs when collapsed', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);

      fixture.componentInstance.maxItems.set(4);
      fixture.componentInstance.itemsBeforeCollapse.set(1);
      fixture.componentInstance.itemsAfterCollapse.set(2);
      fixture.componentInstance.crumbs.set([
        { id: 'home', label: 'Home', href: '/home' },
        { id: 'catalog', label: 'Catalog', href: '/catalog' },
        { id: 'mens', label: 'Mens', href: '/mens' },
        { id: 'shoes', label: 'Shoes', href: '/shoes' },
        { id: 'running', label: 'Running', current: true },
      ]);
      fixture.detectChanges();

      const visibleTexts = getAllVisibleListItems(fixture).map((item) =>
        item
          .querySelector<HTMLElement>(
            '.tng-breadcrumb-item-link, .tng-breadcrumb-item-text, .tng-breadcrumb-item-ellipsis',
          )
          ?.textContent?.trim(),
      );

      expect(visibleTexts[0]).toContain('Home');
      expect(visibleTexts[visibleTexts.length - 2]).toContain('Shoes');
      expect(visibleTexts[visibleTexts.length - 1]).toContain('Running');
    });

    it('renders ellipsis as non-interactive by default', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);

      fixture.componentInstance.maxItems.set(4);
      fixture.componentInstance.crumbs.set([
        { id: 'home', label: 'Home', href: '/home' },
        { id: 'catalog', label: 'Catalog', href: '/catalog' },
        { id: 'mens', label: 'Mens', href: '/mens' },
        { id: 'shoes', label: 'Shoes', href: '/shoes' },
        { id: 'running', label: 'Running', current: true },
      ]);
      fixture.detectChanges();

      const ellipsisItem = getNav(fixture).querySelector('.tng-breadcrumb-item-ellipsis');
      expect(ellipsisItem?.closest('li')?.querySelector('a')).toBeNull();
    });

    it('keeps the current crumb visible when collapsing', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);

      fixture.componentInstance.maxItems.set(4);
      fixture.componentInstance.crumbs.set([
        { id: 'home', label: 'Home', href: '/home' },
        { id: 'catalog', label: 'Catalog', href: '/catalog' },
        { id: 'mens', label: 'Mens', current: true },
        { id: 'shoes', label: 'Shoes', href: '/shoes' },
        { id: 'running', label: 'Running', href: '/running' },
      ]);
      fixture.detectChanges();

      const currentNodes = getAriaCurrentNodes(fixture);
      expect(currentNodes.length).toBe(1);
      expect(currentNodes[0].textContent?.trim()).toContain('Mens');
    });

    it('updates collapsed state when items are added and removed dynamically', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);

      fixture.componentInstance.maxItems.set(4);
      fixture.componentInstance.crumbs.set([
        { id: 'a', label: 'A', href: '/a' },
        { id: 'b', label: 'B', href: '/b' },
        { id: 'c', label: 'C', href: '/c' },
        { id: 'd', label: 'D', href: '/d' },
        { id: 'e', label: 'E', current: true },
      ]);
      fixture.detectChanges();
      expect(getNav(fixture).querySelectorAll('.tng-breadcrumb-item-ellipsis').length).toBe(1);

      fixture.componentInstance.crumbs.set([
        { id: 'a', label: 'A', href: '/a' },
        { id: 'b', label: 'B', current: true },
        { id: 'c', label: 'C' },
      ]);
      fixture.detectChanges();
      expect(getNav(fixture).querySelectorAll('.tng-breadcrumb-item-ellipsis').length).toBe(0);
    });
  });

  describe('J) Runtime updates', () => {
    it('updating item list rerenders crumbs in correct order without duplicates', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);
      fixture.detectChanges();

      fixture.componentInstance.crumbs.set([
        { id: 'one', label: 'One', href: '/one' },
        { id: 'three', label: 'Three', current: true },
        { id: 'two', label: 'Two', href: '/two' },
      ]);
      fixture.detectChanges();

      const labels = getVisibleCrumbLabels(fixture);

      expect(labels).toEqual(['One', 'Three', 'Two']);
      expect(new Set(labels).size).toBe(labels.length);
    });

    it('changing which item is current updates aria-current correctly', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);
      fixture.detectChanges();

      fixture.componentInstance.crumbs.set([
        { id: 'home', label: 'Home', href: '/home', current: true },
        { id: 'docs', label: 'Docs', href: '/docs' },
      ]);
      fixture.detectChanges();
      expect(getAriaCurrentNodes(fixture)[0].textContent?.trim()).toContain('Home');

      fixture.componentInstance.crumbs.set([
        { id: 'home', label: 'Home', href: '/home' },
        { id: 'docs', label: 'Docs', href: '/docs', current: true },
      ]);
      fixture.detectChanges();
      expect(getAriaCurrentNodes(fixture)[0].textContent?.trim()).toContain('Docs');
    });

    it('changing an item from link to text updates DOM semantics correctly', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);

      fixture.componentInstance.crumbs.set([
        { id: 'home', label: 'Home', href: '/home' },
        { id: 'docs', label: 'Docs', current: true },
      ]);
      fixture.detectChanges();

      const homeItem = getByTestId<HTMLElement>(fixture, 'crumb-home');
      expect(homeItem.querySelector('a')).toBeTruthy();

      fixture.componentInstance.crumbs.set([
        { id: 'home', label: 'Home', href: null },
        { id: 'docs', label: 'Docs', current: true },
      ]);
      fixture.detectChanges();

      expect(homeItem.querySelector('a')).toBeNull();
      expect(homeItem.querySelector('.tng-breadcrumb-item-text')).toBeTruthy();
    });

    it('changing ariaLabel updates the nav attribute correctly', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);
      fixture.detectChanges();

      fixture.componentInstance.ariaLabel.set('Product breadcrumb');
      fixture.detectChanges();
      expect(getNav(fixture).getAttribute('aria-label')).toBe('Product breadcrumb');
    });
  });

  describe('K) Multiple instances & isolation', () => {
    it('multiple breadcrumbs maintain independent aria-labels and structure', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [MultipleBreadcrumbHarnessComponent],
      }).createComponent(MultipleBreadcrumbHarnessComponent);
      fixture.detectChanges();

      const firstNav = getNav(fixture, 'breadcrumb-one');
      const secondNav = getNav(fixture, 'breadcrumb-two');

      expect(firstNav.getAttribute('aria-label')).toBe('First breadcrumb');
      expect(secondNav.getAttribute('aria-label')).toBe('Second breadcrumb');
      expect(firstNav.querySelectorAll('li').length).toBe(2);
      expect(secondNav.querySelectorAll('li').length).toBe(2);
    });

    it('multiple breadcrumbs do not collide ids when ids are generated (none generated)', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [MultipleBreadcrumbHarnessComponent],
      }).createComponent(MultipleBreadcrumbHarnessComponent);
      fixture.detectChanges();

      const nodesWithIds = Array.from(fixture.nativeElement.querySelectorAll<HTMLElement>('[id]'));
      const ids = nodesWithIds.map((node) => node.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('styling hooks do not leak between instances', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [MultipleBreadcrumbHarnessComponent],
      }).createComponent(MultipleBreadcrumbHarnessComponent);
      fixture.detectChanges();

      const firstDisabled = queryByTestId<HTMLElement>(fixture, 'first-item-b')?.querySelector(
        'li[data-disabled="true"]',
      );
      const secondDisabled = queryByTestId<HTMLElement>(fixture, 'second-item-b')?.querySelector(
        'li[data-disabled="true"]',
      );

      expect(firstDisabled).toBeTruthy();
      expect(secondDisabled).toBeNull();
    });
  });

  describe('L) Accessibility basics & edge cases', () => {
    it('does not trap Tab navigation and allows normal page traversal', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);
      fixture.detectChanges();

      const tabEvent = keydown(getNav(fixture), 'Tab');
      expect(tabEvent.defaultPrevented).toBe(false);
    });

    it('does not block Enter on focused enabled link items', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);
      fixture.detectChanges();

      const homeLink = getByTestId<HTMLElement>(fixture, 'crumb-home').querySelector('a');
      if (!(homeLink instanceof HTMLElement)) {
        throw new Error('Expected enabled breadcrumb link.');
      }

      const enterEvent = keydown(homeLink, 'Enter');
      expect(enterEvent.defaultPrevented).toBe(false);
    });

    it('supports long labels without breaking DOM structure', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);

      fixture.componentInstance.crumbs.set([
        {
          id: 'alpha',
          label:
            'This is a very long breadcrumb label intended to validate stable rendering for overflow scenarios',
          href: '/alpha',
        },
        { id: 'beta', label: 'Beta', current: true },
      ]);
      fixture.detectChanges();

      expect(getNav(fixture).querySelectorAll('li').length).toBe(2);
      expect(getVisibleCrumbLabels(fixture)[0]).toContain('very long');
    });

    it('with one item, applies aria-current contract to that single crumb', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);

      fixture.componentInstance.crumbs.set([{ id: 'only', label: 'Only crumb' }]);
      fixture.detectChanges();

      const ariaCurrentNodes = getAriaCurrentNodes(fixture);
      expect(ariaCurrentNodes.length).toBe(1);
      expect(ariaCurrentNodes[0].textContent?.trim()).toContain('Only crumb');
    });

    it('destroying breadcrumb during updates does not log errors', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DestroyHarnessComponent],
      }).createComponent(DestroyHarnessComponent);

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

      fixture.detectChanges();
      fixture.componentInstance.crumbs.set([
        { id: 'one', label: 'One', href: '/one', current: true },
        { id: 'two', label: 'Two', href: '/two' },
      ]);
      fixture.detectChanges();

      fixture.componentInstance.show.set(false);
      expect(() => fixture.detectChanges()).not.toThrow();
      expect(queryByTestId<HTMLElement>(fixture, 'destroyable-breadcrumb')).toBeNull();
      expect(consoleErrorSpy).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('M) Focus state hooks', () => {
    it('applies data-focused while a breadcrumb link has focus', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);
      fixture.detectChanges();

      const homeLink = getByTestId<HTMLElement>(fixture, 'crumb-home').querySelector('a');
      const homeItem = getByTestId<HTMLElement>(fixture, 'crumb-home').querySelector('li');
      const afterLink = getByTestId<HTMLElement>(fixture, 'after-link');
      if (!(homeLink instanceof HTMLElement) || !(homeItem instanceof HTMLElement)) {
        throw new Error('Expected breadcrumb home item and link.');
      }

      homeLink.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      fixture.detectChanges();
      expect(homeItem.getAttribute('data-focused')).toBe('true');

      homeLink.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: afterLink }));
      fixture.detectChanges();
      expect(homeItem.getAttribute('data-focused')).toBeNull();
    });

    it('applies data-focus-visible after keyboard-driven focus', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BreadcrumbHarnessComponent],
      }).createComponent(BreadcrumbHarnessComponent);
      fixture.detectChanges();

      const homeLink = getByTestId<HTMLElement>(fixture, 'crumb-home').querySelector('a');
      const homeItem = getByTestId<HTMLElement>(fixture, 'crumb-home').querySelector('li');
      if (!(homeLink instanceof HTMLElement) || !(homeItem instanceof HTMLElement)) {
        throw new Error('Expected breadcrumb home item and link.');
      }

      homeLink.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Tab' }));
      homeLink.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      fixture.detectChanges();

      expect(homeItem.getAttribute('data-focus-visible')).toBe('true');
    });
  });
});
