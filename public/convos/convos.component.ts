import { Component, OnInit } from "angular2/core";
import { Router, CanActivate } from "angular2/router";
import { User, Convo } from "../types/types";
import { ApiService } from "../api/api.service";
import { tokenNotExpired } from 'angular2-jwt';

@Component({
  selector: "convo-list",
  template: `
<div class="grid grid-pad">
    <div *ngFor="#convo of user?.convos">
        <div>
            <h4>
              <button class="button-small pure-button" (click)="viewConvo(convo._id)">View {{convo.note}} conversation</button>
              <button class="button-small pure-button" (click)="editConvo(convo._id)">Setup</button>
              <button class="button-small pure-button" (click)="removeConvo(convo._id)">Remove</button>
            </h4>
        </div>
    </div>
    <br>
    <button class="button-large button-success pure-button" (click)="addConvo(newNote); showConvoForm=!showConvoForm">Add new</button>
    <br>
    <section id="convo-note-input" *ngIf="showConvoForm">
      <input type="text" size=15 placeholder="Enter conversation note (required):" #note (keyup)="newNote=note.value" (blur)="note.value=''"/>
    </section>
</div>`
})

@CanActivate(() => tokenNotExpired())

export class ConvosComponent implements OnInit {
  showConvoForm: boolean = false;
  newNote: string = '';
  user: User;
  errorMessage;

  constructor(
      private _router: Router,
      private _convoService: ApiService
  ) {}

  ngOnInit() {
    this._convoService.getUserConvos().subscribe(
      user => {
        this.user = user;
      },
      error =>  this.errorMessage = <any>error
    );
  }

  editConvo(id: string) {
    this._router.navigate(['Records', { id: id }]);
  }

  viewConvo(id: string) {
    this._router.navigate(['Views', { id: id }]);
  }

  addConvo(note: string) {
    if (note) {
      this._convoService.addConvo(JSON.stringify({user: this.user._id, note: note})).subscribe(
      convo => {
        this.user.convos.push(convo);
      },
      error =>  this.errorMessage = <any>error
      );
    }
  }

  removeConvo(id: string) {
    this._convoService.removeConvo(id).subscribe(
      status => {
        this.user.convos.forEach((item, index) => {if (item._id === id) this.user.convos.splice(index, 1); });
      },
      error =>  this.errorMessage = <any>error
    );
  }
}