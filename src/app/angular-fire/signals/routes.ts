import { Route } from '@angular/router';

import { ChecklistItemService } from './checklist/data-access/checklist-item.service';
import { ChecklistItemServiceBase } from 'src/app/shared/checklist-item.service.base';
import { ChecklistService } from './shared/data-access/checklist.service';
import { ChecklistServiceBase } from 'src/app/shared/checklist.service.base';
import LocalHomeComponent from './local-home.component';

export const ROUTES: Route[] = [
  {
    path: '',
    component: LocalHomeComponent,
    // outlet: 'primary',
    pathMatch: 'prefix',
    providers: [
      { provide: ChecklistServiceBase, useClass: ChecklistService },
      { provide: ChecklistItemServiceBase, useClass: ChecklistItemService },
    ],
  },
  {
    path: 'checklist/:id',
    loadComponent: () => import('./local-checklist.component'),
    providers: [
      { provide: ChecklistServiceBase, useClass: ChecklistService },
      { provide: ChecklistItemServiceBase, useClass: ChecklistItemService },
    ],
  },
];
