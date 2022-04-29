import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { loadUsers } from './user.actions'
import { getUsers } from './user.selectors'
import { UserStore } from './user.store'

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [UserStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnInit {
  users$ = this.store.select(getUsers)
  selectedUser$ = this.userStore.selectedUser$

  constructor(
    private readonly userStore: UserStore,
    private readonly store: Store
  ) {}

  ngOnInit() {
    this.store.dispatch(loadUsers())
  }

  handleClick(userId: number): void {
    this.userStore.changeSelectedUser(userId)
  }
}
