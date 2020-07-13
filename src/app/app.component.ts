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
    this.successexpression = '';
    this.modalRef = this.modalService.show(ConditionBuilderComponent, {
      ariaDescribedby: 'condition builder',
      ariaLabelledBy: 'Condition Builder',
      class: 'modal-lg'
    });
    this.modalRef.content.onClose.subscribe(result => {
      console.log('results', JSON.stringify(result));
      if (result) {
        let successexpression = this.expressionFormat(result, []);

        let uniqueArr = successexpression.filter((v, i, a) => a.indexOf(v) === i);
        this.successexpression = '{{' + uniqueArr.join('') + '}}';
        // this.successexpression = JSON.stringify(uniqueArr);

        // this.successexpression = this.successexpression.replace(/^.{2}/g, '{{');

        let searchstr = 'and';
        let index = this.successexpression.indexOf('and');
        this.successexpression = this.successexpression.slice(0, index) + this.successexpression.slice(index + searchstr.length);

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

  expressionFormat(result: any, successexpression: any) {
    if (result) {

      if (result['rules'].length > 0) {
        result['rules'].forEach(ele => {
          let lookbackexp = '';
          if (ele['condition'] && ele['rules'].length > 0) {
            this.expressionFormat(ele, successexpression);
          } else { 
            if (ele.fields && ele.fields.length > 0) {
              ele['fields'].forEach(flds => {
                lookbackexp += ',' + flds.value;
              });
              successexpression.push(result['condition'] + ' ' + ele.operator + '(' + ele.value + ')' + ' ' + lookbackexp);            
            } else {
              successexpression.push(result['condition'] + ' ' + ele.operator + '(' + ele.value + ')' + ' ');
            }
          }
        });
      }

      return successexpression;
    }

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
