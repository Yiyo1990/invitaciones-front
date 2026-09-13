import { DecimalPipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';

interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-invitation-countdown',
  imports: [DecimalPipe],
  templateUrl: './invitation-countdown.html',
  styleUrl: './invitation-countdown.css',
})
export class InvitationCountdown {
  targetDate = input.required<Date>();

  protected readonly countdown = signal<CountdownValues>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  protected readonly isPast = signal(false);

  private readonly destroyRef = inject(DestroyRef);
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    effect(() => {
      const target = this.targetDate();
      this.startCountdown(target);
    });

    this.destroyRef.onDestroy(() => this.stopCountdown());
  }

  private startCountdown(target: Date): void {
    this.stopCountdown();
    this.updateCountdown(target);

    this.intervalId = setInterval(() => {
      this.updateCountdown(target);
    }, 1000);
  }

  private stopCountdown(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private updateCountdown(target: Date): void {
    const now = Date.now();
    const diff = target.getTime() - now;

    if (diff <= 0) {
      this.countdown.set({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      this.isPast.set(true);
      this.stopCountdown();
      return;
    }

    this.isPast.set(false);
    this.countdown.set({
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    });
  }
}
