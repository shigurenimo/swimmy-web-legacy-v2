import { ViewDetailComponent } from './components/view-detail/view-detail.component';

export const usersRoutes = [{
  path: ':username',
  component: ViewDetailComponent,
  data: {
    title: 'ユーザ',
    leftActionType: 'return',
  },
}];
