import {CustomSanitizer} from '../custom-sanitizer'; // adjust this path
import {TestBed} from '@angular/core/testing';

describe('CustomSanitizer', () => {
  let service: CustomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomSanitizer],
    });
    service = TestBed.inject(CustomSanitizer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // You can add additional tests below as needed
});
