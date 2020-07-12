import { Component, TemplateRef, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConditionBuilderComponent } from './condition-builder/condition-builder/condition-builder.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'querybuilder-app';
  operationName: string = "SAMPLE_OPERATION_type";
  successexpression = '';

  modalRef: BsModalRef;

  constructor(
    private toastr: ToastrService,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.successexpression = '';
  }

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
        let successexpression = '';
        Object.keys(result).forEach(res => {
          result['rules'].forEach(ele => {
            successexpression += result['condition'] + ' ' + ele.operator + '(' + ele.value + ')' +  ' ';        
          });          
        });
        this.successexpression = successexpression;
        setTimeout(() => {
          this.toastr.success('The Sample' + this.operationName + ' has been successfully completed!', '', {
            timeOut: 3000
          });
        }, 1000);
      }
    });
  }

  save() {

  }

  refresh() {
    this.successexpression = '';
  }

}
