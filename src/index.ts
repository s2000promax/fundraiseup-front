import { SimulatorController } from '@/modules/SimulatorController';

const words = [
  'apple',
  'function',
  'timeout',
  'task',
  'application',
  'data',
  'tragedy',
  'sun',
  'symbol',
  'button',
  'software',
];

const controller = new SimulatorController(words, 6);
controller.start();
