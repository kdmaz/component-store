import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'
import { createEntityAdapter, EntityState } from '@ngrx/entity'
import { Store } from '@ngrx/store'
import { EMPTY } from 'rxjs'
import { catchError, delay, map } from 'rxjs/operators'
import { User } from '../user/user.interface'
import { getUserEntities } from '../user/user.selectors'
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
  constructor(
    private readonly todoService: TodoService,
    private readonly store: Store
  ) {
    // intialstate
    super({
      todos: todoAdapter.getInitialState(),
      selectedTodoId: null,
    })
  }

  // selectors
  readonly todos$ = this.select((state) => {
    return state.todos.ids.map((id) => state.todos.entities[id]) as Todo[]
  })
  private readonly selectedTodoId$ = this.select(
    (state) => state.selectedTodoId
  )
  private readonly todoEntities$ = this.select((state) => state.todos.entities)
  readonly selectedTodo$ = this.select(
    this.store.select(getUserEntities),
    this.selectedTodoId$,
    this.todoEntities$,
    (userEntities, selectedTodoId, todoEntities) => {
      if (!selectedTodoId || !userEntities) {
        return
      }

      const todo = todoEntities[selectedTodoId] as Todo
      const user = userEntities[todo.userId] as User

      return {
        todo,
        user,
      }
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
  readonly fetchTodos = this.effect(() => {
    return this.todoService.fetchTodos$().pipe(
      delay(1000),
      map((todos) => this.addTodos(todos)),
      catchError(() => {
        console.error('failed to load todos!')
        return EMPTY
      })
    )
  })
}
