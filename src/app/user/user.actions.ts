import { createAction, props } from '@ngrx/store'
import { User } from './user.interface'

export const loadUsers = createAction('[Todos Page] Load Users')
export const loadUsersSuccess = createAction(
  '[API] Load Users Success',
  props<{ users: User[] }>()
)
export const loadUsersFailure = createAction('[API] Load Users Failure')
