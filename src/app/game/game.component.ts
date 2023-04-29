import { Component } from '@angular/core';
import { GameSettings } from '../shared/game-settings';
import { Digit } from '../shared/models';
import { UserEngine } from '../shared/user-engine';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {

  gameSettings: GameSettings = {
    digitCount: 4
  }

  player1 = new UserEngine(this.gameSettings, 'PLAYER 1');
  player2 = new UserEngine(this.gameSettings, 'PLAYER 2');

  constructor() {
    this.createNewGame();
  }

  createNewGame() {
    this.player1.init();
    this.player2.init();
  }

  
}
