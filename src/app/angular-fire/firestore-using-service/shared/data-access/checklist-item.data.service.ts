import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

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

import { Omit2 } from 'src/app/shared/type.utils';

type zzz = { item: Partial<Omit<ChecklistItem, 'id' | 'checklistId'>> };

type T1 = Partial<ChecklistItem>;

const a1: T1 = { title: 'aaa' };
const a2: T1 = { checked: true };
const a3: T1 = { id: 'sss' };

type T2 = Omit<T1, 'id' | 'checklistId'>;

const b1: T2 = { title: 'aaa' };
const b2: T2 = { checked: true };
const b3: T2 = { title: 'aaa', checked: false };
// const b3: T2 = { id: 'sss' }; 'id' does not exist in type 'T2'

/*
type T3 = {
  title?: string | undefined;
  checked?: boolean | undefined;
}
*/
type T3 = Partial<Omit<ChecklistItem, 'id' | 'checklistId'>>;
const c1: T3 = { title: 'aaa' };
const c2: T3 = { checked: true };
const c3: T3 = { title: 'aaa', checked: false };

/*
type T4 = {
    title?: string | undefined;
    checked?: boolean | undefined;
}
*/
type T4 = Omit<Partial<ChecklistItem>, 'id' | 'checklistId'>;

/*
type T5 = {
    checked: boolean;
    title: string;
}
*/
type T5 = Omit<ChecklistItem, 'id' | 'checklistId'>;

/*
Doesn't error on incorrect key
type T6 = {
    checklistId: string;
    title: string;
    checked: boolean;
}
*/
type T6 = Omit<ChecklistItem, 'id' | 'AAAA'>;

// Omit type does not validate keys correctly
// https://github.com/microsoft/TypeScript/issues/52871

/*
type P1 = {
  id: string;
  checklistId: string;
}
*/
type P1 = Pick<ChecklistItem, 'id' | 'checklistId'>;

/*
Type '"id" | "AAAA"' does not satisfy the constraint 'keyof ChecklistItem'.
type P2 = Pick<ChecklistItem, 'id' | 'AAAA'>
*/

interface Obj {
  key1: string;
  key2: number;
}

type R1 = Omit2<Obj, 'key1'>; // Type '"kye1"' does not satisfy the constraint 'keyof Obj'.(2344)

type Set = {
  userId: string;
  checklistId: ChecklistItem['id'];
  data: Omit2<ChecklistItem, 'id' | 'checklistId' | 'checked'>;
};

type Updates = {
  userId: string;
  id: ChecklistItem['id'];
  data: Partial<Omit2<ChecklistItem, 'id' | 'checklistId'>>;
};

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
    const path = `/AngularFireUsers/${userId}/ChecklistItems`;

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

  public async set(itemToSet: Set) {
    //
    const item: ChecklistItem = {
      ...itemToSet.data,
      id: this.createId(),
      checklistId: itemToSet.checklistId,
      checked: false,
    };

    await setDoc(
      doc(this.getfirestoreDocCollectionRef(itemToSet.userId), item.id),
      item,
    );

    return item.id;
  }

  public update(update: Updates) {
    //
    updateDoc(
      doc(this.getfirestoreDocCollectionRef(update.userId), update.id),
      update.data,
    );
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
