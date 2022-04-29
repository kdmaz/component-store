import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PostComponent } from './post.component'
import { PostService } from './post.service'

@NgModule({
  imports: [CommonModule],
  declarations: [PostComponent],
  providers: [PostService],
  exports: [PostComponent],
})
export class PostModule {}
