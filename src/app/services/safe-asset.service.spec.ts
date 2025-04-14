import { TestBed } from '@angular/core/testing';

import { SafeAssetService } from './safe-asset.service';

describe('SafeAssetService', () => {
  let service: SafeAssetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafeAssetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
