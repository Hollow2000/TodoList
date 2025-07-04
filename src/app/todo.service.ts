import { Injectable } from '@angular/core';
import { db, TodoItem } from './db';
import { liveQuery, Observable } from 'dexie';

export interface TodoListWithItems {
  id?: number;
  title: string;
  items: TodoItem[]
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  getTodoListWithItems():Observable<TodoListWithItems[]> {
    return liveQuery(async () => {
      const lists = await db.todoLists.toArray();
      const result = await Promise.all(
        lists.map(async list => {
          const items = await db.todoItems.where('todoListId').equals(list.id!).toArray();
          items.sort((a, b) => (a.done === b.done) ? 0 : a.done ? 1 : -1);
          return { ...list, items };
        })
      );
      return result;
    });
  }

  async addTodoList(title: string) {
    return db.todoLists.add({title});
  }

  async deleteList(listId: number){
    return db.todoLists.delete(listId);
  }

  async addTodoItem(item: TodoItem): Promise<number> {
    return db.todoItems.add({...item, done: false});
  }

  async getTodoItems(listId?: number): Promise<TodoItem[]> {
    if (listId) {
      return db.todoItems.where('todoListId').equals(listId).toArray();
    } else {
      return db.todoItems.toArray();
    }
  }

  async updateTodoItem(id: number, updates: Partial<TodoItem>): Promise<number> {
    return db.todoItems.update(id, updates);
  }

  async markTodoItem(id: number, done: boolean) {
    return db.todoItems.update(id, { done });
  }

  async deleteTodoItem(id: number) {
    return db.todoItems.delete(id);
  }
}
