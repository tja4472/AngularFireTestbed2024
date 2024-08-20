import {
  Inject,
  Injectable,
  InjectionToken,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { Observable, of } from 'rxjs';

import {
  AddChecklist,
  Checklist,
  EditChecklist,
} from 'src/app/shared/interfaces/checklist';
import {
  AddChecklistItem,
  ChecklistItem,
  EditChecklistItem,
  RemoveChecklistItem,
} from 'src/app/shared/interfaces/checklist-item';
import { ChecklistItemService } from '../../checklist/data-access/checklist-item.service';

import {
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  Firestore,
  query,
  setDoc,
} from '@angular/fire/firestore';
import { FirestoreUtils } from '../../../../shared/firestore-utils';

export const LOCAL_STORAGE = new InjectionToken<Storage>(
  'window local storage object',
  {
    providedIn: 'root',
    factory: () => {
      return inject(PLATFORM_ID) === 'browser'
        ? window.localStorage
        : ({} as Storage);
    },
  },
);

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  storage = inject(LOCAL_STORAGE);
  firestore = inject(Firestore);
  firestoreUtils = inject(FirestoreUtils);

  loadChecklists() {
    const checklists = this.storage.getItem('checklists');
    return of(checklists ? (JSON.parse(checklists) as Checklist[]) : []);
  }

  loadChecklistItems() {
    const checklistsItems = this.storage.getItem('checklistItems');
    return of(
      checklistsItems ? (JSON.parse(checklistsItems) as ChecklistItem[]) : [],
    );
  }

  saveChecklists(checklists: Checklist[]) {
    this.storage.setItem('checklists', JSON.stringify(checklists));
  }

  saveChecklistItems(checklistItems: ChecklistItem[]) {
    this.storage.setItem('checklistItems', JSON.stringify(checklistItems));
  }

  // #region \\\\\\ for jasmine tests //////
  // These are here so Jasmine can spyOn them.
  // https://jasmine.github.io/tutorials/module_mocking#angular
  collectionPath(userId: string): string {
    //
    const path = `/users/${userId}/AsService`;
    //const path = `/users/a/b`;

    return path;
  }
  // #endregion

  private getfirestoreDocCollectionRef(userId: string) {
    const collectionReference = collection(
      this.firestore,
      this.collectionPath(userId),
    ) as CollectionReference<Checklist>;

    return collectionReference;
  }

  public getData$(userId: string): Observable<Checklist[]> {
    const firestoreDocQuery = query(this.getfirestoreDocCollectionRef(userId));

    return collectionData(firestoreDocQuery);
  }

  public async add(addItem: AddChecklist, userId: string) {
    //
    const item: Checklist = { ...addItem, id: this.createId() };

    await setDoc(doc(this.getfirestoreDocCollectionRef(userId), item.id), item);

    return item.id;
  }

  public async edit(editItem: EditChecklist, userId: string) {
    //
    const item: Checklist = { ...editItem.data, id: editItem.id };

    await setDoc(doc(this.getfirestoreDocCollectionRef(userId), item.id), item);

    return item.id;
  }

  public async remove(id: string, userId: string): Promise<void> {
    //
    const documentReference = doc(
      this.getfirestoreDocCollectionRef(userId),
      id,
    );
    await deleteDoc(documentReference);
  }

  private createId(): string {
    //
    const result = this.firestoreUtils.createId();

    return result;
  }
}
