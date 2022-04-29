import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { TodoComponent } from './todo.component'

@NgModule({
  declarations: [TodoComponent],
  imports: [CommonModule],
  exports: [TodoComponent],
})
export class TodoModule {}
