import { TestBed } from '@angular/core/testing';

import { SetLegendService } from './set-legend.service';

describe('SetLegendService', () => {
  let service: SetLegendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetLegendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
