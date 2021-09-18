import { createEntityAdapter, EntityState } from '@ngrx/entity'
import { createReducer, on } from '@ngrx/store'
import * as UsersActions from './user.actions'
import { User } from './user.interface'

export const userFeatureKey = 'user'

export interface State {
  users: EntityState<User>
}

export const userAdapter = createEntityAdapter<User>({
  selectId: ({ id }) => id,
})

export const initialState: State = {
  users: userAdapter.getInitialState(),
}

export const reducer = createReducer(
  initialState,

  on(UsersActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users: userAdapter.setAll(users, state.users),
  }))
)
