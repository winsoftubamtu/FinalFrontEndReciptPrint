import { TestBed } from '@angular/core/testing';

import { BillLocalService } from './bill-local-service';

describe('BillLocalService', () => {
  let service: BillLocalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillLocalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
