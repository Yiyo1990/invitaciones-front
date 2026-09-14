import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, forkJoin, map, of } from 'rxjs';

import {
  InvitationApiResponse,
  UpdateInvitationCustomizationRequest,
} from '../../../../core/models/event-api';
import { EventSummary } from '../../../../core/models/event-summary';
import { InvitationTemplate } from '../../../../core/models/invitation-template';
import { getApiErrorMessage } from '../../../../core/utils/api-error.util';
import {
  DEFAULT_INVITATION_PRIMARY_COLOR,
  DEFAULT_INVITATION_SECONDARY_COLOR,
  INVITATION_WELCOME_MESSAGE_MAX_LENGTH,
  emptyToNull,
  resolveInvitationColor,
} from '../../../../core/utils/invitation-style.util';
import {
  optionalHexColorValidator,
  optionalHttpUrlValidator,
} from '../../../../shared/validators/invitation-style.validators';
import { EventService } from '../../../events/services/event.service';
import { TemplateService } from '../../../templates/services/template.service';
import { InvitationService } from '../../services/invitation.service';

@Component({
  selector: 'app-edit-invitation-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './edit-invitation.html',
  styleUrl: './edit-invitation.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditInvitationPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly invitationService = inject(InvitationService);
  private readonly eventService = inject(EventService);
  private readonly templateService = inject(TemplateService);

  protected readonly welcomeMaxLength = INVITATION_WELCOME_MESSAGE_MAX_LENGTH;
  protected readonly defaultPrimaryColor = DEFAULT_INVITATION_PRIMARY_COLOR;
  protected readonly defaultSecondaryColor = DEFAULT_INVITATION_SECONDARY_COLOR;

  protected readonly loading = signal(true);
  protected readonly loadError = signal<string | null>(null);
  protected readonly missingInvitation = signal(false);
  protected readonly saving = signal(false);
  protected readonly saveError = signal<string | null>(null);
  protected readonly saveSuccess = signal(false);
  protected readonly event = signal<EventSummary | null>(null);
  protected readonly invitation = signal<InvitationApiResponse | null>(null);
  protected readonly template = signal<InvitationTemplate | null>(null);

  /** Bumps on every form value change so OnPush preview/dirty stay in sync. */
  private readonly formTick = signal(0);

  protected readonly form = this.fb.nonNullable.group({
    welcomeMessage: ['', [Validators.maxLength(INVITATION_WELCOME_MESSAGE_MAX_LENGTH)]],
    primaryColor: ['', [optionalHexColorValidator()]],
    secondaryColor: ['', [optionalHexColorValidator()]],
    coverImageUrl: ['', [optionalHttpUrlValidator()]],
    backgroundImageUrl: ['', [optionalHttpUrlValidator()]],
    musicUrl: ['', [optionalHttpUrlValidator()]],
  });

  private readonly eventIdParam = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? '')),
    { initialValue: '' },
  );

  protected readonly eventId = computed(() => this.eventIdParam());

  protected readonly welcomeLength = computed(() => {
    this.formTick();
    return this.form.controls.welcomeMessage.value.length;
  });

  protected readonly previewPrimary = computed(() => {
    this.formTick();
    return resolveInvitationColor(this.form.controls.primaryColor.value, this.defaultPrimaryColor);
  });

  protected readonly previewSecondary = computed(() => {
    this.formTick();
    return resolveInvitationColor(
      this.form.controls.secondaryColor.value,
      this.defaultSecondaryColor,
    );
  });

  protected readonly previewCover = computed(() => {
    this.formTick();
    const cover = this.form.controls.coverImageUrl.value.trim();
    if (cover) {
      return cover;
    }
    return this.template()?.previewImage ?? '';
  });

  protected readonly previewBackground = computed(() => {
    this.formTick();
    return this.form.controls.backgroundImageUrl.value.trim();
  });

  protected readonly previewWelcome = computed(() => {
    this.formTick();
    return this.form.controls.welcomeMessage.value.trim();
  });

  protected readonly previewMusic = computed(() => {
    this.formTick();
    return this.form.controls.musicUrl.value.trim();
  });

  protected readonly hasCoverUrl = computed(() => {
    this.formTick();
    return this.form.controls.coverImageUrl.value.trim().length > 0;
  });

  protected readonly coverUrlValue = computed(() => {
    this.formTick();
    return this.form.controls.coverImageUrl.value.trim();
  });

  protected readonly hasBackgroundUrl = computed(() => {
    this.formTick();
    return this.form.controls.backgroundImageUrl.value.trim().length > 0;
  });

  protected readonly canSubmit = computed(() => {
    this.formTick();
    return this.form.valid && this.form.dirty && !this.saving();
  });

  protected readonly previewTitle = computed(
    () => this.invitation()?.title?.trim() || this.event()?.name || 'Tu evento',
  );

  protected readonly previewSubtitle = computed(
    () => this.invitation()?.subtitle?.trim() || this.template()?.name || 'Invitación',
  );

  ngOnInit(): void {
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.formTick.update((value) => value + 1);
      this.saveSuccess.set(false);
    });

    this.route.paramMap
      .pipe(
        map((params) => params.get('id') ?? ''),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((eventId) => this.loadPage(eventId));
  }

  protected retry(): void {
    this.loadPage(this.eventId());
  }

  protected isInvalid(controlName: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  protected onPrimaryColorPick(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.form.controls.primaryColor.setValue(value.toUpperCase());
    this.form.controls.primaryColor.markAsDirty();
  }

  protected onSecondaryColorPick(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.form.controls.secondaryColor.setValue(value.toUpperCase());
    this.form.controls.secondaryColor.markAsDirty();
  }

  protected clearCoverImage(): void {
    this.form.controls.coverImageUrl.setValue('');
    this.form.controls.coverImageUrl.markAsDirty();
  }

  protected clearBackgroundImage(): void {
    this.form.controls.backgroundImageUrl.setValue('');
    this.form.controls.backgroundImageUrl.markAsDirty();
  }

  protected clearMusic(): void {
    this.form.controls.musicUrl.setValue('');
    this.form.controls.musicUrl.markAsDirty();
  }

  protected onCancel(): void {
    const id = this.eventId();
    void this.router.navigate(id ? ['/events', id] : ['/events']);
  }

  protected onSubmit(): void {
    if (this.form.invalid || this.form.pristine || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    const eventId = this.eventId();
    if (!eventId || !this.event()) {
      return;
    }

    const body = this.buildRequestBody();
    this.saving.set(true);
    this.saveError.set(null);
    this.saveSuccess.set(false);

    const request$ = this.missingInvitation()
      ? this.invitationService.saveCustomization(eventId, body, { createIfMissing: true })
      : this.invitationService.updateCustomization(eventId, body);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (saved) => {
        this.saving.set(false);
        this.invitation.set(saved);
        this.missingInvitation.set(false);
        this.patchFormFromInvitation(saved);
        this.saveSuccess.set(true);
      },
      error: (error: unknown) => {
        this.saving.set(false);
        if (error instanceof HttpErrorResponse && error.status === 409) {
          this.saveError.set(
            'Ya existe una invitación para este evento. Usa Reintentar e inténtalo de nuevo.',
          );
          return;
        }
        this.saveError.set('No pudimos guardar los cambios. Inténtalo nuevamente.');
      },
    });
  }

  private loadPage(eventId: string): void {
    this.loading.set(true);
    this.loadError.set(null);
    this.saveError.set(null);
    this.saveSuccess.set(false);

    if (!eventId) {
      this.loading.set(false);
      this.event.set(null);
      this.invitation.set(null);
      this.template.set(null);
      this.loadError.set('Evento no válido.');
      return;
    }

    forkJoin({
      event: this.eventService.getById(eventId),
      invitation: this.invitationService.getByEventId(eventId),
      templates: this.templateService.getAll().pipe(catchError(() => of([]))),
    })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map(({ event, invitation, templates }) => {
          const template =
            templates.find((item) => item.id === invitation?.templateId) ?? null;
          return {
            event,
            invitation,
            template,
            loadError: event
              ? null
              : 'No pudimos cargar la personalización de la invitación.',
          };
        }),
        catchError((error: unknown) =>
          of({
            event: null as EventSummary | null,
            invitation: null as InvitationApiResponse | null,
            template: null as InvitationTemplate | null,
            loadError:
              getApiErrorMessage(error) ||
              'No pudimos cargar la personalización de la invitación.',
          }),
        ),
      )
      .subscribe((result) => {
        this.loading.set(false);
        this.event.set(result.event);
        this.invitation.set(result.invitation);
        this.template.set(result.template);
        this.missingInvitation.set(!!result.event && !result.invitation);
        this.loadError.set(result.loadError);

        if (result.invitation) {
          this.patchFormFromInvitation(result.invitation);
          return;
        }

        this.form.reset({
          welcomeMessage: '',
          primaryColor: '',
          secondaryColor: '',
          coverImageUrl: '',
          backgroundImageUrl: '',
          musicUrl: '',
        });
        this.form.markAsPristine();
        this.formTick.update((value) => value + 1);
      });
  }

  private patchFormFromInvitation(invitation: InvitationApiResponse): void {
    // Keep empty string in controls; map to JSON null only when building the PATCH body.
    this.form.reset({
      welcomeMessage: invitation.welcomeMessage ?? '',
      primaryColor: invitation.primaryColor ?? '',
      secondaryColor: invitation.secondaryColor ?? '',
      coverImageUrl: invitation.coverImageUrl ?? '',
      backgroundImageUrl: invitation.backgroundImageUrl ?? '',
      musicUrl: invitation.musicUrl ?? '',
    });
    this.form.markAsPristine();
    this.formTick.update((value) => value + 1);
  }

  private buildRequestBody(): UpdateInvitationCustomizationRequest {
    const raw = this.form.getRawValue();
    return {
      welcomeMessage: emptyToNull(raw.welcomeMessage),
      primaryColor: emptyToNull(raw.primaryColor),
      secondaryColor: emptyToNull(raw.secondaryColor),
      coverImageUrl: emptyToNull(raw.coverImageUrl),
      backgroundImageUrl: emptyToNull(raw.backgroundImageUrl),
      musicUrl: emptyToNull(raw.musicUrl),
    };
  }
}
