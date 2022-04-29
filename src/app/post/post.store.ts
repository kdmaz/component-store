import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'
import { createEntityAdapter, EntityState } from '@ngrx/entity'
import { EMPTY, Observable } from 'rxjs'
import { catchError, delay, tap, switchMap } from 'rxjs/operators'
import { User } from '../user/user.interface'
import { UserStore } from './../user/user.store'
import { Post } from './post.interface'
import { PostService } from './post.service'

interface State {
  posts: EntityState<Post>
  selectedPostId: number | null
}

const postAdapter = createEntityAdapter<Post>({
  selectId: ({ id }) => id,
})

@Injectable()
export class PostStore extends ComponentStore<State> {
  constructor(
    private readonly postService: PostService,
    private readonly userStore: UserStore
  ) {
    // initial state
    super({
      posts: postAdapter.getInitialState(),
      selectedPostId: null,
    })

    this.userStore.selectedUser$.subscribe(() => this.reset())
  }

  // selectors
  private readonly s$ = this.select((state) => state)
  readonly posts$ = this.select(this.s$, (state) => {
    return state.posts.ids.map((id) => state.posts.entities[id]) as Post[]
  })
  private readonly selectedPostId$ = this.select(
    (state) => state.selectedPostId
  )
  private readonly postEntities$ = this.select(
    this.s$,
    (state) => state.posts.entities
  )
  readonly selectedPost$ = this.select(
    this.selectedPostId$,
    this.postEntities$,
    (selectedPostId, postEntities) => {
      if (!selectedPostId) {
        return
      }

      const post = postEntities[selectedPostId] as Post
      return post
    }
  )

  // reducers
  private readonly addPosts = this.updater((state, posts: Post[]) => ({
    ...state,
    posts: postAdapter.setAll(posts, state.posts),
  }))

  readonly changeSelectedPost = this.updater(
    (state, selectedPostId: number | null) => ({
      ...state,
      selectedPostId,
    })
  )

  // effects
  readonly reset = this.effect((trigger$) =>
    trigger$.pipe(
      tap(() => {
        this.changeSelectedPost(null)
        this.addPosts([])
      })
    )
  )

  readonly fetchPosts = this.effect((user$: Observable<User>) =>
    user$.pipe(
      switchMap((user) =>
        this.postService.fetchPosts$(user.id).pipe(
          delay(1000),
          tap((todos) => this.addPosts(todos)),
          catchError(() => {
            console.error('failed to load posts!')
            return EMPTY
          })
        )
      )
    )
  )
}
