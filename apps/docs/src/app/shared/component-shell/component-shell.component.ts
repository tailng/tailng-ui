import { AfterViewInit, Component, ElementRef, signal, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TngIcon } from '@tailng-ui/icons/icon';

@Component({
  standalone: true,
  selector: 'docs-component-shell',
  templateUrl: './component-shell.component.html',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, TngIcon],
})
export class ComponentShellComponent implements AfterViewInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  isMobileMenuOpen = signal(false);

  mobileOpen(): boolean {
    return this.isMobileMenuOpen();
  }
  isAtStart = signal(true);
  isAtEnd = signal(false);

  ngAfterViewInit(): void {
    this.scrollContainer.nativeElement.addEventListener('scroll', () => this.checkScroll());
    this.checkScroll();
  }

  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({ left: -100, behavior: 'smooth' });
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({ left: 100, behavior: 'smooth' });
  }

  checkScroll() {
    const el = this.scrollContainer.nativeElement;
    this.isAtStart.set(el.scrollLeft === 0);
    this.isAtEnd.set(el.scrollWidth - el.clientWidth - el.scrollLeft <= 1);
  }
}
