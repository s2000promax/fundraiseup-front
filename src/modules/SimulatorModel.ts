import { AnswersType, Task } from '@/types/model';

export class SimulatorModel {
  private words: string[];
  private size: number;

  private tasks: Task;
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
        answer: '',
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

  changeCurrentTask(direct: string) {
    if (direct === 'ArrowLeft') {
      if (this.tasks.currentTask > 1) {
        this.tasks.currentTask -= 1;
      }
    }
    if (direct === 'ArrowRight') {
      if (
        this.tasks.currentTask < this.size &&
        this.tasks.answers[this.tasks.currentTask - 1].isFinished
      ) {
        this.tasks.currentTask += 1;
      }
    }
  }

  checkAnswer(char: string, index: number): Task {
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

      this.tasks.answers[currentIndex].answer += char;
      if (
        this.tasks.answers[currentIndex].answer ===
        this.tasks.wordsTasks[currentIndex]
      ) {
        this.tasks.answers[currentIndex].isFinished = true;
        this.tasks.currentTask += 1;
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
        this.tasks.currentTask += 1;
      }
    }

    return this.tasks;
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
}
