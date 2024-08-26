import {
  Injectable,
  Signal,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Subject } from 'rxjs';
import {
  AddChecklist,
  Checklist,
  EditChecklist,
} from 'src/app/shared/interfaces/checklist';

export abstract class ChecklistServiceBase {
  // selectors
  abstract checklists: Signal<Checklist[]>;

  // sources
  abstract add$: Subject<AddChecklist>;
  abstract edit$: Subject<EditChecklist>;
  abstract remove$: Subject<string>;
}
