import { Task } from '@/types/model';
import { View } from '@/types/view';

export class SimulatorDOMView implements View {
  private answerElement: HTMLElement | null;
  private lettersElement: HTMLElement | null;
  private currentQuestionElement: HTMLElement | null;
  private totalQuestionsElement: HTMLElement | null;
  private statisticsElement: HTMLElement | null;

  constructor() {
    this.answerElement = document.getElementById('answer');
    this.lettersElement = document.getElementById('letters');
    this.currentQuestionElement = document.getElementById('current_question');
    this.totalQuestionsElement = document.getElementById('total_questions');
    this.statisticsElement = document.getElementById('statistics');
  }

  beforeStart() {
    return window.confirm('You have unfinished exercises. Continue?');
  }

  render(task: Task) {
    this.renderCurrentQuestion(task);
    this.renderTotalQuestion(task);
    this.renderLetters(task);
    this.renderAnswer(task);
  }

  private renderCurrentQuestion(task: Task) {
    if (this.currentQuestionElement) {
      this.currentQuestionElement.innerHTML = String(task.currentTask);
    }
  }

  private renderTotalQuestion(task: Task) {
    if (this.totalQuestionsElement) {
      this.totalQuestionsElement.innerHTML = String(task.wordsTasks.length);
    }
  }

  private renderAnswer(task: Task): void {
    if (this.answerElement) {
      this.answerElement.innerHTML = '';
      task.answers[task.currentTask - 1].answer.text
        .split('')
        .forEach((char) => {
          const charElement = document.createElement('button');
          if (task.answers[task.currentTask - 1].answer.isWrong) {
            charElement.classList.add('btn', 'btn-danger', 'm-1');
          } else {
            charElement.classList.add('btn', 'btn-success', 'm-1');
          }
          charElement.textContent = char;

          this.answerElement?.appendChild(charElement);
        });
    }
  }

  private renderLetters(task: Task): void {
    if (this.lettersElement) {
      this.lettersElement.innerHTML = '';
      task.mixedTasks[task.currentTask - 1].split('').forEach((char, index) => {
        const charElement = document.createElement('button');

        if (task.answers[task.currentTask - 1].idError.isWrong) {
          if (task.answers[task.currentTask - 1].idError.id === index) {
            charElement.classList.add('btn', 'btn-danger', 'm-1');

            setTimeout(() => {
              const element = document.querySelector(`#button-${index}`);
              if (element?.classList.contains('btn-danger')) {
                element.classList.remove('btn-danger');
                element.classList.add('btn-primary');
              }
            }, 300);
          } else {
            charElement.classList.add('btn', 'btn-primary', 'm-1');
          }
        } else {
          charElement.classList.add('btn', 'btn-primary', 'm-1');
        }

        charElement.id = `button-${index}`;
        charElement.textContent = char;

        charElement.addEventListener('click', () => {
          this.handleClickEvent(char, index);
        });

        this.lettersElement?.appendChild(charElement);
      });
    }
  }

  registerSymbolClickHandler(
    handler: (char: string, index: number) => void
  ): void {
    this.handleClickEvent = handler;
  }

  registerKeyboardClickHandler(handler: (key: KeyboardEvent) => void): void {
    document.addEventListener('keydown', handler);
    this.handleClickEvent = handler;
  }

  handleClickEvent(event: string | KeyboardEvent, index?: number): void {}

  renderStatistics(
    statParam1: number,
    statParam2: number,
    statParam3: string
  ): void {
    if (this.statisticsElement) {
      this.statisticsElement.innerHTML = '';
      const header = document.createElement('h1');
      header.innerText = 'Statistics';
      header.style.textTransform = 'upperCase';
      const wordsWithoutErrors = document.createElement('div');
      wordsWithoutErrors.innerHTML = `
        <span>Number of collected words without errors: </span>
        <strong>${statParam1}</strong>`;
      const countErrors = document.createElement('div');
      countErrors.innerHTML = `
        <span>Number of errors: </span>
        <strong>${statParam2}</strong>`;
      const wordMostErrors = document.createElement('div');
      wordMostErrors.innerHTML = `
        <span>Words with the most errors: </span>
        <strong>${statParam3}</strong>`;
      this.statisticsElement.append(
        header,
        wordsWithoutErrors,
        countErrors,
        wordMostErrors
      );
    }
  }
}
