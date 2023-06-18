import { Task } from '@/types/model';

export class Storage {
  getFromLocalStorage(key: string): Task | undefined {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error(
          `Error parsing data from localStorage for key '${key}':`,
          error
        );
      }
    }
    return undefined;
  }

  saveToLocalStorage(key: string, data: Task): void {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
    } catch (error) {
      console.error(
        `Error saving data to localStorage for key '${key}':`,
        error
      );
    }
  }
}
