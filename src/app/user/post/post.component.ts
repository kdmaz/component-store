import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { User } from '../user.interface'
import { UserStore } from '../user.store'
import { PostStore } from './post.store'
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  providers: [PostStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent implements OnInit {
  posts$ = this.postStore.posts$
  selectedPost$ = this.postStore.selectedPost$
  user$ = this.userStore.selectedUser$

  constructor(
    private readonly postStore: PostStore,
    private readonly userStore: UserStore
  ) {}

  ngOnInit(): void {
    this.postStore.fetchPosts(this.user$ as Observable<User>)
  }

  handleClick(postId: number): void {
    this.postStore.changeSelectedPost(postId)
  }
}
