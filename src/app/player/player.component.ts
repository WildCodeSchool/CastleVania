import { GameloopService } from './../services/gameloop.service';
import { StateMachineService, MOVE_RIGHT, MOVE_LEFT, MOVE_NULL, MOVE_JUMP, ATTACK } from '../services/state-machine.service';
import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  public soundLand: any;

  constructor(public stateMachina: StateMachineService, public gameloop: GameloopService) { }

  ngOnInit() {
  }

  @HostListener('document:keydown', ['$event']) onKeydown(event: KeyboardEvent) {
    //event.preventDefault(); //bloque le scroll
    switch (event.keyCode) {
      case 39:
        console.log(" >>>  DROITE ");
        this.stateMachina.setMoveState(MOVE_RIGHT);
        break;
      case 37:
        console.log(" <<<  GAUCHE ");
        this.stateMachina.setMoveState(MOVE_LEFT);
        break;
      case 32:
        console.log(" ^ JUMP ^ ");
        this.stateMachina.setMoveState(MOVE_JUMP);
        break;
      case 13:
        console.log(" -> ATTACK <- ");
        this.stateMachina.setMoveState(ATTACK);
        break;
    }
  }

  @HostListener('document:keyup', ['$event']) onKeyup(event: KeyboardEvent) {
    switch (event.keyCode) {
      case 39:
        console.log("STOP");
        this.stateMachina.setMoveState(MOVE_NULL);
        this.stateMachina.lastState = 2;
        break;
      case 37:
        console.log("STOP");
        this.stateMachina.setMoveState(MOVE_NULL);
        this.stateMachina.lastState = 1;
        this.stateMachina.beforeLasteState = this.stateMachina.lastState;
        break;
      case 32:
        console.log("STOP");
        this.stateMachina.beforeLasteState = this.stateMachina.lastState
        this.stateMachina.setMoveState(MOVE_NULL);
        this.stateMachina.lastState = 3;
        break;
      case 13:
        console.log("STOP");
        this.stateMachina.setMoveState(MOVE_NULL);
        this.soundLand = new Audio()
        this.soundLand.src = "assets/sound/sword-void.mp3"
        this.soundLand.load()
        this.soundLand.play()
        this.stateMachina.lastState = 4;
        break;
    }
  }
}