import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'
import { createEntityAdapter, EntityState } from '@ngrx/entity'
import { Store } from '@ngrx/store'
import { EMPTY } from 'rxjs'
import { catchError, delay, map } from 'rxjs/operators'
import { User } from '../user/user.interface'
import { getUserEntities } from '../user/user.selectors'
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
    private readonly store: Store
  ) {
    // initial state
    super({
      posts: postAdapter.getInitialState(),
      selectedPostId: null,
    })
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
    this.store.select(getUserEntities),
    this.selectedPostId$,
    this.postEntities$,
    (userEntities, selectedPostId, postEntities) => {
      if (!selectedPostId || !userEntities) {
        return
      }

      const post = postEntities[selectedPostId] as Post
      const user = userEntities[post.userId] as User

      return {
        post,
        user,
      }
    }
  )

  // reducers
  private readonly addPosts = this.updater((state, posts: Post[]) => ({
    ...state,
    posts: postAdapter.setAll(posts, state.posts),
  }))

  readonly changeSelectedPost = this.updater(
    (state, selectedPostId: number) => ({
      ...state,
      selectedPostId,
    })
  )

  // effects
  readonly fetchPosts = this.effect(() => {
    return this.postService.fetchPosts$().pipe(
      delay(1000),
      map((posts) => this.addPosts(posts)),
      catchError(() => {
        console.error('failed to load posts!')
        return EMPTY
      })
    )
  })
}
