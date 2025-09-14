import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SelectInputComponent, OptionDefinition } from '../../ui-utils/form-inputs/select-input/select-input.component';
import { TextInputComponent } from '../../ui-utils/form-inputs/text-input/text-input.component';
import { DatabaseConnectionCreate, DatabaseDefinition, DatabaseTypes } from '@/services/connection-storage.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, startWith } from 'rxjs';

const DefaultPorts = {
    [DatabaseTypes.PostgreSQL]: 5432,
    [DatabaseTypes.MySQL]: 3306
}

@Component({
    selector: 'create-connection',
    templateUrl: './create-connection.component.html',
    imports: [ReactiveFormsModule, SelectInputComponent, TextInputComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateConnectionComponent {
    private formBuilder = inject(FormBuilder);
    private cdr = inject(ChangeDetectorRef);

    public existingConnection = input<DatabaseDefinition>();
    public connectionCreate = output<DatabaseConnectionCreate>();

    public databaseTypeOptions: OptionDefinition[] = Object.values(DatabaseTypes).map(db => ({ value: db, label: db }));
    public connectionForm: FormGroup = this.formBuilder.group({
        db_type: [DatabaseTypes.PostgreSQL],
        name: ['', Validators.required],
        host: ['', Validators.required],
        port: [DefaultPorts[DatabaseTypes.PostgreSQL], [Validators.required, Validators.min(1), Validators.max(65535)]],
        username: ['', Validators.required],
        password: [''],
        database_name: ['', Validators.required],
        is_production: [false],
    });

    private get connectionDetails() {
        if(this.connectionForm.valid) {
            return this.connectionForm.value as DatabaseConnectionCreate;
        }

        return undefined;
    }

    public get isFormValid(): boolean {
        return this.connectionForm.valid;
    }

    constructor() {
        this.connectionForm.valueChanges.pipe(
            startWith(this.connectionForm.value),
            distinctUntilChanged((prev, curr) => prev.db_type === curr.db_type),
            takeUntilDestroyed()
        ).subscribe(value => {
            this.connectionForm.patchValue({ port: DefaultPorts[value.db_type] }, { emitEvent: false });
            this.cdr.markForCheck();
        });

        effect(() => {
            const existingConnection = this.existingConnection();

            if(existingConnection) {
                const strippedConnection = (({ id, ...connection }) => connection)(existingConnection);
                this.connectionForm.setValue({ ...strippedConnection, password: '' });
            } else {
                this.connectionForm.reset();
                this.connectionForm.patchValue({ db_type: DatabaseTypes.PostgreSQL });
            }
        })
    }

    public onSubmit() {
        if (this.connectionDetails) {
            this.connectionCreate.emit(this.connectionDetails);
            this.connectionForm.reset();
        }
    }
}
