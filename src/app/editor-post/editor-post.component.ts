import { Component, OnInit } from '@angular/core';
import { FunctionsService } from '../services/functions.service';
import {
  FormBuilder, FormControl, FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-editor-post',
  templateUrl: './editor-post.component.html',
  styleUrls: ['./editor-post.component.css']
})
export class EditorPostComponent implements OnInit {
  public options: FormGroup;

  public content = new FormControl('', [Validators.maxLength(400)]);

  private inProgress = false;

  get contentError() {
    if (this.content.hasError('failure')) {
      return '失敗しました';
    }
    return '';
  }

  constructor(
    private fns: FunctionsService,
    private fb: FormBuilder) {
    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'auto'
    });
  }

  ngOnInit() {
  }

  onCreatePostClick() {
    const payload = {
      content: this.content.value
    };
    this.fns.createPost(payload)
      .then(() => {
        this.content.setValue('');
      })
      .catch(err => {
        console.error(err);
        this.content.setErrors({failure: true});
      });
  }
}
