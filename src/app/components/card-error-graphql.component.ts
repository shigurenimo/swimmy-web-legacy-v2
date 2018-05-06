import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-error-graphql',
  template: `
    <nz-card>
      <ng-template #body>
        <h1>GraphQL ERROR</h1>
        <p>アプリにバグが見つかりました。復旧まで暫くお待ちください。</p>
      </ng-template>
    </nz-card>
  `,
  styles: [`
    :host {
      display: block;
      padding: 16px;
    }
  `]
})
export class CardErrorGraphqlComponent {
  @Input() errors;
}
