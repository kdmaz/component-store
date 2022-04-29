import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule } from '@ngrx/store'
import { UserEffects } from './user.effects'
import { reducer, userFeatureKey } from './user.reducer'
import { UserComponent } from './user.component'

@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    StoreModule.forFeature(userFeatureKey, reducer),
    EffectsModule.forFeature([UserEffects]),
  ],
  exports: [UserComponent],
})
export class UserModule {}
