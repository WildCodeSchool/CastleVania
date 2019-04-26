import { Injectable } from '@angular/core';
import { MapService } from './map.service';
import { StateMachineService, MOVE_LEFT, MOVE_RIGHT, MOVE_JUMP } from './state-machine.service';

//const  LOOP_INTERVAL = 50;

@Injectable({
  providedIn: 'root'
})
export class GameloopService {

  public canJump: Boolean = true;

  constructor(private _stateMachina: StateMachineService, private _mapService: MapService) { }

  logic() {

    if (this._stateMachina.moveState === MOVE_LEFT) {
      if (this._mapService.map[Math.trunc(this._stateMachina.charY)][Math.round(this._stateMachina.charX - 1)] === 0) {
        this._stateMachina.charX -= 0.1;
      }
    }
    else if (this._stateMachina.moveState === MOVE_RIGHT) {
      if (this._mapService.map[Math.trunc(this._stateMachina.charY)][Math.round(this._stateMachina.charX + 1)] === 0) {
        this._stateMachina.charX += 0.1;
        console.log(this._mapService.map[Math.trunc(this._stateMachina.charY)][Math.round(this._stateMachina.charX)])
      }
    }
    else if (this._stateMachina.moveState === MOVE_JUMP && this.canJump) {
        this._stateMachina.powerJump= 30;
        this.canJump = false;
       
    }

    
    if ((this._mapService.map[Math.trunc(this._stateMachina.charY + 1)][Math.round(this._stateMachina.charX)] === 0) &&  this._stateMachina.powerJump  <= 0) {
      this._stateMachina.charY += 0.2;
    }

    if (this._stateMachina.powerJump  <= 0 && (this._mapService.map[Math.trunc(this._stateMachina.charY + 1)][Math.round(this._stateMachina.charX)] != 0)) {
      this.canJump = true;
      this._stateMachina.powerJump= 0;

    }

    if(this._stateMachina.powerJump > 0){
      this._stateMachina.charY -= 0.1;
      this._stateMachina.powerJump -= 1;
    }

    requestAnimationFrame(() => this.logic()); //setinterval => request...
  }

  play() {
    this.logic();
  }
}