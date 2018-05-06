import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-error-network',
  template: `
    <nz-card>
      <ng-template #body>
        <h1>{{error.name}}</h1>
        <p>{{error.message}}</p>
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
export class CardErrorNetworkComponent {
  @Input() error = null;
}
