export type AnswersType = {
  isFinished: boolean;
  answer: { text: string; isWrong: boolean };
  stepCounter: number;
  idError: { id: number; isWrong: boolean };
  errorCounter: number;
};

export interface Task {
  wordsTasks: Array<string>;
  mixedTasks: Array<string>;
  answers: Array<AnswersType> | [];
  currentTask: number;
}

export interface Model {}
