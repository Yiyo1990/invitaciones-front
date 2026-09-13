import { DOCUMENT } from '@angular/common';
import {
  Component,
  DestroyRef,
  effect,
  HostListener,
  inject,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  open = input(false);
  title = input('');
  closeOnOverlay = input(true);
  ariaLabel = input('Diálogo');

  closed = output<void>();

  constructor() {
    effect(() => {
      this.document.body.style.overflow = this.open() ? 'hidden' : '';
    });

    this.destroyRef.onDestroy(() => {
      this.document.body.style.overflow = '';
    });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open()) {
      this.close();
    }
  }

  onOverlayClick(): void {
    if (this.closeOnOverlay()) {
      this.close();
    }
  }

  close(): void {
    this.closed.emit();
  }
}
