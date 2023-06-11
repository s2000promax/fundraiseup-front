import { Task } from '@/types/model';
export class SimulatorDOMView {
  private answerElement: HTMLElement | null;
  private lettersElement: HTMLElement | null;
  private currentQuestionElement: HTMLElement | null;
  private totalQuestionsElement: HTMLElement | null;

  constructor() {
    this.answerElement = document.getElementById('answer');
    this.lettersElement = document.getElementById('letters');
    this.currentQuestionElement = document.getElementById('current_question');
    this.totalQuestionsElement = document.getElementById('total_questions');
  }

  beforeStart() {
    return window.confirm('You have unfinished exercises. Continue?');
  }
  render(task: Task) {
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

      if (this.answerElement) {
        this.answerElement.innerHTML = '';
        task.answers[task.currentTask - 1].answer.split('').forEach((char) => {
          const charElement = document.createElement('button');
          charElement.classList.add('btn', 'btn-success', 'm-1');
          charElement.textContent = char;

          this.answerElement?.appendChild(charElement);
        });
      }
    }
  }

  renderAnswer(task: Task): void {}

  renderLetters(task: Task): void {}

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

  showStatistics(tasks: Task): void {}
}
