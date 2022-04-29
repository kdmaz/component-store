import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { TodoStore } from './todo.store'

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
  providers: [TodoStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent implements OnInit {
  todos$ = this.todoStore.todos$
  selectedTodo$ = this.todoStore.selectedTodo$

  constructor(private readonly todoStore: TodoStore) {}

  ngOnInit(): void {
    this.todoStore.fetchTodos()
  }

  handleClick(todoId: number): void {
    this.todoStore.changeSelectedTodo(todoId)
  }
}
