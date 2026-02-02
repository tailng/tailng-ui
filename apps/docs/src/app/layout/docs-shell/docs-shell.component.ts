import { Component, computed, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  TngAccordion,
  TngExpansionPanel,
} from '@tociva/tailng-ui/layout';
import { TngTextInput } from '@tociva/tailng-ui/form-controls';
import { TngSidenav } from '@tociva/tailng-ui/navigation';
import { docsNav } from '../../data/nav';
import { TngIcon } from '@tociva/tailng-icons/icon';

@Component({
  standalone: true,
  selector: 'docs-shell',
  host: { class: 'flex flex-1 flex-col min-h-0 overflow-hidden' },
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    TngAccordion,
    TngExpansionPanel,
    TngSidenav,
    TngTextInput,
    ReactiveFormsModule,
    TngIcon,
  ],
  templateUrl: './docs-shell.component.html',
})
export class DocsShellComponent implements OnInit {
  mobileOpen = signal(false);
  nav = computed(() => docsNav);
searchQuery = signal<string>('');
  
   form = new FormGroup({
    text: new FormControl(''),
  });
ngOnInit() {
  this.form.controls.text.valueChanges.subscribe(value => {
    this.searchQuery.set(value ?? '');
  });
}
normalizedQuery = computed(() =>
  this.searchQuery().toLowerCase().trim()
);
filteredNav() {
  const q = this.normalizedQuery();
  return this.nav().filter(section =>
    section.title.toLowerCase().includes(q) ||
    section.children?.some(child =>
      child.title?.toLowerCase().includes(q)
    )
  );
}

}
