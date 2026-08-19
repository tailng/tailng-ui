import type { RegistryItem } from '../registry.types';

const badgePrimitiveTsTemplate = `import {
  booleanAttribute,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  type OnDestroy,
  Renderer2,
} from '@angular/core';

type TngBadgePosition = 'bottom-end' | 'bottom-start' | 'top-end' | 'top-start';
type TngBadgeSize = 'lg' | 'md' | 'sm';
type TngBadgeTone = 'danger' | 'info' | 'neutral' | 'success' | 'warning';
type TngBadgeStyleMap = Readonly<Record<string, number | string>>;

function resolvePlacement(position: TngBadgePosition): Readonly<Record<'top' | 'right' | 'bottom' | 'left', string | null>> {
  if (position === 'top-start') {
    return { top: '0', right: null, bottom: null, left: '0' };
  }

  if (position === 'bottom-start') {
    return { top: null, right: null, bottom: '0', left: '0' };
  }

  if (position === 'bottom-end') {
    return { top: null, right: '0', bottom: '0', left: null };
  }

  return { top: '0', right: '0', bottom: null, left: null };
}

@Directive({
  selector: '[tngBadge]',
  exportAs: 'tngBadge',
})
export class TngBadgePrimitive implements OnDestroy {
  public readonly badge = input<number | string | null | undefined>(null, { alias: 'tngBadge' });
  public readonly badgeClass = input<string | null | undefined>(null, { alias: 'tngBadgeClass' });
  public readonly badgeDot = input<boolean, boolean | string>(false, {
    alias: 'tngBadgeDot',
    transform: booleanAttribute,
  });
  public readonly badgeHidden = input<boolean, boolean | string>(false, {
    alias: 'tngBadgeHidden',
    transform: booleanAttribute,
  });
  public readonly badgePosition = input<TngBadgePosition>('top-end', {
    alias: 'tngBadgePosition',
  });
  public readonly badgeSize = input<TngBadgeSize>('md', { alias: 'tngBadgeSize' });
  public readonly badgeStyle = input<TngBadgeStyleMap | null | undefined>(null, {
    alias: 'tngBadgeStyle',
  });
  public readonly badgeTone = input<TngBadgeTone>('danger', { alias: 'tngBadgeTone' });

  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly renderer = inject(Renderer2);
  private badgeElement: HTMLElement | null = null;

  public constructor() {
    this.renderer.setStyle(this.hostElement, 'position', 'relative');

    effect((): void => {
      this.render();
    });
  }

  public ngOnDestroy(): void {
    if (this.badgeElement === null) {
      return;
    }

    this.renderer.removeChild(this.hostElement, this.badgeElement);
    this.badgeElement = null;
  }

  private render(): void {
    if (this.badgeHidden()) {
      this.ngOnDestroy();
      return;
    }

    const badgeElement = this.ensureBadgeElement();
    const badgeContent = this.badgeDot() ? '' : String(this.badge() ?? '').trim();
    if (!this.badgeDot() && badgeContent.length === 0) {
      this.ngOnDestroy();
      return;
    }

    this.renderer.setProperty(badgeElement, 'textContent', badgeContent);
    this.renderer.setAttribute(badgeElement, 'class', this.resolveClassName());
    this.renderer.setAttribute(badgeElement, 'data-tone', this.badgeTone());
    this.renderer.setAttribute(badgeElement, 'data-size', this.badgeSize());
    this.renderer.setAttribute(badgeElement, 'data-position', this.badgePosition());
    this.renderer.setAttribute(badgeElement, 'data-slot', 'badge');

    const placement = resolvePlacement(this.badgePosition());
    this.setNullableStyle(badgeElement, 'top', placement.top);
    this.setNullableStyle(badgeElement, 'right', placement.right);
    this.setNullableStyle(badgeElement, 'bottom', placement.bottom);
    this.setNullableStyle(badgeElement, 'left', placement.left);

    this.applyBaseStyles(badgeElement);
    this.applyCustomStyles(badgeElement);
  }

  private applyBaseStyles(badgeElement: HTMLElement): void {
    this.renderer.setStyle(badgeElement, 'position', 'absolute');
    this.renderer.setStyle(badgeElement, 'display', 'inline-flex');
    this.renderer.setStyle(badgeElement, 'align-items', 'center');
    this.renderer.setStyle(badgeElement, 'justify-content', 'center');
    this.renderer.setStyle(badgeElement, 'min-width', 'var(--tng-badge-size, 1.125rem)');
    this.renderer.setStyle(badgeElement, 'height', 'var(--tng-badge-size, 1.125rem)');
    this.renderer.setStyle(badgeElement, 'padding-inline', 'var(--tng-badge-padding-x, 0.3rem)');
    this.renderer.setStyle(badgeElement, 'border-radius', 'var(--tng-badge-radius, 9999px)');
    this.renderer.setStyle(badgeElement, 'font-size', 'var(--tng-badge-font-size, 0.7rem)');
    this.renderer.setStyle(badgeElement, 'font-weight', '700');
    this.renderer.setStyle(badgeElement, 'line-height', '1');
    this.renderer.setStyle(badgeElement, 'pointer-events', 'none');
    this.renderer.setStyle(badgeElement, 'background', 'var(--tng-badge-bg, #dc2626)');
    this.renderer.setStyle(badgeElement, 'color', 'var(--tng-badge-fg, #ffffff)');

    if (this.badgeDot()) {
      this.renderer.setStyle(badgeElement, 'min-width', 'var(--tng-badge-dot-size, 0.625rem)');
      this.renderer.setStyle(badgeElement, 'height', 'var(--tng-badge-dot-size, 0.625rem)');
      this.renderer.setStyle(badgeElement, 'padding-inline', '0');
    }
  }

  private applyCustomStyles(badgeElement: HTMLElement): void {
    const styleMap = this.badgeStyle();
    if (styleMap === null || styleMap === undefined) {
      return;
    }

    for (const [key, value] of Object.entries(styleMap)) {
      this.renderer.setStyle(badgeElement, key, String(value));
    }
  }

  private ensureBadgeElement(): HTMLElement {
    if (this.badgeElement !== null) {
      return this.badgeElement;
    }

    const badgeElement = this.renderer.createElement('span') as HTMLElement;
    this.renderer.appendChild(this.hostElement, badgeElement);
    this.badgeElement = badgeElement;
    return badgeElement;
  }

  private resolveClassName(): string {
    const customClasses = (this.badgeClass() ?? '').trim();
    if (customClasses.length === 0) {
      return 'tng-badge';
    }

    return 'tng-badge \${customClasses}';
  }

  private setNullableStyle(
    badgeElement: HTMLElement,
    property: string,
    value: string | null,
  ): void {
    if (value === null) {
      this.renderer.removeStyle(badgeElement, property);
      return;
    }

    this.renderer.setStyle(badgeElement, property, value);
  }
}
`;

const badgeDirectiveTsTemplate = `import { Directive } from '@angular/core';
import { TngBadgePrimitive } from './tng-badge-primitive';

@Directive({
  selector: '[tngBadge]',
  exportAs: 'tngBadge',
})
export class TngBadge extends TngBadgePrimitive {}
`;

const badgeIndexTsTemplate = `export * from './tng-badge';
export * from './tng-badge-primitive';
`;

export const badgeRegistryItem = {
  dependencies: [],
  description: 'Material-style notification badge directive with micro styling hooks.',
  install: {
    importPath: './tailng-ui/badge',
    importSymbols: ['TngBadge', 'TngBadgePrimitive'],
  },
  files: [
    {
      content: badgePrimitiveTsTemplate,
      path: 'src/app/tailng-ui/badge/tng-badge-primitive.ts',
    },
    {
      content: badgeDirectiveTsTemplate,
      path: 'src/app/tailng-ui/badge/tng-badge.ts',
    },
    {
      content: badgeIndexTsTemplate,
      path: 'src/app/tailng-ui/badge/index.ts',
    },
  ],
  name: 'badge',
} satisfies RegistryItem;
