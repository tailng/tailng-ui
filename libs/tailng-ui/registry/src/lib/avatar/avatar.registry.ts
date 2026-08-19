import type { RegistryItem } from '../registry.types';

const avatarPrimitiveTsTemplate = `import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngAvatar]',
  exportAs: 'tngAvatar',
})
export class TngAvatarPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'avatar' as const;
}

@Directive({
  selector: 'img[tngAvatarImage]',
  exportAs: 'tngAvatarImage',
})
export class TngAvatarImagePrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'avatar-image' as const;
}

@Directive({
  selector: '[tngAvatarFallback]',
  exportAs: 'tngAvatarFallback',
})
export class TngAvatarFallbackPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'avatar-fallback' as const;
}
`;

const avatarComponentTsTemplate = `import { Component, computed, input, signal } from '@angular/core';
import {
  TngAvatarFallbackPrimitive,
  TngAvatarImagePrimitive,
  TngAvatarPrimitive,
} from './tng-avatar-primitive';

type TngAvatarShape = 'circle' | 'square';
type TngAvatarSize = 'lg' | 'md' | 'sm';

function normalizeOptionalString(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

export function toTngAvatarFallbackText(value: string | null | undefined): string {
  const normalized = normalizeOptionalString(value);
  if (normalized === null) {
    return '?';
  }

  const words = normalized.split(/\\s+/).filter((part) => part.length > 0);
  if (words.length === 0) {
    return '?';
  }

  if (words.length === 1) {
    return words[0]?.slice(0, 2).toUpperCase() ?? '?';
  }

  const firstInitial = words[0]?.charAt(0) ?? '';
  const secondInitial = words[1]?.charAt(0) ?? '';
  const initials = \`\${firstInitial}\${secondInitial}\`.toUpperCase();
  return initials.length > 0 ? initials : '?';
}

@Component({
  selector: 'tng-avatar',
  imports: [TngAvatarPrimitive, TngAvatarImagePrimitive, TngAvatarFallbackPrimitive],
  templateUrl: './tng-avatar.html',
  styleUrl: './tng-avatar.css',
})
export class TngAvatar {
  public readonly alt = input<string | null>('Avatar');
  public readonly fallback = input<string | null>(null);
  public readonly shape = input<TngAvatarShape>('circle');
  public readonly size = input<TngAvatarSize>('md');
  public readonly src = input<string | null>(null);

  private readonly imageLoadFailed = signal(false);
  protected readonly fallbackText = computed<string>(() =>
    toTngAvatarFallbackText(this.fallback()),
  );
  protected readonly resolvedAlt = computed<string | null>(() =>
    normalizeOptionalString(this.alt()),
  );
  protected readonly resolvedSrc = computed<string | null>(() =>
    normalizeOptionalString(this.src()),
  );
  protected readonly showFallback = computed<boolean>(
    () => this.resolvedSrc() === null || this.imageLoadFailed(),
  );

  public onImageError(): void {
    this.imageLoadFailed.set(true);
  }

  public onImageLoad(): void {
    this.imageLoadFailed.set(false);
  }
}
`;

const avatarTemplateHtml = `<span tngAvatar class="tng-avatar" [attr.data-shape]="shape()" [attr.data-size]="size()">
  <img
    tngAvatarImage
    class="tng-avatar-image"
    [attr.alt]="resolvedAlt()"
    [attr.hidden]="showFallback() ? '' : null"
    [attr.src]="resolvedSrc()"
    (error)="onImageError()"
    (load)="onImageLoad()"
  />
  <span tngAvatarFallback class="tng-avatar-fallback" [attr.hidden]="showFallback() ? null : ''">
    {{ fallbackText() }}
  </span>
</span>
`;

const avatarTemplateCss = `:host {
  display: inline-flex;
}

.tng-avatar {
  align-items: center;
  background: var(--tng-semantic-background-surface, #ffffff);
  border: 1px solid var(--tng-semantic-border-strong, #64748b);
  color: var(--tng-semantic-foreground-primary, #0f172a);
  display: inline-flex;
  font-size: 0.75rem;
  font-weight: 700;
  height: 2.5rem;
  justify-content: center;
  overflow: hidden;
  position: relative;
  text-transform: uppercase;
  width: 2.5rem;
}

.tng-avatar[data-shape='circle'] {
  border-radius: 9999px;
}

.tng-avatar[data-shape='square'] {
  border-radius: 0.75rem;
}

.tng-avatar[data-size='sm'] {
  font-size: 0.625rem;
  height: 2rem;
  width: 2rem;
}

.tng-avatar[data-size='md'] {
  font-size: 0.75rem;
  height: 2.5rem;
  width: 2.5rem;
}

.tng-avatar[data-size='lg'] {
  font-size: 0.95rem;
  height: 3rem;
  width: 3rem;
}

.tng-avatar-image,
.tng-avatar-fallback {
  inset: 0;
  position: absolute;
}

.tng-avatar-image {
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.tng-avatar-image[hidden] {
  display: none;
}

.tng-avatar-fallback {
  align-items: center;
  display: inline-flex;
  justify-content: center;
  letter-spacing: 0.03em;
  width: 100%;
}

.tng-avatar-fallback[hidden] {
  display: none;
}
`;

const avatarIndexTsTemplate = `export * from './tng-avatar';
export * from './tng-avatar-primitive';
`;

export const avatarRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for avatar primitive and styled wrapper.',
  install: {
    importPath: './tailng-ui/avatar',
    importSymbols: [
      'TngAvatar',
      'TngAvatarPrimitive',
      'TngAvatarImagePrimitive',
      'TngAvatarFallbackPrimitive',
    ],
  },
  files: [
    {
      content: avatarPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/avatar/tng-avatar-primitive.ts',
    },
    {
      content: avatarComponentTsTemplate,
      path: 'src/app/tailng-ui/avatar/tng-avatar.ts',
    },
    {
      content: avatarTemplateHtml,
      path: 'src/app/tailng-ui/avatar/tng-avatar.html',
    },
    {
      content: avatarTemplateCss,
      path: 'src/app/tailng-ui/avatar/tng-avatar.css',
    },
    {
      content: avatarIndexTsTemplate,
      path: 'src/app/tailng-ui/avatar/index.ts',
    },
  ],
  name: 'avatar',
} satisfies RegistryItem;
