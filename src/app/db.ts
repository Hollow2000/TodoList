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
        this.on('populate', () => this.populate());
    }

    async populate() {
        const todoListId = await this.todoLists.add({
            title: 'Pruebas a realizar'
        });
        await this.todoItems.bulkAdd([
            {
                todoListId,
                title: 'Marcar esta tarea como lista'
            },
            {
                todoListId,
                title: 'Eliminar esta tarea'
            },
            {
                todoListId,
                title: 'Crear nueva tarea'
            },
            {
                todoListId,
                title: 'Crear nueva lista de tareas'
            }
        ]);
    }
}

export const db = new AppDB();