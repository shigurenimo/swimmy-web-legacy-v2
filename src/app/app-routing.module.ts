import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: 'storage',
  loadChildren: 'app/modules/storage/storage.module#StorageModule',
}, {
  path: 'login',
  loadChildren: 'app/modules/login/login.module#LoginModule',
}, {
  path: 'posts',
  loadChildren: 'app/modules/posts/posts.module#PostsModule',
}, {
  path: 'threads',
  loadChildren: 'app/modules/threads/threads.module#ThreadsModule',
}, {
  path: 'settings',
  loadChildren: 'app/modules/settings/settings.module#SettingsModule',
}, {
  path: '',
  loadChildren: 'app/modules/home/home.module#HomeModule',
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
