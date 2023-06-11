export type AnswersType = {
  isFinished: boolean;
  answer: string;
  stepCounter: number;
  idError: { id: number; isWrong: boolean };
  errorCounter: number;
};

export interface Task {
  // index?: number;
  // total?: number;
  // word?: string;
  // mixedChars?: string[];
  // selectedChars?: string[];
  // errors?: number;
  wordsTasks: Array<string>;
  mixedTasks: Array<string>;
  answers: Array<AnswersType> | [];
  currentTask: number;
}

export interface Model {}
