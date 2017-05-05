import { Component, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})

export class TicketComponent {

  public myTick;
  public myMode;
  public myStep;
  public onStep=0;
  public onMode;
  public myTipo;

  private gridcol:number=2;

  constructor(
    private router: Router,
    private route:ActivatedRoute
  ){

    router.events.subscribe((val) => {

      this.myTipo = this.route.snapshot.params['tipo'];
      this.myTick = this.route.snapshot.params['tick'];
      this.myMode = this.route.snapshot.params['mode'];
      this.myStep = this.route.snapshot.params['step'];

      if(this.myTick=='new' && this.myTipo==undefined){this.myTick=undefined;}

      if(this.myMode=='online'){this.onMode=0}
      if(this.myMode=='post'){this.onMode=1}
      if(this.myMode=='fax'){this.onMode=2}
      
      if(this.myTick==undefined){this.onStep=-1}
      if(this.myStep=='step1'){this.onStep=0}
      if(this.myStep=='step2'){this.onStep=1;}
      if(this.myStep=='step3'){this.onStep=2}


    });


    

  }  

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if(event.target.innerWidth<600){
      this.gridcol=1;
    }else{
      this.gridcol=2;
    }
  }

  onMODE(mode) {
    if(mode==0){this.myMode='online'}
    if(mode==1){this.myMode='post'}
    if(mode==2){this.myMode='fax'}
    if(this.myTick==undefined){this.myTick='new';}
    this.onStep=0;
    this.router.navigate(['/ticket/'+this.myTick+'/'+this.myTipo+'/'+this.myMode+'/step1']);
  }

  prevSTEP(step) {
    this.onStep -=1;
    this.router.navigate(['/ticket/'+this.myTick+'/'+this.myTipo+'/'+this.myMode+'/step'+(this.onStep+1)]);
  }

  onTipo(tipo){
    this.myTipo=tipo;
    this.router.navigate(['/ticket/new/'+this.myTipo]);
  }

  goNew(){
    this.router.navigate(['/ticket/new']);
  }

}
