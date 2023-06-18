import { AnswersType, Task } from '@/types/model';

export class SimulatorModel {
  private words: string[];
  private size: number;

  private tasks: Task;
  private isComplete: boolean;
  private currentTaskIndex: number;

  constructor(words: string[], size: number) {
    this.words = words;
    this.size = size;
    this.tasks = {
      wordsTasks: [],
      mixedTasks: [],
      answers: [],
      currentTask: 0,
    };
    this.isComplete = false;
    this.currentTaskIndex = 0;
  }

  createTasks(savedTask: Task | undefined): Task {
    if (savedTask) {
      this.tasks = savedTask;
      return this.tasks;
    }
    const wordsTasks = this.getWords(this.words);
    const mixedTasks = this.mixArray(wordsTasks);
    const answers = [];
    for (let i = 0; i < this.size; i += 1) {
      answers.push({
        isFinished: false,
        answer: { text: '', isWrong: false },
        stepCounter: 0,
        idError: { id: -1, isWrong: false },
        errorCounter: 0,
      } as AnswersType);
    }

    this.tasks = {
      wordsTasks,
      mixedTasks,
      answers,
      currentTask: 1,
    };

    return this.tasks;
  }

  getTasks() {
    return this.tasks;
  }

  getCurrentTask() {
    return this.tasks.currentTask;
  }

  getTasksSize() {
    return this.size;
  }

  private getWords(originArray: Array<string>): Array<string> {
    const tasksArray: Array<string> = [];

    while (tasksArray.length < this.size) {
      const index = Math.floor(Math.random() * originArray.length);
      tasksArray.push(...originArray.splice(index, 1));
    }

    return tasksArray;
  }

  private mixArray(tasksArray: string[]) {
    const mixedArray: Array<string> = [];

    tasksArray.forEach((item) => {
      const itemArray = item.split('');
      const mixedWordArray = [];

      while (itemArray.length) {
        const index = Math.floor(Math.random() * itemArray.length);
        mixedWordArray.push(...itemArray.splice(index, 1));
      }

      mixedArray.push(mixedWordArray.join(''));
    });

    return mixedArray;
  }

  changeCurrentTask(direct: string): number {
    if (direct === 'ArrowLeft') {
      if (this.tasks.currentTask > 1) {
        this.tasks.currentTask -= 1;
      }
    }
    if (direct === 'ArrowRight') {
      if (
        this.tasks.currentTask <= this.size &&
        this.tasks.answers[this.tasks.currentTask - 1].isFinished
      ) {
        this.tasks.currentTask += 1;
      }
    }

    return this.tasks.currentTask;
  }

  checkAnswer(char: string, index: number): Task {
    this.taskStatus(false);
    const currentIndex = this.tasks.currentTask - 1;
    const originalWord = this.tasks.wordsTasks[currentIndex];
    this.tasks.answers[currentIndex].idError = {
      id: -1,
      isWrong: false,
    };

    if (originalWord[this.tasks.answers[currentIndex].stepCounter] === char) {
      this.tasks.mixedTasks[currentIndex] = this.getNewMixedTask(
        this.tasks.mixedTasks[currentIndex],
        char
      );

      this.tasks.answers[currentIndex].answer.text += char;
      if (
        this.tasks.answers[currentIndex].answer.text ===
        this.tasks.wordsTasks[currentIndex]
      ) {
        this.tasks.answers[currentIndex].isFinished = true;
        this.taskStatus(true);
      } else {
        this.tasks.answers[currentIndex].stepCounter += 1;
      }
    } else {
      this.tasks.answers[currentIndex].errorCounter += 1;
      this.tasks.answers[currentIndex].idError = {
        id: index,
        isWrong: true,
      };
      if (this.tasks.answers[currentIndex].errorCounter > 2) {
        this.tasks.answers[currentIndex].answer = {
          text: this.tasks.wordsTasks[currentIndex],
          isWrong: true,
        };
        this.tasks.answers[currentIndex].isFinished = true;
        this.tasks.mixedTasks[currentIndex] = '';
        this.taskStatus(true);
      }
    }

    return this.tasks;
  }

  taskStatus(isComplete?: boolean) {
    if (typeof isComplete !== 'undefined') {
      this.isComplete = isComplete;
    }
    return this.isComplete;
  }

  private getNewMixedTask(mixedTask: string, char: string): string {
    const index = mixedTask.indexOf(char);
    if (index !== -1) {
      mixedTask = mixedTask.slice(0, index) + mixedTask.slice(index + 1);
    }

    return mixedTask;
  }

  nextTask(): void {
    this.tasks.currentTask += 1;
  }

  getLetterIndex(letter: string): number {
    return this.tasks.mixedTasks[this.tasks.currentTask - 1]
      .split('')
      .findIndex((el) => el === letter);
  }
}
