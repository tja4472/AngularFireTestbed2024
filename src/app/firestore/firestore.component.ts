import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
// import { persistenceEnabled as _persistenceEnabled } from '../app.module';
import { traceUntilFirst } from '@angular/fire/performance';
import {
  addDoc,
  doc,
  docData,
  Firestore,
  setDoc,
} from '@angular/fire/firestore';
import { AsyncPipe, JsonPipe } from '@angular/common';

/*
    <small>Persistence enabled: <code>{{ (persistenceEnabled | async) ?? false }}</code></small>
*/

@Component({
  selector: 'app-firestore',
  template: `<p>
    Firestore!
    <code>{{ testDocValue$ | async | json }}</code>
    <br />
  </p>`,
  standalone: true,
  imports: [AsyncPipe, JsonPipe],
})
export class FirestoreComponent implements OnInit {
  public readonly testDocValue$: Observable<any>;
  // public readonly persistenceEnabled = _persistenceEnabled;

  constructor(firestore: Firestore) {
    const ref = doc(firestore, 'test/1');

    setDoc(ref, { xx: 'DDD' });

    // this.testDocValue$ = docData(ref).pipe(traceUntilFirst('firestore'));
    this.testDocValue$ = docData(ref);
    // this.testDocValue$ = of('DummY')
  }

  ngOnInit(): void {}
}
