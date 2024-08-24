import { Route } from '@angular/router';

import HomeComponent from '../../shared/components/home/home.component';
import { ChecklistItemService } from './checklist/data-access/checklist-item.service';
import { ChecklistService } from './shared/data-access/checklist.service';
import { StorageService } from './shared/data-access/storage.service';

export const ROUTES: Route[] = [
  {
    path: '',
    component: HomeComponent,
    // outlet: 'primary',
    pathMatch: 'prefix',
    providers: [ChecklistService, ChecklistItemService, StorageService],
  },
  {
    path: 'checklist/:id',
    loadComponent: () => import('../../shared/components/checklist/checklist.component'),
    providers: [ChecklistService, ChecklistItemService, StorageService],
  },
];
