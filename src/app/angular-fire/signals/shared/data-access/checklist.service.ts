import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, tap } from 'rxjs';
import {
  AddChecklist,
  Checklist,
  EditChecklist,
} from 'src/app/shared/interfaces/checklist';

import { ChecklistItemServiceBase } from 'src/app/shared/checklist-item.service.base';
import { ChecklistServiceBase } from 'src/app/shared/checklist.service.base';

import { ChecklistDataService } from './checklist.data.service ';
export interface ChecklistsState {
  checklists: Checklist[];
  loaded: boolean;
  error: string | null;
}

@Injectable()
export class ChecklistService extends ChecklistServiceBase {
  private checklistItemService = inject(ChecklistItemServiceBase);
  private storageService = inject(ChecklistDataService);

  private userId = 'DummyUser';

  // state
  private state = signal<ChecklistsState>({
    checklists: [],
    loaded: false,
    error: null,
  });

  // selectors
  checklists = computed(() => this.state().checklists);
  loaded = computed(() => this.state().loaded);
  error = computed(() => this.state().error);

  // sources
  // private checklistsLoaded$ = this.storageService.loadChecklists();
  private checklistsLoaded$ = this.storageService.getData$(this.userId);
  add$ = new Subject<AddChecklist>();
  edit$ = new Subject<EditChecklist>();
  remove$ = this.checklistItemService.checklistRemoved$;

  constructor() {
    super();
    // reducers
    this.checklistsLoaded$.pipe(takeUntilDestroyed()).subscribe({
      next: (checklists) =>
        this.state.update((state) => ({
          ...state,
          checklists,
          loaded: true,
        })),
      error: (err) => this.state.update((state) => ({ ...state, error: err })),
    });

    this.add$
      .pipe(takeUntilDestroyed())
      .subscribe((checklist) =>
        this.storageService.add(checklist, this.userId),
      );

    this.remove$
      .pipe(takeUntilDestroyed())
      .subscribe((id) => this.storageService.remove(id, this.userId));

    this.edit$
      .pipe(takeUntilDestroyed())
      .subscribe((update) => this.storageService.edit(update, this.userId));
  }
}
