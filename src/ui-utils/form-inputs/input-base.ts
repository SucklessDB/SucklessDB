/** biome-ignore-all lint/complexity/useLiteralKeys: used on many places */
import { booleanAttribute, Component, computed, DestroyRef, inject, input, type OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Validators } from '@angular/forms';
import { injectNgControl } from './input-helper';

export type InputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ErrorMessageDefinition = Record<string, string>;

@Component({ template: `` })
export abstract class InputBase implements OnInit {
    private destroyRef = inject(DestroyRef);
    private ngControl = injectNgControl();

    private controlStatus = signal<unknown>(undefined);

    public errorMessages = input<ErrorMessageDefinition>({});
    public label = input<string>();
    public help = input<string>();
    public size = input<InputSize>('md');
    public hideRequiredAsterisk = input(false, { transform: booleanAttribute });
    public get control() {
        return this.ngControl.control;
    }
    public isRequired!: boolean;
    public showError = computed(() => {
        this.controlStatus();
        return this.control.invalid && (this.control.touched || this.control.dirty);
    });
    public errorMessage = computed(() => {
        this.controlStatus();
        const errors = this.control.errors;
        if (!errors) return '';

        if (errors['required']) return 'This field is required.';
        if (errors['minlength']) return `Minimum length is ${errors['minlength'].requiredLength} characters`;
        if (errors['maxlength']) return `Maximum length is ${errors['maxlength'].requiredLength} characters`;
        if (errors['max']) return `Maximum number is ${errors['max'].max}`;
        if (errors['min']) return `Minimum number is ${errors['min'].min}`;

        const customMessages = this.errorMessages();
        for (const key in customMessages) {
            if (errors[key]) return customMessages[key];
        }

        return 'Invalid input';
    });

    protected init() {
        this.isRequired = this.ngControl.control.hasValidator(Validators.required);
        this.control.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(event => this.controlStatus.set(event));
    }

    public ngOnInit() {
        this.init();
    }
}
