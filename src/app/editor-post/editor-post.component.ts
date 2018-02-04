import { Component, OnInit } from '@angular/core';
import { FunctionsService } from '../services/functions.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-editor-post',
  templateUrl: './editor-post.component.html',
  styleUrls: ['./editor-post.component.css']
})
export class EditorPostComponent implements OnInit {
  private formGroup: FormGroup;

  private controlsConfig = {
    content: [
      '', [
        Validators.maxLength(20)
      ]
    ]
  };

  public nzAutosize = {minRows: 1, maxRows: 6};

  public nzPlaceHolder = '新しい書き込み';

  public isStorage = false;

  public isMutation = false;

  constructor(
    private fns: FunctionsService,
    private formBuilder: FormBuilder) {
  }

  public get content() {
    return this.formGroup.get('content');
  }

  public onAddPost() {
    this.isMutation = true;
    const content = this.content.value;
    const payload = {
      content: content
    };
    console.log(payload);
    /*
    this.fns.addPost(payload)
      .then(() => {
        this.content.setValue('');
      })
      .catch(err => {
        console.error(err);
        this.content.setErrors({failure: true});
      });
    */
  }

  public ngOnInit() {
    this.formGroup = this.formBuilder.group(this.controlsConfig);
  }
}
