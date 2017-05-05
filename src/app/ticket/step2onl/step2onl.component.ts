import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { Router, ActivatedRoute } from '@angular/router';
// import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import * as firebase from 'firebase';

import { TicketService } from '../ticket.service';

@Component({
  selector: 'app-step2onl',
  templateUrl: './step2onl.component.html',
  styleUrls: ['./step2onl.component.scss'],
  inputs: ['activeColor', 'baseColor', 'overlayColor'],
  providers: [ TicketService ]
})
export class Step2onlComponent {

  submitted = false;
  activeColor: string = 'green';
  baseColor: string = '#ccc';
  overlayColor: string = 'rgba(255,255,255,0.5)';
  dragging: boolean = false;
  files: any = [];
  filetotal: number = 0;
  filetoload: number = 0;
  loading: boolean = false;
  step2Get: FirebaseListObservable<any>;
  myTick = '';
  myTipo = '';
  myMode = '';
  finish:boolean;
  idfile:number=-1;

  constructor(
    public af: AngularFireDatabase,
    private router: Router,
    private route:ActivatedRoute,
    private ticketService: TicketService,
  ) {

    this.myTick = this.route.snapshot.params['tick'];
    this.myTipo = this.route.snapshot.params['tipo'];

    this.ticketService.getFile(this.myTick).then(risp => {
      if(risp=='error'){

      }else{
        for (let file of risp) {
          this.idfile+=1;
          this.filetotal += 1;
          let filearra = file.split('/');
          let filename = filearra[filearra.length-1];
          this.files.push({ 
            id: this.idfile,
            name: filename,
          });
        }
      }
    });





  }


  handleDragEnter() {this.dragging = true;}
  handleDragLeave() {this.dragging = false;}
  handleDrop(e) {
    e.preventDefault();
    this.dragging = false;
    this.handleInputChange(e);
  }
  handleInputChange(event) {
    var filez = event.dataTransfer ? event.dataTransfer.files : event.target.files;
    // var totfile = this.filetotal+filez.length-1;
    this.loading=true;
    this.filetoload = filez.length;
    for (let selectedFile of filez) {
        this.filetotal+=1;
        this.idfile+=1;
        this.files.push({ 
          id: this.idfile,
          load: true,
          name: selectedFile.name,
        });

        this.ticketService.upload( this.myTick, this.idfile, selectedFile ) 
          .then(risp => {      
            this.filetoload-=1;
            this.files[risp.id].load=false;
            this.files[risp.id].name=risp.name;
            if(this.filetoload==0){this.loading=false;}
            // console.log(totfile)
            // console.log(this.filetotal)
          });



        // this.step2Get.push(entry).then((item1) => {
        //   var filekey = item1.key;
        //   var storageRef = firebase.storage().ref('/mineko/'+this.myTick+'/'+filekey);
        //   storageRef.put(selectedFile).then((item2) => {
        //     this.step2Get.update(filekey, { 
        //       id: filekey,
        //       url: 'https://firebasestorage.googleapis.com/v0/b/homepage-6cf8e.appspot.com/o/mineko%2F'+this.myTick+'%2F'+filekey+'?alt=media&token=cc1e7a6d-2329-4351-897f-922485c719df'
        //     }).then((item) => {
        //       this.filetoload-=1;
        //       if(totfile==this.filen){this.loading=false;}
        //     });
        //   });
        // });
    }
  }

  goDoc(file){
    window.open('http://upload.mineko.de/upload/ticket/doc/'+this.myTick+'/'+file, '_blank');
  }

  // fileDelete(file) {
  //   this.filetoload = 1;
  //   this.loading=true;
  //   var storageRef = firebase.storage().ref('/mineko/'+this.myTick+'/'+file.id);
  //   storageRef.delete().then((item2) => {
  //     this.step2Get.remove(file);
  //     this.loading=false;
  //   });
  // }
  fileDelete(file){
    this.files[file.id].load=true;
    this.ticketService.delete(file,this.myTick).then(risp => {
      // this.snackBar.open('Datei gelöscht', 'OK', { duration: 2000 });
      this.files[risp.id].hide=true;
      this.filetotal-=1;
    });
  }


  
  prevSTEP() {
    this.router.navigate(['/ticket/'+this.myTick+'/'+this.myTipo+'/online/step1']);
  }

	onSubmit() {
    this.submitted=true;
    if(this.filetotal>0){
      this.router.navigate(['/ticket/'+this.myTick+'/'+this.myTipo+'/online/step3']);
    }
  }

}
