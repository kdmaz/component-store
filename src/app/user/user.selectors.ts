import { createFeatureSelector, createSelector } from '@ngrx/store'
import * as fromUsers from './user.reducer'
import { userAdapter } from './user.reducer'

export const selectUsersState = createFeatureSelector<fromUsers.State>(
  fromUsers.userFeatureKey
)

const getUserAdapter = createSelector(selectUsersState, ({ users }) => users)
export const { selectEntities: getUserEntities, selectAll: getUsers } =
  userAdapter.getSelectors(getUserAdapter)
