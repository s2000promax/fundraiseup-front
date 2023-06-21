import { Model, Task } from './model';
import { View } from '@/types/view';
import { Storage } from '@/modules/Storage';
import { Statistics } from '@/modules/Statistics';

export interface Controller {
  model: Model;
  view: View;
  storage: Storage;
  savedTask: Task | undefined;
  statistics: Statistics;

  start(): void;
  handleClickEvent(event: string | KeyboardEvent, index?: number): void;
  checkingNextTask(tasks: Task): void;
  renderTasks(): void;
  renderStatistics(tasks: Task): void;
}
