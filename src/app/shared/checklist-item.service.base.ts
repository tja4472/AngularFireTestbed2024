import { Injectable, Signal, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { RemoveChecklist } from 'src/app/shared/interfaces/checklist';
import {
  AddChecklistItem,
  ChecklistItem,
  EditChecklistItem,
  RemoveChecklistItem,
} from 'src/app/shared/interfaces/checklist-item';

export abstract class ChecklistItemServiceBase {
  // selectors
  abstract checklistItems: Signal<ChecklistItem[]>
  
  // sources
  abstract add$: Subject<AddChecklistItem>
  abstract checklistRemoved$: Subject<string>;
  abstract edit$: Subject<EditChecklistItem>
  abstract remove$: Subject<string>;
  abstract reset$: Subject<string>;
  abstract toggle$: Subject<string>;
}
