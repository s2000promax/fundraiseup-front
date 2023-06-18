import { Task } from '@/types/model';

export class Statistics {
  getWordsWithoutErrors(tasks: Task): number {
    let result = 0;
    for (const item of tasks.answers) {
      if (item.errorCounter === 0) {
        result += 1;
      }
    }

    return result;
  }

  getCountErrors(tasks: Task): number {
    let result = 0;
    for (const item of tasks.answers) {
      result += item.errorCounter;
    }

    return result;
  }

  getWordsMostErrors(tasks: Task) {
    let maxIndexOfErrors = 0;
    for (let index = 1; index < tasks.answers.length; index += 1) {
      if (
        tasks.answers[index].errorCounter >
        tasks.answers[maxIndexOfErrors].errorCounter
      ) {
        maxIndexOfErrors = index;
      }
    }

    const maxError = tasks.answers[maxIndexOfErrors].errorCounter;

    const resultArray = [];

    if (maxError !== 0) {
      for (let index = 0; index < tasks.answers.length; index += 1) {
        if (tasks.answers[index].errorCounter === maxError) {
          resultArray.push(tasks.answers[index].answer.text);
        }
      }
    } else {
      resultArray.push('No errors');
    }

    return resultArray.join(', ');
  }
}
