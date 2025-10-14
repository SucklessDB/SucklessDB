import { inject } from '@angular/core';
import { ConnectionStorageService } from '@/services/connection-storage.service';

export const connectionsGuard = async () => {
    const connectionStoregeService = inject(ConnectionStorageService);
    await connectionStoregeService.init();
    return true;
};
