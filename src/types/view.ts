import { Task } from '@/types/model';

export interface View {
  answerElement: HTMLElement | null;
  lettersElement: HTMLElement | null;
  currentQuestionElement: HTMLElement | null;
  totalQuestionsElement: HTMLElement | null;
  statisticsElement: HTMLElement | null;

  beforeStart(): boolean;
  registerSymbolClickHandler(
    handler: (char: string, index: number) => void
  ): void;
  registerKeyboardClickHandler(handler: (key: KeyboardEvent) => void): void;
  handleClickEvent(event: string | KeyboardEvent, index?: number): void;
  render(task: Task): void;
  renderStatistics(
    statParam1: number,
    statParam2: number,
    statParam3: string
  ): void;
}
