import { Component } from '@angular/core';
import { GameSettings } from './shared/game-settings';
import { Digit } from './shared/models';
import { UserEngine } from './shared/user-engine';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {

  gameSettings: GameSettings = {
    digitCount: 4
  }

  localUser = new UserEngine(this.gameSettings);

  constructor() {
    this.createNewGame();
  }

  createNewGame() {
    this.localUser.init();
  }

  onDigitKeyUp(event: KeyboardEvent, index: number, digits: Digit[]) {
    const valueText = event.key;
    const srcElement: any = event.srcElement;

    if (index == 0 && valueText == '0') {
      if (srcElement) {
        srcElement.value = null;
        return;
      }
    }

    const value = parseInt(valueText);

    if (isNaN(value) || value>9) {
      srcElement.value = null;
      return;
    }

    this.gotoNextElement(srcElement);
  }

  gotoNextElement(srcElement: Element) {
    const nextElement: any = srcElement?.parentElement?.nextElementSibling?.firstChild;
    nextElement?.focus();
  }
  
}
