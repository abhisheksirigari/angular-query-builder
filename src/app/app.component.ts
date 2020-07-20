import { Component, TemplateRef, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConditionBuilderComponent } from './condition-builder/condition-builder/condition-builder.component';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'querybuilder-app';
  operationName: string = "SAMPLE_OPERATION_type";
  successexpression = '';
  modalData = {
    condition: 'and',
    rules: [
      
    ]
  };

  querybuilderForm: FormGroup;
  submitted = false;

  modalRef: BsModalRef;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.successexpression = '';

    this.querybuilderForm = this.formBuilder.group({
      operName: ['', Validators.required],
      expression: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.querybuilderForm.controls; }

  openConditionbuilder() {
    const initialState = {
      modalData: this.modalData
    };
    this.modalRef = this.modalService.show(ConditionBuilderComponent, {
      initialState,
      backdrop: "static",
      keyboard: false,
      ariaDescribedby: 'condition builder',
      ariaLabelledBy: 'Condition Builder',
      class: 'modal-lg'
    });
    this.modalRef.content.onClose.subscribe(result => {
      console.log('results', JSON.stringify(result));
      if (result) {
        this.modalData = result;
        this.successexpression = '{{' + result['output'] + '}}';

        this.successexpression = this.successexpression.replace('and  (  (   )  or', 'or');
        this.successexpression = this.successexpression.replace('and  (  (   )  and', 'and');
        this.successexpression = this.successexpression.replace('or  (  (   )  or', 'or');
        this.successexpression = this.successexpression.replace('or  (  (   )  and', 'and');

        this.successexpression = this.successexpression.replace(/and/g, 'AND');
        this.successexpression = this.successexpression.replace(/or/g, 'OR');

        setTimeout(() => {
          this.toastr.success('The Sample' + this.operationName + ' has been successfully completed!', '', {
            timeOut: 3000
          });
        }, 1000);
      }
    });
  }

  save() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.querybuilderForm.invalid) {
      return;
    }
  }

  refresh() {
    this.successexpression = '';
  }

}
