import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { emailValidator, matchingPasswords } from '../ticket.validator';
import { TicketService } from '../ticket.service';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss'],
  providers: [ TicketService ]
})
export class Step1Component implements OnInit {
  
  step1Push: FirebaseListObservable<any>;
  step1Upd: FirebaseListObservable<any>;
  step1Upd2: FirebaseListObservable<any>;
  step1Tipo: FirebaseObjectObservable<any>;

  myTipo = '';
  myTick = '';
  myMode = '';
  myStep = '';

  onMode = 0;
  onStep = 0;

  samemails:boolean = true;
  submitted:boolean = false;
  form: FormGroup;

  ngOnInit() {


  }

  constructor(
    private db: AngularFireDatabase,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private ticketService: TicketService,
  ){
    this.step1Push = db.list('/ticket');
    this.myTipo = this.route.snapshot.params['tipo'];
    this.myTick = this.route.snapshot.params['tick'];
    this.step1Upd = db.list('/ticket/'+this.myTick+'/step1');
    this.step1Tipo = db.object('/ticket/'+this.myTick+'/step1/tipo', { preserveSnapshot: true });

    this.step1Upd2 = db.list('/ticket/'+this.myTick);

    if(this.myTick==undefined){this.myTick='new';}

    this.myMode = this.route.snapshot.params['mode'];
    this.myStep = this.route.snapshot.params['step'];

    if(this.myMode=='online'){this.onMode=0}
    if(this.myMode=='post'){this.onMode=1}
    if(this.myMode=='fax'){this.onMode=2}

    if(this.myStep=='step1'){this.onStep=0}
    if(this.myStep=='step2'){this.onStep=1}
    if(this.myStep=='step3'){this.onStep=2}
    if(this.myStep=='step4'){this.onStep=3}

    if(this.myTipo=='business'){
      this.form = fb.group({
        tipo: ['', []],
        firma: ['', [ Validators.required ]],
        name: ['', [ Validators.required ]],
        surname: ['', [ Validators.required ]],
        email: ['', [ Validators.required,  emailValidator ]],
        remail: ['', [ Validators.required, emailValidator ]],
        comment: [''],
        agree: ['', Validators.required],
      }, {validator: matchingPasswords('email', 'remail')});
      console.log('change form')
    }else{
      this.form = fb.group({
        tipo: ['', []],
        firma: ['', [  ]],
        name: ['', [ Validators.required ]],
        surname: ['', [ Validators.required ]],
        email: ['', [ Validators.required,  emailValidator ]],
        remail: ['', [ Validators.required, emailValidator ]],
        comment: [''],
        agree: ['', Validators.required],
      }, {validator: matchingPasswords('email', 'remail')});
    }

    if(this.myTick!=undefined && this.myTick!='new'){
      this.step1Upd.subscribe(items => { 
          items.forEach(item => {
            if(this.form.controls[item.$key]){
              this.form.controls[item.$key].setValue(item.$value);
            }
          })
      })
    }else{
      // this.form.reset();
    }
  
    this.step1Tipo.subscribe(snapshot => {
      if(snapshot.val()!=null){
        if(this.myTipo==undefined || snapshot.val()!=this.myTipo){
          this.myTipo = snapshot.val();
          this.router.navigate(['/ticket/'+this.myTick+'/'+this.myTipo]);
        }
      }
    });




  }  

  onSubmit() {
    this.submitted = true;
    console.log(this.form.valid)
    if(this.form.valid){
      if(this.myMode==undefined){
        this.myMode='online'
      }else{
        this.myMode = this.route.snapshot.params['mode'];
      }
      if(this.myTick==undefined || this.myTick=='new'){
        this.form.controls['tipo'].setValue(this.myTipo);
        this.step1Push.push({ step1: this.form.value }).then((item) => {
          this.myTick=item.key;
          this.ticketService.newFold(this.myTick).then(risp => {
            this.router.navigate(['/ticket/'+this.myTick+'/'+this.myTipo+'/'+this.myMode+'/step2']);
          });
        });
      }else{
        this.step1Upd2.update('step1', this.form.value).then((item) => {
          this.router.navigate(['/ticket/'+this.myTick+'/'+this.myTipo+'/'+this.myMode+'/step2']);
        });
      }
    }
  }

}
