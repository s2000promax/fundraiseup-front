import { Model } from './model';
import { View } from '@/types/view';

export interface Controller {
  model: Model;
  view: View;
}
