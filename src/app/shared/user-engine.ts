import { GameSettings } from "./game-settings";
import { Digit, DigitGuessModeType, ErrorInfo, GuessRow, PickResult } from "./models";

export class UserEngine
{
  targetDigits: Digit[] = [];
  foundNumbers: Digit[] = [];
  numbers: Digit[] = [];
  guessRows: GuessRow[] = [];
  errors: ErrorInfo[] = [];

  constructor(
    public gameSettings: GameSettings,
    public playerName: string) {
  }

  pickItem(items: number[]): PickResult {
    const index = Math.round(Math.random() * (items.length-1));
    const result: PickResult = { pickedValue: 0, newItems:[] };
    result.pickedValue = items[index];
    result.newItems = items.filter(i => i != result.pickedValue);
    return result;
  }

  generatRandomDigits(): Digit[] {
    const { digitCount } = this.gameSettings;
    const digits: Digit[] = [];
    let availableValues: number[] = [1,2,3,4,5,6,7,8,9];
    for(let i=0;i<digitCount;i++) {
      if (i==1) {
        availableValues.push(0)
      }
      const pickResult = this.pickItem(availableValues);
      availableValues = pickResult.newItems;
      digits.push({ v: pickResult.pickedValue });
    }

    return digits;
  }

  init() {
    this.targetDigits = this.generatRandomDigits();
    this.guessRows = [];

    // numbers
    this.numbers = [];
    for(let i = 0; i<10; i++) {
      this.numbers.push({ v: i });
    }

    // foundNumbers
    this.foundNumbers = [];
    for(let i = 0; i<10; i++) {
      this.foundNumbers.push({ v: i });
    }

    this.addEmpty();
  }

  addNewGuess(row: GuessRow) {
    // validate
    const errors: ErrorInfo[] = [];
    const usedValues: number[] = [];

    for(let i=0;i<row.digits.length;i++) {
      const digitValueText = <any>row.digits[i].v;
      const digitValue = parseInt(<any>digitValueText);
      if (digitValueText == undefined || digitValueText == '')
      {
        errors.push({ i, message: '[' + (i+1) + '] Value empty!' });
      } else if (isNaN(digitValue)) {
        errors.push({ i, message: '[' + (i+1) + '] Not a number!' });
      }

      if (i==0 && digitValueText?.toString()=='0') {
        errors.push({ i, message: '[' + (i+1) + '] 0 cannot be used in first digit!' });
      }

      if (!isNaN(digitValue) && !(digitValue>=0 && digitValue<=9)) {
        errors.push({ i, message: '[' + (i+1) + '] Digits should be between 0-9!' });
      }

      if (!isNaN(digitValue)) {
        if (usedValues.indexOf(digitValue)>=0) {
          errors.push({ i, message: '[' + (i+1) + '] Using same number multiple times not allowed!' });
        }

        usedValues.push(digitValue);
      }
    }

    this.errors = errors;
    if (errors.length>0) {
      console.log('Cannot be added! Errors:', errors);
      return;
    }

    row.submitted = true;
    row.rightPlace = 0;
    row.wrongPlace = 0;

    const { targetDigits } = this;
    for(let i=0;i<row.digits.length;i++) {
      const digitValue = parseInt(<any>row.digits[i].v);
      const allNumbers = targetDigits.map(d => { return d.v });
      if (targetDigits[i].v == digitValue) {
        row.rightPlace += 1;
      } else if (allNumbers.indexOf(digitValue)>=0) {
        row.wrongPlace += 1;
      }

      const number = this.numbers.find(p => p.v == digitValue);
      if (number && number.guessMode == undefined) {
        this.setDigitMode(number, 'canBe', false);
      }
    }

    if (row.rightPlace==4) {
      for(const digit of row.digits) {
        digit.guessMode='rightPlace';
      }

    } else {
      this.addEmpty();
    }
  }

  addEmpty() {
    this.guessRows.push({
      digits: this.createDigits(undefined),
      submitted: false
    });
  }

  createDigits(defaultDigitValue: number | undefined) {
    const { digitCount } = this.gameSettings;
    const digits: Digit[] = [];

    for(let i=0;i<digitCount;i++) {
      digits.push({ v: defaultDigitValue });
    }
    return digits;
  }

  toggleDigitMode(digit: Digit, applyToAll: boolean) {
    let newGuessMode: DigitGuessModeType | undefined = undefined;

    if (digit.guessMode == undefined) {
      newGuessMode = 'rightPlace';
    } else if (digit.guessMode == 'rightPlace') {
      newGuessMode = 'wrongPlace';
    } else if (digit.guessMode == 'wrongPlace') {
      newGuessMode = 'canBe';
    } else if (digit.guessMode == 'canBe') {
      newGuessMode = 'cannot';
    } else {
      newGuessMode = undefined;
    }

    this.setDigitMode(digit, newGuessMode, applyToAll);
  }

  setDigitMode(digit: Digit, newGuessMode: DigitGuessModeType | undefined, applyToAll: boolean) {
  
    digit.guessMode = newGuessMode;

    // applyToAll
    if (!applyToAll)
      return;

    const number = digit.v;

    // guesses
    for(const guessRow of this.guessRows) {
      for(const digit of guessRow.digits) {
        if (digit.v == number) {
          digit.guessMode = newGuessMode;
        }
      } 
    }
    
    for(const digit of this.numbers) {
      if (digit.v == number) {
        digit.guessMode = newGuessMode;
      }
    }
  }
}