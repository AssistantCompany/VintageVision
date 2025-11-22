import * as schema from './schema.js';
export declare const db: import("drizzle-orm/node-postgres").NodePgDatabase<typeof schema>;
export declare function checkDatabaseHealth(): Promise<boolean>;
export declare function closeDatabaseConnection(): Promise<void>;
//# sourceMappingURL=client.d.ts.map