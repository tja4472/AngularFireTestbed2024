import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import {
  AddChecklist,
  Checklist,
  EditChecklist,
} from 'src/app/shared/interfaces/checklist';
import { ChecklistItemService } from '../../checklist/data-access/checklist-item.service';
import { StorageService } from './storage.service';

import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

export interface ChecklistsState {
  checklists: Checklist[];
  loaded: boolean;
  error: string | null;
}

const initialState: ChecklistsState = {
  checklists: [],
  loaded: false,
  error: null,
};

const ChecklistStore = signalStore(
  withState(initialState),
  withMethods((store) => ({
    set(dataToSet: Partial<ChecklistsState>): void {
      patchState(store, dataToSet);
    },
  })),
);

@Injectable()
export class ChecklistService {
  private checklistItemService = inject(ChecklistItemService);
  private storageService = inject(StorageService);

  private checklistStore = new ChecklistStore();

  // state
  /*  
  private state = signal<ChecklistsState>({
    checklists: [],
    loaded: false,
    error: null,
  });
*/
  // selectors
  /*  
  // (property) ChecklistService.checklists: Signal<Checklist[]>
  checklists = computed(() => this.state().checklists);
  loaded = computed(() => this.state().loaded);
  error = computed(() => this.state().error);
*/

  // selectors
  checklists = this.checklistStore.checklists;
  loaded = this.checklistStore.loaded;
  error = this.checklistStore.error;

  // sources
  private checklistsLoaded$ = this.storageService.loadChecklists();
  add$ = new Subject<AddChecklist>();
  edit$ = new Subject<EditChecklist>();
  remove$ = this.checklistItemService.checklistRemoved$;

  constructor() {
    // reducers
    this.checklistsLoaded$.pipe(takeUntilDestroyed()).subscribe({
      next: (checklists) => {
        this.checklistStore.set({ checklists, loaded: true });
        /*        
        return this.state.update((state) => ({
          ...state,
          checklists,
          loaded: true,
        }));
*/
      },
      error: (err) => {
        this.checklistStore.set({ error: err });
        // return this.state.update((state) => ({ ...state, error: err }));
      },
    });

    this.add$.pipe(takeUntilDestroyed()).subscribe((checklist) => {
      this.checklistStore.set({
        checklists: [
          ...this.checklistStore.checklists(),
          this.addIdToChecklist(checklist),
        ],
      });
      /*        
        return this.state.update((state) => ({
          ...state,
          checklists: [...state.checklists, this.addIdToChecklist(checklist)],
        }));
*/
    });

    this.remove$.pipe(takeUntilDestroyed()).subscribe((id) => {
      this.checklistStore.set({
        checklists: this.checklistStore
          .checklists()
          .filter((checklist) => checklist.id !== id),
      });
      /*        
        return this.state.update((state) => ({
          ...state,
          checklists: state.checklists.filter((checklist) => checklist.id !== id),
        }));
*/
    });

    this.edit$.pipe(takeUntilDestroyed()).subscribe((update) => {
      this.checklistStore.set({
        checklists: this.checklistStore
          .checklists()
          .map((checklist) =>
            checklist.id === update.id
              ? { ...checklist, title: update.data.title }
              : checklist,
          ),
      });
      /*        
        return this.state.update((state) => ({
          ...state,
          checklists: state.checklists.map((checklist) => checklist.id === update.id
            ? { ...checklist, title: update.data.title }
            : checklist
          ),
        }));
*/
    });

    // effects
    effect(() => {
      if (this.loaded()) {
        this.storageService.saveChecklists(this.checklists());
      }
    });
  }

  private addIdToChecklist(checklist: AddChecklist) {
    return {
      ...checklist,
      id: this.generateSlug(checklist.title),
    };
  }

  private generateSlug(title: string) {
    // NOTE: This is a simplistic slug generator and will not handle things like special characters.
    let slug = title.toLowerCase().replace(/\s+/g, '-');

    // Check if the slug already exists
    const matchingSlugs = this.checklists().find(
      (checklist) => checklist.id === slug,
    );

    // If the title is already being used, add a string to make the slug unique
    if (matchingSlugs) {
      slug = slug + Date.now().toString();
    }

    return slug;
  }
}
