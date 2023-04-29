
export type DigitGuessModeType = 'rightPlace' | 'wrongPlace' | 'canBe' | 'cannot';

export interface Digit {
  v?: number;
  guessMode?: DigitGuessModeType;
}

export interface GuessRow {
  digits: Digit[];
  submitted: boolean;
  rightPlace?: number;
  wrongPlace?: number;
}

export interface PickResult {
  pickedValue: number;
  newItems: number[];
}

export interface ErrorInfo {
  i: number;
  message: string;
}