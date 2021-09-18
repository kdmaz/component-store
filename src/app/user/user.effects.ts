import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { of } from 'rxjs'
import { catchError, map, switchMap } from 'rxjs/operators'
import * as UsersActions from './user.actions'
import { UserService } from './user.service'

@Injectable()
export class UserEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly userService: UserService
  ) {}

  fetchUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      switchMap(() =>
        this.userService.fetchUsers$().pipe(
          map((users) => UsersActions.loadUsersSuccess({ users })),
          catchError(() => of(UsersActions.loadUsersFailure()))
        )
      )
    )
  })
}
