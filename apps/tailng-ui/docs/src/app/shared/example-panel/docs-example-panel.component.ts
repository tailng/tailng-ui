import { Component, computed, input, output, signal, type OnInit } from '@angular/core';
import { TngCodeBlockComponent, TngTabsComponent } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import { TngTab, TngTabList, TngTabPanel } from '@tailng-ui/primitives';

export type DocsExampleCodeTab = Readonly<{
  code: string;
  label: string;
  language: string;
  title: string;
  value: string;
}>;

@Component({
  selector: 'app-docs-example-panel',
  imports: [TngCodeBlockComponent, TngTabsComponent, TngTabList, TngTab, TngTabPanel, TngIcon],
  templateUrl: './docs-example-panel.component.html',
  styleUrl: './docs-example-panel.component.css',
})
export class DocsExamplePanelComponent implements OnInit {
  public readonly title = input<string>('Example');
  public readonly codeTabs = input<readonly DocsExampleCodeTab[]>([]);
  public readonly codeBlockTheme = input<'github-dark' | 'github-light'>('github-light');
  public readonly codeVisibleByDefault = input<boolean>(false);
  public readonly stackblitzUrl = input<string | null>(null);

  public readonly linkClick = output<void>();
  public readonly openClick = output<void>();
  public readonly codeVisibilityChange = output<boolean>();

  protected readonly showCode = signal<boolean>(false);
  protected readonly hasCodeTabs = computed<boolean>(() => this.codeTabs().length > 0);
  protected readonly defaultCodeTab = computed<string>(() => {
    const firstTab = this.codeTabs()[0];
    return firstTab?.value ?? 'html';
  });

  public ngOnInit(): void {
    this.showCode.set(this.codeVisibleByDefault());
  }

  protected onCodeButtonClick(): void {
    if (!this.hasCodeTabs()) {
      return;
    }

    const nextState = !this.showCode();
    this.showCode.set(nextState);
    this.codeVisibilityChange.emit(nextState);
  }

  protected onLinkButtonClick(): void {
    this.linkClick.emit();
  }

  protected onOpenButtonClick(): void {
    this.openClick.emit();
  }
}
