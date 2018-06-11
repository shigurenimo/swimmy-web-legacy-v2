import { ViewHomeComponent } from './components/view-home/view-home.component';

export const threadRoutes = [{
  path: '',
  component: ViewHomeComponent,
  data: {
    title: 'スレッド検索',
    leftActionType: 'menu',
  },
}];
