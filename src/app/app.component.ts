import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoListWithItems, TodoService } from './todo.service';
import { TodoItem, TodoList } from './db';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private readonly _todoService = inject(TodoService);

  title = 'prueba-dexie';
  todoList$ = signal<TodoListWithItems[]>([]);

  ngOnInit(): void {
    this._todoService.getTodoListWithItems().subscribe((list) => this.todoList$.set(list));
  }

  async markItem(id: number, done: boolean) {
    const res = await this._todoService.markTodoItem(id,done);
    // if (res) {
    //   this.todoItems.set(await this._todoService.getTodoItems());
    // }
  }

  toggleNew(elemet: HTMLElement, enable: boolean){
    elemet.contentEditable = String(enable);
    if (enable) {
      elemet.innerText = '';
      elemet.focus();
    } else {
      elemet.innerText = 'Agregar nueva tarea';
    }
  }

  toggleEdit(elemet: HTMLElement, enable: boolean, title?: string){
    elemet.contentEditable = String(enable);
    if (enable) {
      elemet.innerText = '';
      elemet.focus();
    } else if (title) {
      elemet.innerText = title;
    }
  }

  async addItem(elemet: HTMLElement,listId: number) {
    if (elemet.textContent && elemet.textContent !== '') {
      const res = await this._todoService.addTodoItem({
        title: elemet.textContent,
        todoListId: listId
      });
      if (res) {
        this.toggleNew(elemet, false);
        // this.todoItems.set(await this._todoService.getTodoItems());
      }
    }
  }

  async editItem(todoId: number, elemet: HTMLElement) {
    const title = elemet.textContent!;
    if(title && title !== '') {
      const res = await this._todoService.updateTodoItem(todoId,{title});
      if (res) {
        this.toggleEdit(elemet, false);
        // this.todoItems.set(await this._todoService.getTodoItems());
      }
    }
  }

  async deleteItem(todoId: number) {
    await this._todoService.deleteTodoItem(todoId);
    // this.todoItems.set(await this._todoService.getTodoItems());
  }
}
