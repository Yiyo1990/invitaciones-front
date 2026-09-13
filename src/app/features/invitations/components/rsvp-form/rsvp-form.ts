import { Component, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AttendanceResponse, RsvpForm } from '../../../../core/models/rsvp-form';

@Component({
  selector: 'app-rsvp-form',
  imports: [ReactiveFormsModule],
  templateUrl: './rsvp-form.html',
  styleUrl: './rsvp-form.css',
})
export class RsvpFormComponent implements OnInit {
  invitationSlug = input.required<string>();

  submitted = output<RsvpForm>();
  cancelled = output<void>();

  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly AttendanceResponse = AttendanceResponse;
  protected readonly submittedSuccessfully = signal(false);

  protected readonly form = this.fb.group({
    fullName: ['', [Validators.required, Validators.maxLength(120)]],
    attendance: ['' as AttendanceResponse | '', Validators.required],
    guestCount: [1 as number | null, [Validators.required, Validators.min(1), Validators.max(10)]],
    message: ['', [Validators.maxLength(250)]],
  });

  ngOnInit(): void {
    this.form
      .get('attendance')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onAttendanceChange(value));
  }

  protected isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!control?.invalid && !!control?.touched;
  }

  protected showGuestCount(): boolean {
    return this.form.get('attendance')?.value === AttendanceResponse.Yes;
  }

  protected messageLength(): number {
    return this.form.get('message')?.value?.length ?? 0;
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const payload: RsvpForm = {
      fullName: raw.fullName?.trim() ?? '',
      attendance: raw.attendance ?? '',
      guestCount: raw.attendance === AttendanceResponse.Yes ? raw.guestCount : null,
      message: raw.message?.trim() ?? '',
    };

    console.log('RSVP submission:', {
      slug: this.invitationSlug(),
      ...payload,
    });

    this.submitted.emit(payload);
    this.submittedSuccessfully.set(true);
  }

  protected onCancel(): void {
    this.cancelled.emit();
  }

  private onAttendanceChange(value: AttendanceResponse | '' | null): void {
    const guestCount = this.form.get('guestCount');

    if (value === AttendanceResponse.No) {
      guestCount?.clearValidators();
      guestCount?.setValue(null);
      guestCount?.updateValueAndValidity();
      return;
    }

    guestCount?.setValidators([Validators.required, Validators.min(1), Validators.max(10)]);
    if (guestCount?.value === null) {
      guestCount.setValue(1);
    }
    guestCount?.updateValueAndValidity();
  }
}
