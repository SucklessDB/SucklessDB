import { inject } from "@angular/core"
import { ConnectionStorageService } from "../../services/connection-storage.service"

export const connectionFormGuard = async () => {
    const connectionStoregeService = inject(ConnectionStorageService);
    await connectionStoregeService.init();
    return true;
}
