import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PseudocodeParserService } from './pseudocode-parser.service';

describe('PseudocodeParserService', () => {
  let service: PseudocodeParserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PseudocodeParserService],
    });

    service = TestBed.inject(PseudocodeParserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch algorithm pseudocode successfully', () => {
    const algorithmName = 'example-algorithm';
    const expectedUrl = `../../../assets/${algorithmName}-pseudocode.txt`;
    const mockPseudocode = 'Example content';

    service.getAlgorithmPseudocode(algorithmName).subscribe((pseudocode) => {
      expect(pseudocode).toEqual(mockPseudocode);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');

    req.flush(mockPseudocode);
  });

  it('should handle http error during pseudocode fetch', () => {
    const algorithmName = 'example-algorithm';
    const expectedUrl = `../../../assets/${algorithmName}-pseudocode.txt`;

    const errorMessage = "ERROR  - Cannot fetch pseudocode for algorithm: " + algorithmName + ".";
    const status = 404;

    service.getAlgorithmPseudocode(algorithmName).subscribe(
      (errorPseudocode) => expect(errorPseudocode).toEqual("ERROR  - Cannot fetch pseudocode for algorithm: " + algorithmName + "."),
      (error) => {
        fail("Expected a string to be handle error, not an actual error");
      }
    );

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');

    req.flush(errorMessage, { status, statusText: 'Not Found' });
  });
});

