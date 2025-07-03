import Dexie, { Table } from 'dexie';

export interface TodoList {
    id?: number;
    title: string;
}

export interface TodoItem {
    id?: number;
    todoListId: number;
    title: string;
    done?: boolean;
}

export class AppDB extends Dexie {
    todoLists!: Table<TodoList, number>;
    todoItems!: Table<TodoItem, number>;

    constructor() {
        super('ngdexieliveQuery');
        this.version(1).stores({
            todoLists: '++id',
            todoItems: '++id, todoListId'
        });
    }
}

export const db = new AppDB();