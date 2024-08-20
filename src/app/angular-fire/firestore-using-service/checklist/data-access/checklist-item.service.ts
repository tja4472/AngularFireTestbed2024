import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { StorageService } from '../../shared/data-access/storage.service';
import { RemoveChecklist } from 'src/app/shared/interfaces/checklist';
import {
  AddChecklistItem,
  ChecklistItem,
  EditChecklistItem,
  RemoveChecklistItem,
} from 'src/app/shared/interfaces/checklist-item';

import { ChecklistItemDataService } from '../../shared/data-access/checklist-item.data.service';
export interface ChecklistItemsState {
  checklistItems: ChecklistItem[];
  loaded: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ChecklistItemService {
  private storageService = inject(StorageService);
  private checklistItemDataService = inject(ChecklistItemDataService);

  private userId = 'DummyUser';

  // state
  private state = signal<ChecklistItemsState>({
    checklistItems: [],
    loaded: false,
  });

  // selectors
  checklistItems = computed(() => this.state().checklistItems);
  loaded = computed(() => this.state().loaded);

  // sources
  // private AchecklistItemsLoaded$ = this.storageService.loadChecklistItems();
  private checklistItemsLoaded$ = this.checklistItemDataService.getData$(
    this.userId,
  );

  add$ = new Subject<AddChecklistItem>();
  remove$ = new Subject<RemoveChecklistItem>();
  edit$ = new Subject<EditChecklistItem>();
  toggle$ = new Subject<RemoveChecklistItem>();
  reset$ = new Subject<RemoveChecklist>();
  checklistRemoved$ = new Subject<RemoveChecklist>();

  constructor() {
    this.checklistItemsLoaded$
      .pipe(takeUntilDestroyed())
      .subscribe((checklistItems) =>
        this.state.update((state) => ({
          ...state,
          checklistItems,
          loaded: true,
        })),
      );

    this.add$.pipe(takeUntilDestroyed()).subscribe(
      (checklistItem) =>
        // this.checklistItemDataService.add(checklistItem, this.userId),
        this.checklistItemDataService.set({
          userId: this.userId,
          checklistId: checklistItem.checklistId,
          data: checklistItem.item,
        }),
      /*      
      this.state.update((state) => ({
        ...state,
        checklistItems: [
          ...state.checklistItems,
          {
            ...checklistItem.item,
            id: Date.now().toString(),
            checklistId: checklistItem.checklistId,
            checked: false,
          },
        ],
      })),
*/
    );

    this.edit$.pipe(takeUntilDestroyed()).subscribe(
      (update) =>
        this.checklistItemDataService.update({
          userId: this.userId,
          id: update.id,
          data: update.data,
        }),
      /*      
      this.state.update((state) => ({
        ...state,
        checklistItems: state.checklistItems.map((item) =>
          item.id === update.id ? { ...item, title: update.data.title } : item,
        ),
      })),
      */
    );

    this.remove$.pipe(takeUntilDestroyed()).subscribe(
      (id) => this.checklistItemDataService.remove(id, this.userId),
      /*      
      this.state.update((state) => ({
        ...state,
        checklistItems: state.checklistItems.filter((item) => item.id !== id),
      })),
*/
    );

    this.toggle$.pipe(takeUntilDestroyed()).subscribe((checklistItemId) => {
      const item = this.state().checklistItems.find(
        (item) => item.id === checklistItemId,
      );

      if (item) {
        this.checklistItemDataService.update({
          userId: this.userId,
          id: item.id,
          data: { checked: !item.checked },
        });
      }
      /*        
        return this.state.update((state) => ({
          ...state,
          checklistItems: state.checklistItems.map((item) => item.id === checklistItemId
            ? { ...item, checked: !item.checked }
            : item
          ),
        }));
      */
    });

    // TODO: reset: Update to use firestore
    this.reset$.pipe(takeUntilDestroyed()).subscribe((checklistId) => {
      this.state().checklistItems.map((item) => {
        if (item.checklistId === checklistId) {
          if (item.checked) {
            this.checklistItemDataService.update({
              userId: this.userId,
              id: item.id,
              data: { checked: false },
            });
          }
        }
      });
      /*      
      return this.state.update((state) => ({
        ...state,
        checklistItems: state.checklistItems.map((item) =>
          item.checklistId === checklistId ? { ...item, checked: false } : item,
        ),
      }));
      */
    });

    // TODO: checklistRemoved: Update to use firestore
    this.checklistRemoved$.pipe(takeUntilDestroyed()).subscribe((checklistId) =>
      this.state.update((state) => ({
        ...state,
        checklistItems: state.checklistItems.filter(
          (item) => item.checklistId !== checklistId,
        ),
      })),
    );

    // effects
    effect(() => {
      if (this.loaded()) {
        this.storageService.saveChecklistItems(this.checklistItems());
      }
    });
  }
}
