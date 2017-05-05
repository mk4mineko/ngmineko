import { Component, OnInit } from '@angular/core';
import { Title }     from '@angular/platform-browser';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import { Http, Headers, RequestOptions, Request, RequestMethod, Response } from '@angular/http';
import { MdSnackBar } from '@angular/material';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';

import { UploadService } from './upload.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  providers: [ UploadService ]
})
export class UploadComponent implements OnInit {

  form: FormGroup;
  imlogin: boolean;
  goTab:number;
  submitted:boolean;
  error_email:boolean;
  error_password:boolean;
  userlog:string = "EMPIRICA-INSTITUT";
  foldname;
  dragging:boolean;
  inFile:boolean = false;
  nfiles:number=0;
  totafile:number=0;
  idfile:number=-1;
  files = [];
  finish:boolean;

  foldername:string;
  folderCtrl: FormControl;
  filteredFolders: any;
  folders = [];
  nofolder:boolean;

  user: Observable<firebase.User>;
  
  constructor(
    public fb: FormBuilder,
    // public af: AngularFire,
    // public afAuth: AngularFireAuth,
    // public firebase: firebase,
    public afAuth: AngularFireAuth,
    private http: Http,
    private uploadService: UploadService,
    public snackBar: MdSnackBar,
    private titleService: Title,
    private router: Router,
    private route:ActivatedRoute
  ) {

    this.titleService.setTitle( 'MINEKO | EMPIRICA' );

    afAuth.authState.subscribe(log => {
      if(log) {
        this.imlogin=true;
        this.goTab=1;
        if(this.foldername){
          this.goTab=2;
        }
        this.userlog=log.email;
      } else {
        this.imlogin=false;
        this.goTab=0;
      }
    });

    router.events.subscribe((val) => {
      this.foldername=this.route.snapshot.params['folder'];
      if(this.foldername){
        this.onFold();
      }
    });
    
    this.form = fb.group({
      email: ['', [
        Validators.required
      ]],
      password: ['', [
        Validators.required
      ]],
    });

    this.folderCtrl = new FormControl();
    this.uploadService.getFold().then(risp => {
      this.folders=risp;
      this.filteredFolders = this.folderCtrl.valueChanges
        .startWith(null)
        .map(name => this.filterFolder(name));
    });
    
  }
  

  filterFolder(val: string) {
    return val ? this.folders.filter(s => new RegExp(`^${val}`, 'gi').test(s))
               : this.folders;
  }

  ngOnInit() {
  }

  onLogin(){
    this.submitted=true;
    this.error_email=false;
    this.error_password=false;
    let email = this.form.controls['email'].value;
    let password = this.form.controls['password'].value;
    if(this.form.valid){
      this.afAuth.auth.signInWithEmailAndPassword(email, password).catch(error => {
        if(error.message=="There is no user record corresponding to this identifier. The user may have been deleted."){
          this.error_email=true;
        }
        if(error.message=="The password is invalid or the user does not have a password."){
          this.error_password=true;
        }
      })
    }
  }

  logOut(){
    this.afAuth.auth.signOut();
    this.router.navigate(['/empirica/']);
  }
  
  goFold(){
    if(this.folderCtrl.value==null || this.folderCtrl.value==''){
      this.nofolder=true;
    }else{
      this.nofolder=false;
      this.foldername=this.folderCtrl.value;
      this.uploadService.newFold(this.foldername).then(risp => {
        this.router.navigate(['/empirica/'+this.foldername]);
      });
    }
  }

  onFold(){
    this.goTab=2;
    // console.log(this.foldername)
    this.uploadService.getFile(this.foldername).then(risp => {
    //   console.log(risp)
      if(risp=='error'){
        // this.router.navigate(['/empirica/']);
        window.location.href = '/empirica/';
      }else{
        this.inFile=true;
        for (let file of risp) {
          this.idfile+=1;
          this.totafile+=1;
          let filearra = file.split('/');
          let filename = filearra[filearra.length-1];
          this.files.push({ 
            id: this.idfile,
            name: filename,
            time: this.foldername,
          });
        }
      }
    });
  }

  handleDragEnter() {this.dragging = true;}
  handleDragLeave() {this.dragging = false;}
  handleDrop(e) {e.preventDefault();this.dragging = false;this.handleInputChange(e);}
  handleInputChange(event) {
    var newfiles = event.dataTransfer ? event.dataTransfer.files : event.target.files;
    if(newfiles.length > 0) { 
      this.inFile=true;
      for (let file of newfiles) { 
        this.idfile+=1;
        this.nfiles+=1;
        this.totafile+=1;
        this.snackBar.open('Datei hochladen :', (this.nfiles)+'/'+newfiles.length, {});
        this.files.push({ 
          hide: false,
          id: this.idfile,
          name: file.name,
          load: true
        });
        this.uploadService.upload(this.idfile,file,this.foldername)
          .then(risp => {
            if(risp=='error'){
              this.snackBar.open('ERROR');
            }else{
              this.files[risp.id].load=false;
              this.files[risp.id].name=risp.name;
              if(risp.id==this.files.length-1){
                this.finish=true;
              }
              this.nfiles-=1;
              if(this.nfiles==0){
                this.snackBar.open('Alle Dateien werden hochgeladen', 'OK', { duration: 2000 });
              }else{
                this.snackBar.open('Datei hochladen :', (newfiles.length-this.nfiles)+'/'+newfiles.length, {});
              }
            }
          });
      }
    }
  }

  fileDelete(file){
    this.files[file.id].load=true;
    this.uploadService.delete(file,this.foldername).then(risp => {
      this.snackBar.open('Datei gelöscht', 'OK', { duration: 2000 });
      this.files[risp.id].hide=true;
      this.totafile-=1;
    });
  }

  myFILE(file){
    window.open(environment.baseurl+'upload/empirica/'+file.time+'/'+file.name,'_blank');
  }

  delFold(){
    this.uploadService.delFold(this.foldername).then(risp => {
      this.router.navigate(['/empirica/']);
      // location.reload();
      // this.snackBar.open('Datei gelöscht', 'OK', { duration: 2000 });
      // this.files[risp.id].hide=true;
      // this.totafile-=1;
    });
  }

}
