import { Task } from '@/types/model';

export class SimulatorDOMView {
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
    if (task.currentTask <= task.wordsTasks.length) {
      this.renderCurrentQueston(task);
      this.renderTotalQueston(task);
      this.renderLetters(task);
      this.renderAnswer(task);
    }
    // } else {
    //   console.log(task.wordsTasks.length, 'statistics33');
    //   this.renderStatistics(task);
    // }
  }

  renderCurrentQueston(task: Task) {
    if (this.currentQuestionElement) {
      this.currentQuestionElement.innerHTML = String(task.currentTask);
    }
  }

  renderTotalQueston(task: Task) {
    if (this.totalQuestionsElement) {
      this.totalQuestionsElement.innerHTML = String(task.wordsTasks.length);
    }
  }

  renderAnswer(task: Task): void {
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

  renderLetters(task: Task): void {
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
                element.classList.add('btn-light');
              }
            }, 300);
          } else {
            charElement.classList.add('btn', 'btn-light', 'm-1');
          }
        } else {
          charElement.classList.add('btn', 'btn-light', 'm-1');
        }

        charElement.id = `button-${index}`;
        charElement.textContent = char;

        charElement.addEventListener('click', () => {
          this.handleSymbolClick(char, index);
        });

        this.lettersElement?.appendChild(charElement);
      });
    }
  }

  registerSymbolClickHandler(
    handler: (char: string, index: number) => void
  ): void {
    this.handleSymbolClick = handler;
  }

  registerKeyboardClickHandler(handler: (key: KeyboardEvent) => void): void {
    document.addEventListener('keydown', handler);
    this.handleKeyboardClick = handler;
  }

  handleSymbolClick(char: string, index: number): void {}

  handleKeyboardClick(key: KeyboardEvent): void {}

  renderStatistics(stat1: number, stat2: number, stat3: string): void {
    if (this.statisticsElement) {
      this.statisticsElement.innerHTML = '';
      const header = document.createElement('h1');
      header.innerText = 'Statistics';
      const wordsWithoutErrors = document.createElement('div');
      wordsWithoutErrors.innerHTML = `
        <span>Number of collected words without errors: </span>
        <span>${stat1}</span>`;
      const countErrors = document.createElement('div');
      countErrors.innerHTML = `<span>Number of errors: </span><span>${stat2}</span>`;
      const wordMostErrors = document.createElement('div');
      wordMostErrors.innerHTML = `<span>The word with the most errors: </span><span>${stat3}</span>`;
      console.log(stat3);
      this.statisticsElement.append(
        header,
        wordsWithoutErrors,
        countErrors,
        wordMostErrors
      );
    }
  }
}
