import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'
import { Store } from '@ngrx/store'
import { getUserEntities } from './user.selectors'
import { User } from './user.interface'

interface State {
  selectedUserId: number | null
}

@Injectable()
export class UserStore extends ComponentStore<State> {
  constructor(private readonly store: Store) {
    // initial state
    super({
      selectedUserId: null,
    })
  }

  // selectors
  private readonly s$ = this.select((state) => state)

  private readonly selectedUserId$ = this.select(
    (state) => state.selectedUserId
  )

  readonly selectedUser$ = this.select(
    this.store.select(getUserEntities),
    this.selectedUserId$,
    (userEntities, selectedUserId) => {
      if (!selectedUserId || !userEntities) {
        return
      }

      const user = userEntities[selectedUserId] as User
      return user
    }
  )

  // reducers
  readonly changeSelectedUser = this.updater(
    (state, selectedUserId: number) => ({
      ...state,
      selectedUserId,
    })
  )
}
