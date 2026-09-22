 
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TngPress } from '@tailng-ui/primitives';
import { afterEach, describe, expect, it } from 'vitest';
import {
  TngCardActionsComponent,
  TngCardComponent,
  TngCardContentComponent,
  TngCardDescriptionComponent,
  TngCardDividerComponent,
  TngCardFooterComponent,
  TngCardHeaderComponent,
  TngCardLinkComponent,
  TngCardMediaComponent,
  TngCardTitleComponent,
} from '../tng-card.component';

function getByTestId<T extends Element>(
  fixture: { nativeElement: HTMLElement },
  testId: string,
): T {
  const element = fixture.nativeElement.querySelector(`[data-testid="${testId}"]`);
  if (element === null) {
    throw new Error(`Expected element for data-testid="${testId}".`);
  }

  return element as T;
}

function queryByTestId<T extends Element>(
  fixture: { nativeElement: HTMLElement },
  testId: string,
): T | null {
  const element = fixture.nativeElement.querySelector(`[data-testid="${testId}"]`);
  return (element as T | null) ?? null;
}

function queryCardRoot(cardHost: HTMLElement): HTMLElement {
  const root = cardHost.querySelector('.tng-card');
  if (!(root instanceof HTMLElement)) {
    throw new Error('Expected .tng-card root element.');
  }

  return root;
}

function keydown(target: EventTarget, key: string): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key });
  target.dispatchEvent(event);
  return event;
}

function click(target: HTMLElement): MouseEvent {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  target.dispatchEvent(event);
  return event;
}

function getCardLinkAnchor(linkHost: HTMLElement): HTMLAnchorElement {
  const link = linkHost.querySelector<HTMLAnchorElement>('a.tng-card-link');
  if (link === null) {
    throw new Error('Expected .tng-card-link anchor element.');
  }

  return link;
}

@Component({
  imports: [
    TngCardComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngCardDescriptionComponent,
    TngCardContentComponent,
    TngCardFooterComponent,
    TngCardMediaComponent,
    TngCardActionsComponent,
    TngCardDividerComponent,
    TngCardLinkComponent,
  ],
  template: `
    <tng-card
      data-testid="card-host"
      class="consumer-card"
      data-extra="extra"
      [variant]="variant()"
      [tone]="tone()"
      [padding]="padding()"
      [interactive]="interactive()"
      [elevated]="elevated()"
      (click)="onCardClick()"
    >
      @if (showHeader()) {
        <tng-card-header data-testid="header-host" class="header-consumer" data-header-extra="header-extra">
          <tng-card-title data-testid="title-host" class="title-consumer">
            {{ titleText() }} <em data-testid="title-emphasis">emphasis</em>
          </tng-card-title>
          <tng-card-description data-testid="description-host" class="description-consumer">
            {{ descriptionText() }} <strong data-testid="description-strong">strong</strong>
          </tng-card-description>
        </tng-card-header>
      }

      @if (showMedia()) {
        <tng-card-media data-testid="media-host" class="media-consumer" data-media-extra="media-extra">
          <img data-testid="media-image" src="/fake.png" alt="Card visual" />
          <video data-testid="media-video"></video>
        </tng-card-media>
      }

      <tng-card-content data-testid="content-host" class="content-consumer" data-content-extra="content-extra">
        <span data-testid="content-node-a">Node A</span>
        <span data-testid="content-node-b">Node B</span>

        @for (block of blocks(); track block) {
          <p class="content-block" [attr.data-testid]="'block-' + block">{{ block }}</p>
        }

        @if (showNested()) {
          <section data-testid="nested-section">
            <article>
              <div>
                <button data-testid="deep-button" type="button">Deep action</button>
              </div>
            </article>
          </section>
        }

        @if (showLink()) {
          <tng-card-link
            data-testid="card-link-host"
            [href]="linkHref()"
            [ariaLabel]="linkLabel()"
            [disabled]="linkDisabled()"
            (click)="onCardLinkHostClick()"
          >
            Open details
          </tng-card-link>

          <button data-testid="sibling-action" type="button" (click)="onSiblingActionClick()">
            Inner action
          </button>
        }
      </tng-card-content>

      @if (showDivider()) {
        <tng-card-divider data-testid="divider-host"></tng-card-divider>
      }

      @if (showActions()) {
        <tng-card-actions
          data-testid="actions-host"
          class="actions-consumer"
          data-actions-extra="actions-extra"
          [align]="actionsAlign()"
        >
          <button type="button" data-testid="actions-btn-1">Publish</button>
          <a href="/" data-testid="actions-link-2">Preview</a>
        </tng-card-actions>
      }

      @if (showFooter()) {
        <tng-card-footer data-testid="footer-host" class="footer-consumer" data-footer-extra="footer-extra">
          <button type="button" data-testid="footer-btn-1">Save</button>
          <button type="button" data-testid="footer-btn-2">Cancel</button>
        </tng-card-footer>
      }
    </tng-card>
  `,
})
class CardHarnessHostComponent {
  public readonly variant = signal<'ghost' | 'outline' | 'solid'>('solid');
  public readonly tone = signal<'danger' | 'info' | 'neutral' | 'primary' | 'success' | 'warning'>(
    'neutral',
  );
  public readonly padding = signal<'lg' | 'md' | 'none' | 'sm'>('md');
  public readonly interactive = signal(false);
  public readonly elevated = signal(false);

  public readonly showHeader = signal(true);
  public readonly showFooter = signal(true);
  public readonly showMedia = signal(false);
  public readonly showActions = signal(false);
  public readonly showDivider = signal(false);
  public readonly showLink = signal(false);
  public readonly showNested = signal(false);

  public readonly actionsAlign = signal<'end' | 'start'>('end');
  public readonly blocks = signal<readonly string[]>(['one', 'two']);
  public readonly titleText = signal('Card title');
  public readonly descriptionText = signal('Card description');

  public readonly linkHref = signal('/details');
  public readonly linkLabel = signal<string | null>(null);
  public readonly linkDisabled = signal(false);

  public hostClicks = 0;
  public cardLinkHostClicks = 0;
  public siblingActionClicks = 0;

  public onCardClick(): void {
    this.hostClicks += 1;
  }

  public onCardLinkHostClick(): void {
    this.cardLinkHostClicks += 1;
  }

  public onSiblingActionClick(): void {
    this.siblingActionClicks += 1;
  }
}

@Component({
  imports: [TngCardComponent],
  template: `
    <tng-card data-testid="plain-card">
      <span data-testid="plain-a">Alpha</span>
      <span data-testid="plain-b">Beta</span>
      <span data-testid="plain-stamp">{{ stamp() }}</span>
    </tng-card>
  `,
})
class CardPlainProjectionHostComponent {
  public readonly stamp = signal('first');
}

@Component({
  imports: [
    TngCardComponent,
    TngCardContentComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngCardDescriptionComponent,
    TngCardFooterComponent,
    TngCardActionsComponent,
    TngCardMediaComponent,
  ],
  template: `
    <tng-card data-testid="card-a" variant="solid" tone="primary" padding="sm" [interactive]="true">
      <tng-card-header data-testid="card-a-header">
        <tng-card-title>Card A</tng-card-title>
      </tng-card-header>
      <tng-card-content data-testid="card-a-content">A body</tng-card-content>
      <tng-card-actions data-testid="card-a-actions" align="start">
        <button type="button">A1</button>
      </tng-card-actions>
      <tng-card-footer data-testid="card-a-footer">
        <button type="button">A2</button>
      </tng-card-footer>
    </tng-card>

    <tng-card data-testid="card-b" variant="ghost" tone="danger" padding="lg">
      <tng-card-media data-testid="card-b-media">
        <img src="/b.png" alt="B" />
      </tng-card-media>
      <tng-card-content data-testid="card-b-content">B body</tng-card-content>
    </tng-card>
  `,
})
class CardIsolationHostComponent {}

@Component({
  imports: [TngCardComponent, TngCardContentComponent, TngPress],
  template: `
    <tng-card data-testid="press-card">
      <tng-card-content>
        <a
          data-testid="press-target"
          tngPress
          [attr.href]="useHref() ? '/docs' : null"
          [disabled]="pressDisabled()"
          (click)="onPressClick()"
        >
          Press target
        </a>

        <button data-testid="nested-target" type="button" (click)="onNestedClick()">Nested</button>
      </tng-card-content>
    </tng-card>
  `,
})
class CardPressHostComponent {
  public readonly useHref = signal(false);
  public readonly pressDisabled = signal(false);
  public pressClicks = 0;
  public nestedClicks = 0;

  public onPressClick(): void {
    this.pressClicks += 1;
  }

  public onNestedClick(): void {
    this.nestedClicks += 1;
  }
}

describe('tng-card component behavior blocks A-O', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('A) Smoke / render', () => {
    it('renders tng-card without errors with default inputs', () => {
      const fixture = TestBed.configureTestingModule({ imports: [CardHarnessHostComponent] }).createComponent(
        CardHarnessHostComponent,
      );

      expect(() => fixture.detectChanges()).not.toThrow();
      expect(queryCardRoot(getByTestId<HTMLElement>(fixture, 'card-host'))).toBeTruthy();
    });

    it('renders card with header/content/footer subcomponents without errors', () => {
      const fixture = TestBed.configureTestingModule({ imports: [CardHarnessHostComponent] }).createComponent(
        CardHarnessHostComponent,
      );
      fixture.componentInstance.showHeader.set(true);
      fixture.componentInstance.showFooter.set(true);

      expect(() => fixture.detectChanges()).not.toThrow();
      expect(getByTestId<HTMLElement>(fixture, 'header-host')).toBeTruthy();
      expect(getByTestId<HTMLElement>(fixture, 'content-host')).toBeTruthy();
      expect(getByTestId<HTMLElement>(fixture, 'footer-host')).toBeTruthy();
    });

    it('renders card with only content and no header/footer without errors', () => {
      const fixture = TestBed.configureTestingModule({ imports: [CardHarnessHostComponent] }).createComponent(
        CardHarnessHostComponent,
      );
      fixture.componentInstance.showHeader.set(false);
      fixture.componentInstance.showFooter.set(false);

      expect(() => fixture.detectChanges()).not.toThrow();
      expect(getByTestId<HTMLElement>(fixture, 'content-host')).toBeTruthy();
      expect(queryByTestId<HTMLElement>(fixture, 'header-host')).toBeNull();
      expect(queryByTestId<HTMLElement>(fixture, 'footer-host')).toBeNull();
    });

    it('preserves consumer-provided classes and unrelated attributes on tng-card', () => {
      const fixture = TestBed.configureTestingModule({ imports: [CardHarnessHostComponent] }).createComponent(
        CardHarnessHostComponent,
      );
      fixture.detectChanges();

      const host = getByTestId<HTMLElement>(fixture, 'card-host');
      expect(host.classList.contains('consumer-card')).toBe(true);
      expect(host.getAttribute('data-extra')).toBe('extra');
    });
  });

  describe('B) Data attributes & variant inputs', () => {
    it('applies data attributes from variant/tone/padding and state flags', () => {
      const fixture = TestBed.configureTestingModule({ imports: [CardHarnessHostComponent] }).createComponent(
        CardHarnessHostComponent,
      );
      fixture.componentInstance.variant.set('outline');
      fixture.componentInstance.tone.set('success');
      fixture.componentInstance.padding.set('lg');
      fixture.componentInstance.interactive.set(true);
      fixture.componentInstance.elevated.set(true);
      fixture.detectChanges();

      const cardRoot = queryCardRoot(getByTestId<HTMLElement>(fixture, 'card-host'));
      expect(cardRoot.getAttribute('data-variant')).toBe('outline');
      expect(cardRoot.getAttribute('data-tone')).toBe('success');
      expect(cardRoot.getAttribute('data-padding')).toBe('lg');
      expect(cardRoot.hasAttribute('data-interactive')).toBe(true);
      expect(cardRoot.hasAttribute('data-elevated')).toBe(true);
    });

    it('updates data attributes when inputs change at runtime', () => {
      const fixture = TestBed.configureTestingModule({ imports: [CardHarnessHostComponent] }).createComponent(
        CardHarnessHostComponent,
      );
      fixture.detectChanges();

      const host = getByTestId<HTMLElement>(fixture, 'card-host');
      let cardRoot = queryCardRoot(host);
      expect(cardRoot.getAttribute('data-variant')).toBe('solid');
      expect(cardRoot.getAttribute('data-tone')).toBe('neutral');
      expect(cardRoot.getAttribute('data-padding')).toBe('md');
      expect(cardRoot.hasAttribute('data-interactive')).toBe(false);
      expect(cardRoot.hasAttribute('data-elevated')).toBe(false);

      fixture.componentInstance.variant.set('ghost');
      fixture.componentInstance.tone.set('warning');
      fixture.componentInstance.padding.set('none');
      fixture.componentInstance.interactive.set(true);
      fixture.componentInstance.elevated.set(true);
      fixture.detectChanges();

      cardRoot = queryCardRoot(host);
      expect(cardRoot.getAttribute('data-variant')).toBe('ghost');
      expect(cardRoot.getAttribute('data-tone')).toBe('warning');
      expect(cardRoot.getAttribute('data-padding')).toBe('none');
      expect(cardRoot.hasAttribute('data-interactive')).toBe(true);
      expect(cardRoot.hasAttribute('data-elevated')).toBe(true);
    });
  });

  describe('C) Content projection — card container', () => {
    it('projects default content into the card when no subcomponents are used', () => {
      const fixture = TestBed.configureTestingModule({ imports: [CardPlainProjectionHostComponent] })
        .createComponent(CardPlainProjectionHostComponent);
      fixture.detectChanges();

      const cardRoot = queryCardRoot(getByTestId<HTMLElement>(fixture, 'plain-card'));
      expect(cardRoot.textContent).toContain('Alpha');
      expect(cardRoot.textContent).toContain('Beta');
    });

    it('projects multiple content blocks in expected DOM order', () => {
      const fixture = TestBed.configureTestingModule({ imports: [CardPlainProjectionHostComponent] })
        .createComponent(CardPlainProjectionHostComponent);
      fixture.detectChanges();

      const cardRoot = queryCardRoot(getByTestId<HTMLElement>(fixture, 'plain-card'));
      const labels = Array.from(cardRoot.querySelectorAll('[data-testid^="plain-"]')).map((node) =>
        node.textContent?.trim(),
      );
      expect(labels).toEqual(['Alpha', 'Beta', 'first']);
    });

    it('does not duplicate projected nodes when the card rerenders', () => {
      const fixture = TestBed.configureTestingModule({ imports: [CardPlainProjectionHostComponent] })
        .createComponent(CardPlainProjectionHostComponent);
      fixture.detectChanges();

      fixture.componentInstance.stamp.set('second');
      fixture.detectChanges();

      const cardRoot = queryCardRoot(getByTestId<HTMLElement>(fixture, 'plain-card'));
      expect(cardRoot.querySelectorAll('[data-testid="plain-a"]')).toHaveLength(1);
      expect(cardRoot.querySelectorAll('[data-testid="plain-b"]')).toHaveLength(1);
      expect(cardRoot.querySelectorAll('[data-testid="plain-stamp"]')).toHaveLength(1);
    });
  });

  describe('D) Structure components — header', () => {
    it('renders header container, projects content, and preserves host attrs', () => {
      const fixture = TestBed.configureTestingModule({ imports: [CardHarnessHostComponent] }).createComponent(
        CardHarnessHostComponent,
      );
      fixture.componentInstance.showHeader.set(true);
      fixture.detectChanges();

      const headerHost = getByTestId<HTMLElement>(fixture, 'header-host');
      const headerRoot = headerHost.querySelector('.tng-card-header');
      expect(headerRoot).toBeTruthy();
      expect(headerHost.classList.contains('header-consumer')).toBe(true);
      expect(headerHost.getAttribute('data-header-extra')).toBe('header-extra');
      expect(headerRoot?.textContent).toContain('Card title');
    });
  });

  describe('E) Structure components — title and description', () => {
    it('renders title as semantic h3 with nested markup and no interactive semantics', () => {
      const fixture = TestBed.configureTestingModule({ imports: [CardHarnessHostComponent] }).createComponent(
        CardHarnessHostComponent,
      );
      fixture.detectChanges();

      const titleHost = getByTestId<HTMLElement>(fixture, 'title-host');
      const titleElement = titleHost.querySelector('h3.tng-card-title');
      expect(titleElement).toBeTruthy();
      expect(getByTestId<HTMLElement>(fixture, 'title-emphasis').tagName).toBe('EM');
      expect(titleElement?.getAttribute('tabindex')).toBeNull();
      expect(titleElement?.getAttribute('role')).toBeNull();
    });

    it('renders description as semantic p with nested markup and no interactive semantics', () => {
      const fixture = TestBed.configureTestingModule({ imports: [CardHarnessHostComponent] }).createComponent(
        CardHarnessHostComponent,
      );
      fixture.detectChanges();

      const descriptionHost = getByTestId<HTMLElement>(fixture, 'description-host');
      const descriptionElement = descriptionHost.querySelector('p.tng-card-description');
      expect(descriptionElement).toBeTruthy();
      expect(getByTestId<HTMLElement>(fixture, 'description-strong').tagName).toBe('STRONG');
      expect(descriptionElement?.getAttribute('tabindex')).toBeNull();
      expect(descriptionElement?.getAttribute('role')).toBeNull();
    });
  });

  describe('F) Structure components — content', () => {
    it('renders content container, projects content, and preserves host attrs', () => {
      const fixture = TestBed.configureTestingModule({ imports: [CardHarnessHostComponent] }).createComponent(
        CardHarnessHostComponent,
      );
      fixture.detectChanges();

      const contentHost = getByTestId<HTMLElement>(fixture, 'content-host');
      const contentElement = contentHost.querySelector('section.tng-card-content');
      expect(contentElement).toBeTruthy();
      expect(contentHost.classList.contains('content-consumer')).toBe(true);
      expect(contentHost.getAttribute('data-content-extra')).toBe('content-extra');
      expect(contentElement?.querySelectorAll('[data-testid^="content-node-"]')).toHaveLength(2);
    });
  });

  describe('G) Structure components — footer', () => {
    it('renders footer container, supports multiple actions, and preserves host attrs', () => {
      const fixture = TestBed.configureTestingModule({ imports: [CardHarnessHostComponent] }).createComponent(
        CardHarnessHostComponent,
      );
      fixture.componentInstance.showFooter.set(true);
      fixture.detectChanges();

      const footerHost = getByTestId<HTMLElement>(fixture, 'footer-host');
      const footerElement = footerHost.querySelector('footer.tng-card-footer');
      expect(footerElement).toBeTruthy();
      expect(footerHost.classList.contains('footer-consumer')).toBe(true);
      expect(footerHost.getAttribute('data-footer-extra')).toBe('footer-extra');
      expect(footerElement?.querySelectorAll('button')).toHaveLength(2);
    });
  });

  describe('H) Optional components — media', () => {
    it('renders media container, projects media content, and preserves host attrs', () => {
      const fixture = TestBed.configureTestingModule({ imports: [CardHarnessHostComponent] }).createComponent(
        CardHarnessHostComponent,
      );
      fixture.componentInstance.showMedia.set(true);
      fixture.detectChanges();

      const mediaHost = getByTestId<HTMLElement>(fixture, 'media-host');
      const mediaElement = mediaHost.querySelector('.tng-card-media');
      expect(mediaElement).toBeTruthy();
      expect(mediaHost.classList.contains('media-consumer')).toBe(true);
      expect(mediaHost.getAttribute('data-media-extra')).toBe('media-extra');
      expect(getByTestId<HTMLElement>(fixture, 'media-image')).toBeTruthy();
      expect(getByTestId<HTMLElement>(fixture, 'media-video')).toBeTruthy();
      expect((mediaElement as HTMLElement).style.aspectRatio).toBe('');
    });
  });

  describe('I) Optional components — actions', () => {
    it('renders actions container with projected actions and spacing hooks', () => {
      const fixture = TestBed.configureTestingModule({ imports: [CardHarnessHostComponent] }).createComponent(
        CardHarnessHostComponent,
      );
      fixture.componentInstance.showActions.set(true);
      fixture.detectChanges();

      const actionsHost = getByTestId<HTMLElement>(fixture, 'actions-host');
      const actionsElement = actionsHost.querySelector('.tng-card-actions');
      expect(actionsElement).toBeTruthy();
      expect(actionsHost.classList.contains('actions-consumer')).toBe(true);
      expect(actionsHost.getAttribute('data-actions-extra')).toBe('actions-extra');
      expect(actionsElement?.querySelectorAll('[data-testid^="actions-"]')).toHaveLength(2);
      expect(actionsElement?.getAttribute('data-align')).toBe('end');
    });

    it('supports alignment configuration via align input', () => {
      const fixture = TestBed.configureTestingModule({ imports: [CardHarnessHostComponent] }).createComponent(
        CardHarnessHostComponent,
      );
      fixture.componentInstance.showActions.set(true);
      fixture.componentInstance.actionsAlign.set('start');
      fixture.detectChanges();

      const actionsElement = getByTestId<HTMLElement>(fixture, 'actions-host').querySelector('.tng-card-actions');
      expect(actionsElement?.getAttribute('data-align')).toBe('start');
    });
  });

  describe('J) Optional components — divider', () => {
    it('renders a non-focusable decorative divider and keeps tab order unaffected', () => {
      const fixture = TestBed.configureTestingModule({ imports: [CardHarnessHostComponent] }).createComponent(
        CardHarnessHostComponent,
      );
      fixture.componentInstance.showDivider.set(true);
      fixture.detectChanges();

      const dividerHost = getByTestId<HTMLElement>(fixture, 'divider-host');
      const divider = dividerHost.querySelector('hr.tng-card-divider');
      expect(divider).toBeTruthy();
      expect(divider?.getAttribute('aria-hidden')).toBe('true');
      expect(divider?.getAttribute('tabindex')).toBeNull();

      const cardRoot = queryCardRoot(getByTestId<HTMLElement>(fixture, 'card-host'));
      expect(cardRoot.getAttribute('tabindex')).toBeNull();
    });
  });

  describe('K) Interactive styling behavior (no semantics)', () => {
    it('applies interactive data hook but remains non-focusable and non-interactive semantically', () => {
      const fixture = TestBed.configureTestingModule({ imports: [CardHarnessHostComponent] }).createComponent(
        CardHarnessHostComponent,
      );
      fixture.componentInstance.interactive.set(true);
      fixture.detectChanges();

      const cardRoot = queryCardRoot(getByTestId<HTMLElement>(fixture, 'card-host'));
      expect(cardRoot.hasAttribute('data-interactive')).toBe(true);
      expect(cardRoot.getAttribute('tabindex')).toBeNull();
      expect(cardRoot.getAttribute('role')).toBeNull();
    });

    it('does not synthesize click activation from Enter/Space by default', () => {
      const fixture = TestBed.configureTestingModule({ imports: [CardHarnessHostComponent] }).createComponent(
        CardHarnessHostComponent,
      );
      fixture.componentInstance.interactive.set(true);
      fixture.detectChanges();

      const cardRoot = queryCardRoot(getByTestId<HTMLElement>(fixture, 'card-host'));
      keydown(cardRoot, 'Enter');
      keydown(cardRoot, ' ');
      expect(fixture.componentInstance.hostClicks).toBe(0);
    });
  });

  describe('L) Clickable card helper', () => {
    it('option 1: renders card-link anchor with focusability, accessible name, and default navigation behavior', () => {
      const fixture = TestBed.configureTestingModule({ imports: [CardHarnessHostComponent] }).createComponent(
        CardHarnessHostComponent,
      );
      fixture.componentInstance.showLink.set(true);
      fixture.componentInstance.linkLabel.set('Open card details');
      fixture.detectChanges();

      const linkHost = getByTestId<HTMLElement>(fixture, 'card-link-host');
      const link = getCardLinkAnchor(linkHost);
      expect(link).toBeTruthy();
      expect(link?.getAttribute('href')).toBe('/details');
      expect(link?.getAttribute('aria-label')).toBe('Open card details');
      expect(link?.getAttribute('tabindex')).toBeNull();
      expect(link?.classList.contains('tng-card-link')).toBe(true);

      link?.focus();
      expect(document.activeElement).toBe(link);

      const event = click(link);
      expect(event.defaultPrevented).toBe(false);
      expect(fixture.componentInstance.cardLinkHostClicks).toBe(1);
    });

    it('option 1: disabled card-link prevents navigation and does not intercept sibling interactive elements', () => {
      const fixture = TestBed.configureTestingModule({ imports: [CardHarnessHostComponent] }).createComponent(
        CardHarnessHostComponent,
      );
      fixture.componentInstance.showLink.set(true);
      fixture.componentInstance.linkDisabled.set(true);
      fixture.detectChanges();

      const link = getCardLinkAnchor(getByTestId<HTMLElement>(fixture, 'card-link-host'));
      const event = click(link);
      expect(link.getAttribute('aria-disabled')).toBe('true');
      expect(link.getAttribute('href')).toBeNull();
      expect(link.getAttribute('tabindex')).toBe('-1');
      expect(event.defaultPrevented).toBe(true);

      click(getByTestId<HTMLElement>(fixture, 'sibling-action'));
      expect(fixture.componentInstance.siblingActionClicks).toBe(1);
      expect(fixture.componentInstance.cardLinkHostClicks).toBe(0);
    });

    it('option 2: tngPress-based card target supports role/tabindex and Enter/Space activation only when enabled', () => {
      const fixture = TestBed.configureTestingModule({ imports: [CardPressHostComponent] }).createComponent(
        CardPressHostComponent,
      );
      fixture.componentInstance.useHref.set(false);
      fixture.componentInstance.pressDisabled.set(false);
      fixture.detectChanges();

      const pressTarget = getByTestId<HTMLElement>(fixture, 'press-target');
      expect(pressTarget.getAttribute('role')).toBe('button');
      expect(pressTarget.getAttribute('tabindex')).toBe('0');

      keydown(pressTarget, 'Enter');
      keydown(pressTarget, ' ');
      expect(fixture.componentInstance.pressClicks).toBe(2);

      fixture.componentInstance.pressDisabled.set(true);
      fixture.detectChanges();
      keydown(pressTarget, 'Enter');
      keydown(pressTarget, ' ');
      expect(fixture.componentInstance.pressClicks).toBe(2);
    });

    it('option 2: tngPress target with href keeps native link semantics and does not steal nested focus', () => {
      const fixture = TestBed.configureTestingModule({ imports: [CardPressHostComponent] }).createComponent(
        CardPressHostComponent,
      );
      fixture.componentInstance.useHref.set(true);
      fixture.detectChanges();

      const pressTarget = getByTestId<HTMLElement>(fixture, 'press-target');
      const nestedTarget = getByTestId<HTMLButtonElement>(fixture, 'nested-target');
      expect(pressTarget.getAttribute('role')).toBeNull();
      expect(pressTarget.getAttribute('tabindex')).toBeNull();

      nestedTarget.focus();
      click(nestedTarget);
      expect(document.activeElement).toBe(nestedTarget);
      expect(fixture.componentInstance.nestedClicks).toBe(1);
    });
  });

  describe('M) Accessibility basics', () => {
    it('keeps card container and subcomponents non-interactive by default without aria-live noise', () => {
      const fixture = TestBed.configureTestingModule({ imports: [CardHarnessHostComponent] }).createComponent(
        CardHarnessHostComponent,
      );
      fixture.componentInstance.showDivider.set(true);
      fixture.detectChanges();

      const cardRoot = queryCardRoot(getByTestId<HTMLElement>(fixture, 'card-host'));
      expect(cardRoot.getAttribute('role')).toBeNull();

      const tabStops = cardRoot.querySelectorAll('[tabindex]');
      expect(tabStops).toHaveLength(0);

      const title = cardRoot.querySelector('.tng-card-title');
      const description = cardRoot.querySelector('.tng-card-description');
      expect(title?.getAttribute('aria-live')).toBeNull();
      expect(description?.getAttribute('aria-live')).toBeNull();

      const divider = cardRoot.querySelector('.tng-card-divider');
      expect(divider?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('N) Multiple cards and isolation', () => {
    it('keeps multiple cards independent without structure/style leakage', () => {
      const fixture = TestBed.configureTestingModule({ imports: [CardIsolationHostComponent] }).createComponent(
        CardIsolationHostComponent,
      );
      fixture.detectChanges();

      const cardA = queryCardRoot(getByTestId<HTMLElement>(fixture, 'card-a'));
      const cardB = queryCardRoot(getByTestId<HTMLElement>(fixture, 'card-b'));

      expect(cardA.getAttribute('data-variant')).toBe('solid');
      expect(cardA.getAttribute('data-tone')).toBe('primary');
      expect(cardA.getAttribute('data-padding')).toBe('sm');
      expect(cardA.hasAttribute('data-interactive')).toBe(true);

      expect(cardB.getAttribute('data-variant')).toBe('ghost');
      expect(cardB.getAttribute('data-tone')).toBe('danger');
      expect(cardB.getAttribute('data-padding')).toBe('lg');
      expect(cardB.hasAttribute('data-interactive')).toBe(false);

      expect(getByTestId<HTMLElement>(fixture, 'card-a-actions').querySelectorAll('button')).toHaveLength(1);
      expect(getByTestId<HTMLElement>(fixture, 'card-b-media').querySelectorAll('img')).toHaveLength(1);
      expect(queryByTestId<HTMLElement>(fixture, 'card-b-actions')).toBeNull();
    });
  });

  describe('O) Edge cases & robustness', () => {
    it('handles deeply nested projected content and long title/description without throwing', () => {
      const fixture = TestBed.configureTestingModule({ imports: [CardHarnessHostComponent] }).createComponent(
        CardHarnessHostComponent,
      );
      fixture.componentInstance.showNested.set(true);
      fixture.componentInstance.titleText.set('Very long title '.repeat(40));
      fixture.componentInstance.descriptionText.set('Very long description '.repeat(80));
      expect(() => fixture.detectChanges()).not.toThrow();

      expect(getByTestId<HTMLElement>(fixture, 'deep-button')).toBeTruthy();
    });

    it('handles dynamic add/remove of header/footer without stale DOM artifacts', () => {
      const fixture = TestBed.configureTestingModule({ imports: [CardHarnessHostComponent] }).createComponent(
        CardHarnessHostComponent,
      );
      fixture.detectChanges();
      expect(getByTestId<HTMLElement>(fixture, 'header-host')).toBeTruthy();
      expect(getByTestId<HTMLElement>(fixture, 'footer-host')).toBeTruthy();

      fixture.componentInstance.showHeader.set(false);
      fixture.componentInstance.showFooter.set(false);
      fixture.detectChanges();
      expect(queryByTestId<HTMLElement>(fixture, 'header-host')).toBeNull();
      expect(queryByTestId<HTMLElement>(fixture, 'footer-host')).toBeNull();

      fixture.componentInstance.showHeader.set(true);
      fixture.componentInstance.showFooter.set(true);
      fixture.detectChanges();
      const nativeElement = fixture.nativeElement as HTMLElement;
      expect(nativeElement.querySelectorAll('[data-testid="header-host"]')).toHaveLength(1);
      expect(nativeElement.querySelectorAll('[data-testid="footer-host"]')).toHaveLength(1);
    });

    it('does not throw when destroyed after runtime updates', () => {
      const fixture = TestBed.configureTestingModule({ imports: [CardHarnessHostComponent] }).createComponent(
        CardHarnessHostComponent,
      );
      fixture.detectChanges();

      fixture.componentInstance.variant.set('outline');
      fixture.componentInstance.tone.set('warning');
      fixture.componentInstance.padding.set('lg');
      fixture.componentInstance.showActions.set(true);
      fixture.componentInstance.showDivider.set(true);
      fixture.detectChanges();

      expect(() => fixture.destroy()).not.toThrow();
    });
  });
});
