import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  AddChecklist,
  Checklist,
  EditChecklist,
} from '../../../../shared/interfaces/checklist';

import {
  AddChecklistItem,
  ChecklistItem,
  EditChecklistItem,
  RemoveChecklistItem,
} from '../../../../shared/interfaces/checklist-item';

import {
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  Firestore,
  query,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { FirestoreUtils } from '../../../../shared/firestore-utils';

@Injectable({
  providedIn: 'root',
})
export class ChecklistItemDataService {
  firestore = inject(Firestore);
  firestoreUtils = inject(FirestoreUtils);

  // #region \\\\\\ for jasmine tests //////
  // These are here so Jasmine can spyOn them.
  // https://jasmine.github.io/tutorials/module_mocking#angular
  collectionPath(userId: string) {
    //
    const path = `/users/${userId}/AsService/ChecklistItems/Items`;

    return path;
  }
  // #endregion

  private getfirestoreDocCollectionRef(userId: string) {
    const collectionReference = collection(
      this.firestore,
      this.collectionPath(userId),
    ) as CollectionReference<ChecklistItem>;

    return collectionReference;
  }

  public getData$(userId: string): Observable<ChecklistItem[]> {
    //
    const firestoreDocQuery = query(this.getfirestoreDocCollectionRef(userId));

    return collectionData(firestoreDocQuery);
  }

  public async add(addItem: AddChecklistItem, userId: string) {
    //
    const item: ChecklistItem = {
      ...addItem.item,
      id: this.createId(),
      checklistId: addItem.checklistId,
      checked: false,
    };

    await setDoc(doc(this.getfirestoreDocCollectionRef(userId), item.id), item);

    return item.id;
  }

  public async edit(editItem: EditChecklistItem, userId: string) {
    //
    // const item: ChecklistItem = { ...editItem.data, id: editItem.id };

    //    await setDoc(doc(this.getfirestoreDocCollectionRef(userId), editItem.id), editItem.data);
    await updateDoc(
      doc(this.getfirestoreDocCollectionRef(userId), editItem.id),
      editItem.data,
    );

    return editItem.id;
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
