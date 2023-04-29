import { Component, Input } from '@angular/core';
import { Digit } from '../shared/models';
import { UserEngine } from '../shared/user-engine';

@Component({
  selector: 'app-player-game',
  templateUrl: './player-game.component.html',
  styleUrls: ['./player-game.component.scss']
})
export class PlayerGameComponent {
  @Input() player!: UserEngine;

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
