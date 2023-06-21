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

export type Direction = 'ArrowLeft' | 'ArrowRight';

export interface Model {
  words: string[];
  size: number;
  tasks: Task;
  isComplete: boolean;
  currentTaskIndex: number;

  createTasks(savedTask: Task | undefined): Task;
  checkAnswer(char: string, index: number): Task;
  getTasks(): Task;
  prepareTaskForSave(): Task;
  getTasksSize(): number;
  getCurrentTask(): number;
  changeCurrentTask(direct: Direction): number;
  getLetterIndex(letter: string): number;
  taskStatus(isComplete?: boolean): boolean;
  nextTask(): void;
}
