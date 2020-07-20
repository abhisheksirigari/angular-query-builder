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
  // {"field":"lookback","operator":"Success","value":"sample_oprB","subtype":"statusdependency","isexitcode":false,"isAddFields":true,"fields":[]},{"field":"lookback","operator":"Failure","value":"sample_oprA","subtype":"statusdependency","isexitcode":false,"isAddFields":true,"fields":[{"name":"Look back","field":"lookback","type":"number","value":2},{"name":"","field":"lookbackmm","type":"number","value":3}]},{"field":"lookback","operator":"Exit code","value":"sample_oprB","subtype":"statusdependency","isexitcode":true,"isAddFields":true,"fields":[{"name":"Operator","field":"operator","type":"category","operators":["=","<=",">",">="],"value":">="},{"name":"Value","field":"value","type":"string","value":"20"},{"name":"Look back","field":"lookback","type":"number","value":4},{"name":"","field":"lookbackmm","type":"number","value":5}]},{"condition":"or","rules":[{"field":"lookback","operator":"Exit code","value":"sample_oprA","subtype":"exitcodedependency","isexitcode":true,"isAddFields":true,"fields":[{"name":"Operator","field":"operator","type":"category","operators":["=","<=",">",">="],"value":"="},{"name":"Value","field":"value","type":"string","value":"30"},{"name":"Look back","field":"lookback","type":"number","value":6},{"name":"","field":"lookbackmm","type":"number","value":7}]}]}
  

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
