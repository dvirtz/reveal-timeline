import { uniqueId, indices } from "../src/unique-id";

describe('unique-id', function () {

  test.each([
    [{ h: 0 }, 'slide_0'],
    [{ h: 1, v: 2 }, 'slide_1_2']
  ])('unique-id %#', function (testIndices, testUniqueId) {
    const deck: unknown = {
      getIndices: jest.fn(() => testIndices)
    };
    expect(uniqueId(deck as RevealStatic)).toEqual(testUniqueId);
    expect(indices(testUniqueId)).toEqual(testIndices);
  });
  
});
