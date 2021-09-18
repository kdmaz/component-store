import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule } from '@ngrx/store'
import { UserEffects } from './user.effects'
import { reducer, userFeatureKey } from './user.reducer'

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(userFeatureKey, reducer),
    EffectsModule.forFeature([UserEffects]),
  ],
})
export class UserModule {}
