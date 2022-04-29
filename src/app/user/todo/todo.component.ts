import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { User } from '../user.interface'
import { UserStore } from '../user.store'
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
  user$ = this.userStore.selectedUser$

  constructor(
    private readonly todoStore: TodoStore,
    private readonly userStore: UserStore
  ) {}

  ngOnInit(): void {
    this.todoStore.fetchTodos(this.user$ as Observable<User>)
  }

  handleClick(todoId: number): void {
    this.todoStore.changeSelectedTodo(todoId)
  }
}
