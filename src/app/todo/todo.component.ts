import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { loadUsers } from '../user/user.actions'
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

  constructor(
    private readonly todoStore: TodoStore,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.store.dispatch(loadUsers())
    this.todoStore.fetchTodos()
  }

  handleClick(todoId: number): void {
    this.todoStore.changeSelectedTodo(todoId)
  }
}
