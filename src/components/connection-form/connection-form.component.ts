import { DatabaseModel, DatabaseTypes } from '@/services/connection-storage.service';
import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { distinctUntilChanged, startWith } from 'rxjs';
import { OptionDefinition, SelectInputComponent } from '../../ui-utils/form-inputs/select-input/select-input.component';
import { TextInputComponent } from '../../ui-utils/form-inputs/text-input/text-input.component';

const DefaultPorts = {
    [DatabaseTypes.PostgreSQL]: 5432,
    [DatabaseTypes.MySQL]: 3306
}

@Component({
    selector: 'connection-form',
    templateUrl: './connection-form.component.html',
    imports: [ReactiveFormsModule, SelectInputComponent, TextInputComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionFormComponent {
    private formBuilder = inject(FormBuilder);

    public readonly connection = input<DatabaseModel>();

    private _isFormValid = signal(true);
    public readonly isFormValid = this._isFormValid.asReadonly();

    public get value(): DatabaseModel {
        return this.connectionForm.getRawValue();
    }

    public databaseTypeOptions: OptionDefinition[] = Object.values(DatabaseTypes).map(db => ({ value: db, label: db }));
    public connectionForm = this.formBuilder.nonNullable.group({
        db_type: [DatabaseTypes.PostgreSQL],
        name: ['', Validators.required],
        host: ['', Validators.required],
        port: [DefaultPorts[DatabaseTypes.PostgreSQL], [Validators.required, Validators.min(1), Validators.max(65535)]],
        username: ['', Validators.required],
        password: [''],
        database_name: ['', Validators.required],
        is_production: [false],
    });

    constructor() {
        this.connectionForm.valueChanges.pipe(
            startWith(this.connectionForm.value),
            distinctUntilChanged((prev, curr) => prev.db_type === curr.db_type),
            takeUntilDestroyed()
        ).subscribe(value => {
            this.connectionForm.patchValue({ port: DefaultPorts[value.db_type || DatabaseTypes.PostgreSQL] }, { emitEvent: false });
        });

        this.connectionForm.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
            this._isFormValid.set(this.connectionForm.valid);
        });

        effect(() => {
            const connection = this.connection();
            if(connection) {
                this.connectionForm.setValue(connection, { emitEvent: false });
                this._isFormValid.set(this.connectionForm.valid);
            } else {
                this.connectionForm.reset();
            }
        })
    }
}
