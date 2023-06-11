import { SimulatorModel } from './SimulatorModel';
import { SimulatorDOMView } from './SimulatorDOMView';
import { Storage } from './Storage';
import { Task } from '@/types/model';
export class SimulatorController {
  private view: SimulatorDOMView;
  private model: SimulatorModel;
  private storage: Storage;
  private savedTask: Task | undefined;

  constructor(words: string[], size: number) {
    this.storage = new Storage();
    this.savedTask = this.storage.getFromLocalStorage('task');
    this.view = new SimulatorDOMView();
    this.model = new SimulatorModel(words, size);
  }

  start(): void {
    this.view.registerSymbolClickHandler(this.handleSymbolClick.bind(this));
    this.view.registerKeyboardClickHandler(this.handleKeyboardClick.bind(this));
    this.view.beforeStart()
      ? this.view.render(this.model.createTasks(this.savedTask))
      : this.view.render(this.model.createTasks(undefined));
  }

  handleSymbolClick(char: string, index: number): void {
    const currentTask = this.model.checkAnswer(char, index);
    this.storage.saveToLocalStorage('task', currentTask);

    this.view.render(this.model.getTasks());
  }

  handleKeyboardClick({ key }: KeyboardEvent): void {
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      this.model.changeCurrentTask(key);
    }

    if (key >= 'a' && key <= 'z') {
      const currentTask = this.model.checkAnswer(key, -1);
      this.storage.saveToLocalStorage('task', currentTask);
    }
    this.view.render(this.model.getTasks());
  }
}
