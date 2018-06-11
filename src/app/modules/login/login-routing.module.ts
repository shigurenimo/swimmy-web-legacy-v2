import { ViewHomeComponent } from './components/view-home/view-home.component';

export const loginRoutes = [{
  path: '',
  component: ViewHomeComponent,
  data: {
    title: 'ログイン',
    leftActionType: 'menu',
  },
}];
