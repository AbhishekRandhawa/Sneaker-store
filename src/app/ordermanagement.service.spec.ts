import { TestBed } from '@angular/core/testing';

import { OrdermanagementService } from './ordermanagement.service';

describe('OrdermanagementService', () => {
  let service: OrdermanagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdermanagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
