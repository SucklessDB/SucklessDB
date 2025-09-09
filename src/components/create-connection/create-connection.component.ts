import { ChangeDetectorRef, Component, inject, output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SelectInputComponent, OptionDefinition } from '../../ui-utils/form-inputs/select-input/select-input.component';
import { TextInputComponent } from '../../ui-utils/form-inputs/text-input/text-input.component';
import { DatabaseConnectionCreate, DatabaseTypes } from '@/services/connection-storage.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const DefaultPorts = {
    [DatabaseTypes.PostgreSQL]: 5432,
    [DatabaseTypes.MySQL]: 3306
}

@Component({
    selector: 'create-connection',
    templateUrl: './create-connection.component.html',
    imports: [ReactiveFormsModule, SelectInputComponent, TextInputComponent]
})
export class CreateConnectionComponent {
    private formBuilder = inject(FormBuilder);
    private cdr = inject(ChangeDetectorRef);

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

    public databaseTypeOptions: OptionDefinition[] = Object.values(DatabaseTypes).map(db => ({ value: db, label: db }));
    public connectionCreated = output<DatabaseConnectionCreate>();

    constructor() {
        this.connectionForm.valueChanges.pipe(takeUntilDestroyed()).subscribe(value => {
            this.connectionForm.patchValue({ port: DefaultPorts[value.db_type] }, { emitEvent: false });
            this.cdr.markForCheck();
        });
    }

    public onSubmit() {
        if (this.connectionForm.valid) {
            this.connectionCreated.emit(this.connectionForm.value as DatabaseConnectionCreate);
            this.connectionForm.reset();
        }
    }

    public get isFormValid(): boolean {
        return this.connectionForm.valid;
    }
}
