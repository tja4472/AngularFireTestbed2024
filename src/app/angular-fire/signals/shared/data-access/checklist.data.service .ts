import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';

import {
  AddChecklist,
  Checklist,
  EditChecklist,
} from 'src/app/shared/interfaces/checklist';

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
export class ChecklistDataService {
  firestore = inject(Firestore);
  firestoreUtils = inject(FirestoreUtils);

  // #region \\\\\\ for jasmine tests //////
  // These are here so Jasmine can spyOn them.
  // https://jasmine.github.io/tutorials/module_mocking#angular
  collectionPath(userId: string): string {
    //
    const path = `/AngularFireUsers/${userId}/Checklists`;

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
    //
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

    // await setDoc(doc(this.getfirestoreDocCollectionRef(userId), item.id), item);
    await updateDoc(
      doc(this.getfirestoreDocCollectionRef(userId), editItem.id),
      editItem.data,
    );

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
