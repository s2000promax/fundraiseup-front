import { SimulatorModel } from './SimulatorModel';
import { SimulatorDOMView } from './SimulatorDOMView';
import { Storage } from './Storage';
import { Task } from '@/types/model';
import { Statistics } from "@/modules/Statistics";
export class SimulatorController {
  private view: SimulatorDOMView;
  private model: SimulatorModel;
  private storage: Storage;
  private savedTask: Task | undefined;
  private statistics: Statistics;

  constructor(words: string[], size: number) {
    this.storage = new Storage();
    this.savedTask = this.storage.getFromLocalStorage('task');
    this.view = new SimulatorDOMView();
    this.model = new SimulatorModel(words, size);
    this.statistics = new Statistics();
  }

  start(): void {
    this.view.registerSymbolClickHandler(this.handleSymbolClick.bind(this));
    this.view.registerKeyboardClickHandler(this.handleKeyboardClick.bind(this));

    if (this.savedTask) {
      this.view.beforeStart()
        ? this.view.render(this.model.createTasks(this.savedTask))
        : this.view.render(this.model.createTasks(undefined));
    } else {
      this.view.render(this.model.createTasks(undefined));
    }
  }

  handleSymbolClick(char: string, index: number): void {
    const tasksToSave = this.model.checkAnswer(char, index);
    this.storage.saveToLocalStorage('task', tasksToSave);
    if (this.model.taskStatus()) {
      this.view.render(this.model.getTasks());
    setTimeout(() => {
      this.model.nextTask();
      this.view.render(this.model.getTasks());
    }, 1000);
    } else {
      this.view.render(this.model.getTasks());
    }
  }

  handleKeyboardClick({ key }: KeyboardEvent): void {
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      const currentTask =  this.model.changeCurrentTask(key);
      // if (currentTask <= this.model.getTasksSize()) {
        this.view.render(this.model.getTasks());
      } else {
        console.log('statistic');
        this.view.renderStatistics(
          this.statistics.getWordsWithoutErrors(this.model.getTasks()),
          this.statistics.getCountErrors(this.model.getTasks()),
          this.statistics.getWordsMostErrors(this.model.getTasks()),
        );
      }

    if (key >= 'a' && key <= 'z' && this.model.getCurrentTask() <= this.model.getTasksSize()) {
      const index = this.model.getLetterIndex(key);
      const tasksToSave = this.model.checkAnswer(key, index);
      this.storage.saveToLocalStorage('task', tasksToSave);

      if (this.model.taskStatus()) {
        this.view.render(this.model.getTasks());
        setTimeout(() => {
          this.model.nextTask();
          this.view.render(this.model.getTasks());
        }, 1000);
      } else {
        this.view.render(this.model.getTasks());
      }
    }
    }
}
