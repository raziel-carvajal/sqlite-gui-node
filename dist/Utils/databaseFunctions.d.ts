import type { Database } from "sqlite3";
interface Query {
    id: number;
    name: string;
    sqlstatement: string;
}
interface ColumnInfo {
    field: string;
    type: string;
    fk?: any[];
}
interface ForeignKeyInfo {
    table: string;
    from: string;
    to: string;
}
interface FetchTableForeignKeysResult {
    bool: boolean;
    data?: ForeignKeyInfo[];
    error?: string;
}
interface UserRecord {
    id: number;
    name: string;
    password: string;
}
declare function InitializeDB(db: Database): Promise<void>;
declare function insertQuery(db: Database, name: string, sqlStatement: string): Promise<{
    bool: boolean;
    error?: string;
}>;
declare function fetchQueries(db: Database): Promise<{
    bool: boolean;
    data?: Query[];
}>;
declare function fetchAllTables(db: Database): Promise<{
    bool: boolean;
    data?: string[];
}>;
declare function fetchTable(db: Database, table: string): Promise<{
    bool: boolean;
    data?: any[];
}>;
declare function fetchRecord(db: Database, table: string, label: string, id: number | string): Promise<{
    bool: boolean;
    data?: any[];
}>;
declare function fetchTableInfo(db: Database, table: string): Promise<{
    bool: boolean;
    data?: ColumnInfo[];
}>;
declare function fetchAllTableInfo(db: Database, table: string): Promise<{
    bool: boolean;
    data?: ColumnInfo[];
}>;
declare function fetchTableForeignKeys(db: Database, table: string): Promise<FetchTableForeignKeysResult>;
declare function fetchFK(db: Database, table: string, column: string): Promise<{
    bool: boolean;
    data: any[];
}>;
declare function runQuery(db: Database, sqlStatement: string): Promise<{
    bool: boolean;
    error?: string;
}>;
declare function runSelectQuery(db: Database, sqlStatement: string): Promise<{
    bool: boolean;
    data?: any[];
}>;
declare function checkColumnHasDefault(db: Database, tableName: string, columnType: string, columnName: string): Promise<{
    bool: boolean;
    message?: string;
    error?: string;
}>;
declare function deleteFromTable(db: Database, name: string, id: number | string): Promise<{
    bool: boolean;
    error?: string;
}>;
declare function exportDatabaseToSQL(db: Database): Promise<{
    bool: boolean;
    filePath?: string;
    error?: string;
}>;
declare function fetchUser(db: Database, username: string): Promise<{
    bool: boolean;
    data: UserRecord;
}>;
declare const _default: {
    InitializeDB: typeof InitializeDB;
    checkColumnHasDefault: typeof checkColumnHasDefault;
    deleteFromTable: typeof deleteFromTable;
    exportDatabaseToSQL: typeof exportDatabaseToSQL;
    fetchAllTableInfo: typeof fetchAllTableInfo;
    fetchAllTables: typeof fetchAllTables;
    fetchFK: typeof fetchFK;
    fetchQueries: typeof fetchQueries;
    fetchRecord: typeof fetchRecord;
    fetchTable: typeof fetchTable;
    fetchTableForeignKeys: typeof fetchTableForeignKeys;
    fetchTableInfo: typeof fetchTableInfo;
    fetchUser: typeof fetchUser;
    insertQuery: typeof insertQuery;
    runQuery: typeof runQuery;
    runSelectQuery: typeof runSelectQuery;
};
export default _default;
