import { ViewHomeComponent } from './components/view-home/view-home.component';

export const homeRoutes = [{
  path: '',
  component: ViewHomeComponent,
  data: {
    title: 'タイムライン',
    leftActionType: 'menu',
  },
}];
