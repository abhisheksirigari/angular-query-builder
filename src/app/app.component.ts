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
    this.toastr.success('The Sample' + this.operationName + ' has been successfully completed!', '', {
      disableTimeOut: true
    });    
  }

  openConditionbuilder() {
    this.modalRef = this.modalService.show(ConditionBuilderComponent, {
      ariaDescribedby: 'condition builder',
      ariaLabelledBy: 'Condition Builder',
      class: 'modal-lg'
    });
    this.modalRef.content.onClose.subscribe(result => {
      console.log('results', JSON.stringify(result));
      this.successexpression = JSON.stringify(result);

      setTimeout( () => {
        this.toastr.success('The Sample' + this.operationName + ' has been successfully completed!', '', {
          disableTimeOut: true
        });
      }, 1000);      
    });
  }

  save() {

  }

  refresh() {
    this.successexpression = '';
  }

}
