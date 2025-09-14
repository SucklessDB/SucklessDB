import { DatabaseDefinition } from "@/services/connection-storage.service";
import { booleanAttribute, ChangeDetectionStrategy, Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { v4 as uuid } from 'uuid';

@Component({
    selector: 'connections-list',
    templateUrl: './connections-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink],
})
export class ConnectionsListComponent {
    public connections = input<DatabaseDefinition[]>();
    public opened = input(false, { transform: booleanAttribute });
    public static = input(false, { transform: booleanAttribute });
    public id = uuid();
}
