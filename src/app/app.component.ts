import { Component, ElementRef, HostListener, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoListWithItems, TodoService } from './todo.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  // #region Configuracion inical
  private readonly _todoService = inject(TodoService);

  todoList$ = signal<TodoListWithItems[]>([]);

  private scrollInterval: any;
  showAddPage = false;
  showPrev = false;
  showNext = false;

  constructor(private elRef: ElementRef<HTMLElement>) { }

  ngOnInit(): void {
    this._todoService.getTodoListWithItems().subscribe((list) => {
      this.todoList$.set(list);
      this.showAddPage = true;
      setTimeout(() => {
        this.updateArrows();
      }, 500);
    });
  }

  // Detectar scroll en el host
  @HostListener('scroll')
  onScroll() {
    this.updateArrows();
  }
  // #endregion

  //#region Metodos Items
  async markItem(id: number, done: boolean) {
    await this._todoService.markTodoItem(id, done);
  }

  toggleNew(elemet: HTMLElement, enable: boolean) {
    elemet.contentEditable = String(enable);
    if (enable) {
      elemet.innerText = '';
      elemet.focus();
    } else {
      elemet.innerText = 'Agregar nueva tarea';
    }
  }

  toggleEdit(elemet: HTMLElement, enable: boolean, title?: string) {
    elemet.contentEditable = String(enable);
    if (enable) {
      elemet.innerText = '';
      elemet.focus();
    } else if (title) {
      elemet.innerText = title;
    }
  }

  async addItem(elemet: HTMLElement, listId: number) {
    if (elemet.textContent && elemet.textContent !== '') {
      const res = await this._todoService.addTodoItem({
        title: elemet.textContent,
        todoListId: listId
      });
      if (res) {
        this.toggleNew(elemet, false);
      }
    }
  }

  async editItem(todoId: number, elemet: HTMLElement) {

    const title = elemet.textContent!;
    if (title && title !== '') {
      const res = await this._todoService.updateTodoItem(todoId, { title });
      if (res) {
        this.toggleEdit(elemet, false);
      }
    }
  }

  async deleteItem(todoId: number) {
    await this._todoService.deleteTodoItem(todoId);
  }
  //#endregion

  //#region Metodos Lists
  async toggleList(elemet: HTMLElement, enable: boolean) {
    elemet.contentEditable = String(enable);
    if (enable) {
      elemet.innerText = '';
      elemet.focus();
    } else {
      elemet.innerText = 'Agregar lista';
    }
  }

  async addList(elemet: HTMLElement) {
    if (elemet.textContent && elemet.textContent !== '') {
      await this._todoService.addTodoList(elemet.textContent)
      this.toggleList(elemet, false);
      setTimeout(() => {
        this.scroll('left');
      }, 100);
    }
  }

  async deleteList(listId: number) {
    this._todoService.deleteList(listId);
  }
  //#endregion

  //#region Scroll Methods
  scroll(direction: 'left' | 'right') {
    clearInterval(this.scrollInterval);
    const container = this.elRef.nativeElement;
    const speed = 10;
    const step = direction === 'right' ? speed : -speed;
    container.scrollBy({ left: step });
  }

  startScrolling(direction: 'left' | 'right') {
    const container = this.elRef.nativeElement;
    const speed = 10;
    const delay = 16;

    this.scrollInterval = setInterval(() => {
      const step = direction === 'right' ? speed : -speed;
      container.scrollBy({ left: step });
      if ((direction === 'left' && !this.showPrev) ||
        (direction === 'right' && !this.showNext)) {
        this.stopScrolling();
      }
    }, delay);
  }

  stopScrolling() {
    clearInterval(this.scrollInterval);
  }

  private updateArrows() {
    const el = this.elRef.nativeElement;
    const scrollLeft = el.scrollLeft;
    const maxScrollLeft = el.scrollWidth - el.clientWidth;

    const hasOverflow = el.scrollWidth > el.clientWidth;

    this.showPrev = hasOverflow && scrollLeft > 5;       // mostrar si no estamos al inicio
    this.showNext = hasOverflow && scrollLeft < maxScrollLeft - 5; // mostrar si no estamos al final
  }
  //#endregion
}
