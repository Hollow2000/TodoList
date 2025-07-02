import { Injectable } from '@angular/core';
import { db, TodoItem, TodoList } from './db';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  // LIST METHODS
  async getTodoLists(): Promise<TodoList[]> {
    return db.todoLists.toArray();
  }

  // ITEMS METHODS
  async addTodoItem(item: TodoItem): Promise<number> {
    return db.todoItems.add(item);
  }

  async getTodoItems(listId?: number): Promise<TodoItem[]> {
    if (listId) {
      return db.todoItems.where('todoListId').equals(listId).toArray();
    } else {
      return db.todoItems.toArray();
    }
  }

  async updateTodoItem(id: number, updates: Partial<TodoItem> ): Promise<number> {
    return db.todoItems.update(id, updates);
  }

  async markTodoItem(id: number, done: boolean) {
    return db.todoItems.update(id,{done});
  }

  async deleteTodoItem(id: number) {
    return db.todoItems.delete(id);
  }
}
