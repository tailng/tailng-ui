import { Directive, HostListener, input, output, signal, computed } from '@angular/core';

export type TailngFileDrop = {
  files: File[];
  items?: DataTransferItemList;
  raw?: DataTransfer;
};

@Directive({
  selector: '[tngFileDropzone]',
  standalone: true,
  exportAs: 'tngFileDropzone',
})
export class TailngFileDropzoneDirective {
  /** Disable drag/drop interactions */
  readonly disabled = input(false);

  /** Optional: allow dropping multiple files */
  readonly multiple = input(false);

  /** Optional: accept filter like input accept attribute (e.g. "image/*,.pdf") */
  readonly accept = input<string>('');

  /** Emits when valid files dropped */
  readonly filesDropped = output<File[]>();

  /** Emits drag active state changes (optional hook) */
  readonly dragActiveChange = output<boolean>();

  private readonly _dragActive = signal(false);
  readonly dragActive = computed(() => this._dragActive());

  private setActive(next: boolean) {
    if (this._dragActive() === next) return;
    this._dragActive.set(next);
    this.dragActiveChange.emit(next);
  }

  private acceptMatches(file: File): boolean {
    const accept = (this.accept() ?? '').trim();
    if (!accept) return true;

    // accept can be: "image/*,.pdf,application/json"
    const parts = accept
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    if (!parts.length) return true;

    const name = file.name.toLowerCase();
    const type = (file.type || '').toLowerCase();

    return parts.some((p) => {
      const token = p.toLowerCase();
      if (token === '*/*') return true;

      // extension: ".pdf"
      if (token.startsWith('.')) return name.endsWith(token);

      // wildcard mime: "image/*"
      if (token.endsWith('/*')) {
        const prefix = token.slice(0, token.length - 1); // keep trailing '/'
        return type.startsWith(prefix);
      }

      // exact mime: "application/pdf"
      return type === token;
    });
  }

  private filterFiles(files: File[]): File[] {
    const accepted = files.filter((f) => this.acceptMatches(f));
    return this.multiple() ? accepted : accepted.slice(0, 1);
  }

  private extractFiles(dt: DataTransfer | null): File[] {
    if (!dt) return [];

    // Prefer items (better in some browsers)
    const items = dt.items;
    if (items && items.length) {
      const picked: File[] = [];
      for (const item of Array.from(items)) {
        if (item.kind !== 'file') continue;
        const file = item.getAsFile();
        if (file) picked.push(file);
      }
      return this.filterFiles(picked);
    }

    const files = dt.files ? Array.from(dt.files) : [];
    return this.filterFiles(files);
  }

  @HostListener('dragenter', ['$event'])
  onDragEnter(ev: DragEvent) {
    if (this.disabled()) return;
    ev.preventDefault();
    ev.stopPropagation();
    this.setActive(true);
  }

  @HostListener('dragover', ['$event'])
  onDragOver(ev: DragEvent) {
    if (this.disabled()) return;
    ev.preventDefault();
    ev.stopPropagation();
    this.setActive(true);
    if (ev.dataTransfer) ev.dataTransfer.dropEffect = 'copy';
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(ev: DragEvent) {
    if (this.disabled()) return;
    ev.preventDefault();
    ev.stopPropagation();
    this.setActive(false);
  }

  @HostListener('drop', ['$event'])
  onDrop(ev: DragEvent) {
    if (this.disabled()) return;
    ev.preventDefault();
    ev.stopPropagation();
    this.setActive(false);

    const files = this.extractFiles(ev.dataTransfer ?? null);
    if (files.length) this.filesDropped.emit(files);
  }
}
