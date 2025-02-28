import { TestBed } from '@angular/core/testing';

import { SetLayerService } from './set-layer.service';

describe('SetLayerService', () => {
  let service: SetLayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetLayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
