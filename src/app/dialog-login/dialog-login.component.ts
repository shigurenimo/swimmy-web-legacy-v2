import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-dialog-login',
  templateUrl: './dialog-login.component.html',
  styleUrls: ['./dialog-login.component.css']
})
export class DialogLoginComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private afAuth: AngularFireAuth) {
  }
}
