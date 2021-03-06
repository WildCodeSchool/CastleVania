import { Injectable } from '@angular/core';
import { MapService } from './map.service';
import { StateMachineService, MOVE_LEFT, MOVE_RIGHT, MOVE_JUMP, ATTACK } from './state-machine.service';
import { Router } from '@angular/router';
import { Wolf, Ghost, Beast } from '../monster/monster';

@Injectable({
  providedIn: 'root'
})

export class GameloopService {

  public move: number;
  public canJump: Boolean = true;
  public mainTheme: any;
  public soundSwordMonster: any;
  public soundJump: any;
  public gameOver: any;

  constructor(private _stateMachina: StateMachineService, private _mapService: MapService, private router: Router) { }

  playGameMainTheme() {
    this.mainTheme = new Audio();
    this.mainTheme.src = '/assets/sound/uefa-champions-league.mp3';
    this.mainTheme.load();
    this.mainTheme.volume = 0.7;
    this.mainTheme.play();
  }

  logic() {

    this.moveMonster();

    if (this._stateMachina.moveState === MOVE_LEFT) {
      if (this._mapService.map[Math.trunc(this._stateMachina.charY)][Math.round(this._stateMachina.charX - 1)] === 0) {
        this._stateMachina.charX -= 0.1;
        this.scrollBlock();
      }
    }
    else if (this._stateMachina.moveState === MOVE_RIGHT) {
      if (this._mapService.map[Math.trunc(this._stateMachina.charY)][Math.round(this._stateMachina.charX + 1)] === 0) {
        this._stateMachina.charX += 0.1;
        this.scrollBlock();

        if (this._stateMachina.charX > 138) {
          this.router.navigate(['/youWin']);
        }
      }
    }
    else if (this._stateMachina.moveState === MOVE_JUMP && this.canJump) {
      this._stateMachina.powerJump = 30;
      this.canJump = false;
      this.soundJump = new Audio();
      this.soundJump.src = 'assets/sound/hero-jump.mp3';
      this.soundJump.load();
      this.soundJump.play();
      this.scrollBlock();
    }

    if (this._stateMachina.powerJump <= 0 && (this._mapService.map[Math.trunc(this._stateMachina.charY + 1)][Math.round(this._stateMachina.charX)] === 0)) {
      this._stateMachina.charY += 0.09;
      this.scrollBlock();
    }

    if (this._stateMachina.powerJump <= 0 && (this._mapService.map[Math.trunc(this._stateMachina.charY + 1)][Math.round(this._stateMachina.charX)] != 0)) {
      this.canJump = true;
      this._stateMachina.powerJump = 0;
    }
    if (this._stateMachina.powerJump <= 0 && (this._mapService.map[Math.trunc(this._stateMachina.charY + 1)][Math.round(this._stateMachina.charX)] === 2)) {
      this.canJump = true;
      this._stateMachina.powerJump = 0;
      this._stateMachina.charY += 0.9;
    }

    if (this._stateMachina.powerJump > 0) {
      this._stateMachina.charY -= 0.12;
      this._stateMachina.powerJump -= 1.2;
      this.scrollBlock();
    }

    

    this._stateMachina.gameDuration = new Date().getTime() - this._stateMachina.startTime.getTime()


    requestAnimationFrame(() => this.logic()); //setinterval => request...
  }

  play() {
    this._stateMachina.startTime = new Date()
    // this.playGameMainTheme()
    this.logic();
    this.resetGame();
    // this.reInit();
  }

  moveMonster() {
    for (let index in this._mapService.monsters) {
      const monster = this._mapService.monsters[index];

      if (monster.direction === MOVE_RIGHT) {
        monster.monsterX += 0.05;
        if (monster.initialX + monster.amplitude < monster.monsterX) {
          monster.direction = MOVE_LEFT;
        }
      }
      else if (monster.direction == MOVE_LEFT) {
        monster.monsterX -= 0.05;
        if (monster.initialX - monster.amplitude > monster.monsterX) {
          monster.direction = MOVE_RIGHT;
        }
      }
      if ((Math.abs(this._stateMachina.charX - monster.monsterX) < 0.1) && (Math.abs(this._stateMachina.charY - monster.monsterY) < 0.1)) {
        this.router.navigate(['gameOver']);

      }
      if ((this._stateMachina.moveState === ATTACK) && (Math.abs(this._stateMachina.charX - monster.monsterX) < 0.6) && Math.abs(this._stateMachina.charY - monster.monsterY) < 0.6) {
        this._mapService.monsters.splice(parseInt(index), 1)
        this.soundSwordMonster = new Audio();
        this.soundSwordMonster.src = 'assets/sound/sword-monster.mp3';
        this.soundSwordMonster.load();
        this.soundSwordMonster.play();
      }
    }
  }

  scrollBlock() {
    window.scroll((this._stateMachina.charX * 50) - (window.innerWidth / 2) - 66, this._stateMachina.charY * 50);
  }

   resetGame() {
    this._stateMachina.moveState = 0;
    this._stateMachina.lastState = 0;
    this._stateMachina.beforeLasteState = 2;
    this._stateMachina.charX = 1;
    this._stateMachina.charY = 8;
    this._stateMachina.powerJump = 0;
    
    this._stateMachina.lifePlayer = 4;
    this._stateMachina.move = 0;
    this._stateMachina.monsters = [
      new Wolf(6, 8, 1, 1), new Wolf(8, 5, 1, 1), new Wolf(15, 8, 1, 1), new Wolf(25, 8, 1, 1), new Wolf(27, 8, 1, 1),
      new Wolf(29, 8, 1, 1), new Wolf(31, 8, 1, 1), new Wolf(97, 8, 1, 1), new Wolf(115, 8, 1, 1), new Wolf(100, 8, 1, 1), new Wolf(105, 8, 1, 1), new Wolf(25, 8, 1, 1),
      new Ghost(93, 3.5, 0, 0), new Ghost(75, 7.7, 0, 0), new Ghost(82, 7.7, 0, 0),
      new Beast(130, 7.3, 0, 0), new Beast(125, 7.3, 0, 0)
    ];
      this._mapService.monsters = [
        new Wolf(6, 8, 1, 1), new Wolf(8, 5, 1, 1), new Wolf(15, 8, 1, 1), new Wolf(25, 8, 1, 1), new Wolf(27, 8, 1, 1),
        new Wolf(29, 8, 1, 1), new Wolf(31, 8, 1, 1), new Wolf(97, 8, 1, 1), new Wolf(115, 8, 1, 1), new Wolf(100, 8, 1, 1), new Wolf(105, 8, 1, 1), new Wolf(25, 8, 1, 1),
        new Ghost(93, 3.5, 0, 0), new Ghost(75, 7.7, 0, 0), new Ghost(82, 7.7, 0, 0),
        new Beast(130, 7.3, 0, 0), new Beast(125, 7.3, 0, 0)
      ];
    this._stateMachina.startTime;
    this._stateMachina.gameDuration = 0;
    this._stateMachina.endTime;
    this._stateMachina.setMoveState(this._stateMachina.moveState);
  } 

  // reInit() {

  //   this._stateMachina.moveState = 0;
  //   this._stateMachina.lastState =  0;
  //   this._stateMachina.beforeLasteState =  2;
  //   this._stateMachina.charX =  1;
  //   this._stateMachina.charY =  8.15;
  //   this._stateMachina.powerJump =  0;
  //   this._stateMachina.lifePlayer =  4;
  //  this._stateMachina.move = 0;
  //  this._stateMachina.monsters = [new Wolf(4, 8, 3, 1), new Wolf(8,5,2,2), new Ghost(15,3,0,0),  new Beast(4,5,0,0)]
  // }
}

