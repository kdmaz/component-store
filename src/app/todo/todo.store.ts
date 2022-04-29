import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'
import { createEntityAdapter, EntityState } from '@ngrx/entity'
import { EMPTY, Observable } from 'rxjs'
import { catchError, delay, tap, switchMap } from 'rxjs/operators'
import { User } from '../user/user.interface'
import { Todo } from './todo.interface'
import { TodoService } from './todo.service'

interface State {
  todos: EntityState<Todo>
  selectedTodoId: number | null
}

const todoAdapter = createEntityAdapter<Todo>({
  selectId: ({ id }) => id,
})

@Injectable()
export class TodoStore extends ComponentStore<State> {
  constructor(private readonly todoService: TodoService) {
    // initial state
    super({
      todos: todoAdapter.getInitialState(),
      selectedTodoId: null,
    })
  }

  // selectors
  private readonly s$ = this.select((state) => state)
  readonly todos$ = this.select(this.s$, (state) => {
    return state.todos.ids.map((id) => state.todos.entities[id]) as Todo[]
  })
  private readonly selectedTodoId$ = this.select(
    (state) => state.selectedTodoId
  )
  private readonly todoEntities$ = this.select(
    this.s$,
    (state) => state.todos.entities
  )
  readonly selectedTodo$ = this.select(
    this.selectedTodoId$,
    this.todoEntities$,
    (selectedTodoId, todoEntities) => {
      if (!selectedTodoId) {
        return
      }

      const todo = todoEntities[selectedTodoId] as Todo
      return todo
    }
  )

  // reducers
  private readonly addTodos = this.updater((state, todos: Todo[]) => ({
    ...state,
    todos: todoAdapter.setAll(todos, state.todos),
  }))

  readonly changeSelectedTodo = this.updater(
    (state, selectedTodoId: number) => ({
      ...state,
      selectedTodoId,
    })
  )

  // effects
  readonly fetchTodos = this.effect((user$: Observable<User>) =>
    user$.pipe(
      switchMap((user) =>
        this.todoService.fetchTodos$(user.id).pipe(
          delay(1000),
          tap((todos) => this.addTodos(todos)),
          catchError(() => {
            console.error('failed to load todos!')
            return EMPTY
          })
        )
      )
    )
  )
}
