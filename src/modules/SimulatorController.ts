import { SimulatorModel } from './SimulatorModel';
import { SimulatorDOMView } from './SimulatorDOMView';
import { Storage } from './Storage';
import { Task } from '@/types/model';
import { Statistics } from '@/modules/Statistics';
import { Controller } from '@/types/controller';

export class SimulatorController implements Controller {
  view: SimulatorDOMView;
  model: SimulatorModel;
  private storage: Storage;
  private savedTask: Task | undefined;
  private statistics: Statistics;

  constructor(words: string[], size: number) {
    this.storage = new Storage();
    this.savedTask = this.storage.getFromLocalStorage('tasks');
    this.view = new SimulatorDOMView();
    this.model = new SimulatorModel(words, size);
    this.statistics = new Statistics();
  }

  start(): void {
    this.view.registerSymbolClickHandler(this.handleClickEvent.bind(this));
    this.view.registerKeyboardClickHandler(this.handleClickEvent.bind(this));

    if (this.isFinishedTasks(this.savedTask)) {
      this.view.beforeStart()
        ? this.view.render(this.model.createTasks(this.savedTask))
        : this.view.render(this.model.createTasks(undefined));
    } else {
      this.view.render(this.model.createTasks(undefined));
    }
  }

  handleClickEvent(event: string | KeyboardEvent, index?: number): void {
    if (typeof event === 'string') {
      this.model.checkAnswer(event, index!);
      this.checkingNextTask(this.model.getTasks());
    } else {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        this.model.changeCurrentTask(event.key);
        if (this.isFinishedTasks()) {
          this.renderTasks();
        }
      }

      if (
        event.key >= 'a' &&
        event.key <= 'z' &&
        this.isFinishedTasks() &&
        !this.isFinishedCurrentTask()
      ) {
        const letterIndex = this.model.getLetterIndex(event.key);
        this.model.checkAnswer(event.key, letterIndex);
        this.checkingNextTask(this.model.getTasks());
      }
    }

    if (!this.isFinishedTasks()) {
      this.renderStatistics(this.model.getTasks());
    }
  }

  private checkingNextTask(tasks: Task) {
    if (this.model.taskStatus()) {
      this.renderTasks();
      setTimeout(() => {
        this.model.nextTask();
        this.saveCurrentTasks(this.model.prepareTaskForSave());
        if (this.isFinishedTasks()) {
          this.renderTasks();
        } else {
          this.renderStatistics(tasks);
        }
      }, 1000);
    } else {
      this.renderTasks();
      this.saveCurrentTasks(this.model.prepareTaskForSave());
    }
  }

  private renderTasks() {
    this.view.render(this.model.getTasks());
  }

  private isFinishedCurrentTask() {
    return this.model.getTasks().answers[this.model.getCurrentTask() - 1]
      .isFinished;
  }

  private isFinishedTasks(savedTask?: Task | undefined) {
    if (typeof savedTask !== 'undefined') {
      return savedTask.currentTask <= this.model.getTasksSize();
    }

    return this.model.getCurrentTask() <= this.model.getTasksSize();
  }

  private saveCurrentTasks(tasksToSave: Task) {
    // const tasksToSave = this.model.checkAnswer(key, index);
    this.storage.saveToLocalStorage('tasks', tasksToSave);
  }

  private renderStatistics(tasks: Task) {
    this.view.renderStatistics(
      this.statistics.getWordsWithoutErrors(tasks),
      this.statistics.getCountErrors(tasks),
      this.statistics.getWordsMostErrors(tasks)
    );
  }
}
