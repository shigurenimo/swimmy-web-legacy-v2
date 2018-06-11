import { ViewDetailComponent } from './components/view-detail/view-detail.component';

export const postsRoutes = [{
  path: ':postId',
  component: ViewDetailComponent,
  data: {
    title: 'スレッド',
    leftActionType: 'return',
  },
}];
