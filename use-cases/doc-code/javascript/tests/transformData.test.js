const transformData = require('../src/transformData');

describe('transformData function', () => {
  test('should return the same array when no options are provided', () => {
    const input = [1, 2, 3];
    const result = transformData(input);
    expect(result).toEqual([1, 2, 3]);
  });

  test('should filter out null and undefined values when filterNulls is true', () => {
    const input = [1, null, 2, undefined, 3];
    const result = transformData(input, { filterNulls: true });
    expect(result).toEqual([1, 2, 3]);
  });

  test('should keep null and undefined values when filterNulls is false', () => {
    const input = [1, null, 2, undefined, 3];
    const result = transformData(input, { filterNulls: false });
    expect(result).toEqual([1, null, 2, undefined, 3]);
  });

  test('should apply the transformFn to each item', () => {
    const input = [1, 2, 3];
    const result = transformData(input, { transformFn: x => x * 2 });
    expect(result).toEqual([2, 4, 6]);
  });

  test('should add a timestamp when includeTimestamp is true', () => {
    const input = [{ name: 'item1' }, { name: 'item2' }];
    const result = transformData(input, { includeTimestamp: true });
    
    expect(result[0].name).toBe('item1');
    expect(result[1].name).toBe('item2');
    expect(result[0].timestamp).toBeDefined();
    expect(result[1].timestamp).toBeDefined();
    
    // Check that timestamps are ISO format strings
    const timestamp1 = new Date(result[0].timestamp);
    const timestamp2 = new Date(result[1].timestamp);
    expect(timestamp1).toBeInstanceOf(Date);
    expect(timestamp2).toBeInstanceOf(Date);
  });

  test('should limit the number of items when maxItems is set', () => {
    const input = [1, 2, 3, 4, 5];
    const result = transformData(input, { maxItems: 3 });
    expect(result).toEqual([1, 2, 3]);
  });

  test('should throw TypeError if input is not an array', () => {
    expect(() => {
      transformData('not an array');
    }).toThrow(TypeError);
    
    expect(() => {
      transformData({ key: 'value' });
    }).toThrow(TypeError);
    
    expect(() => {
      transformData(42);
    }).toThrow(TypeError);
  });

  test('should handle an empty array input', () => {
    const input = [];
    const result = transformData(input);
    expect(result).toEqual([]);
  });
  
  test('should apply multiple transformations together', () => {
    const input = [null, 1, null, 2, 3, null];
    const result = transformData(input, {
      filterNulls: true,
      transformFn: x => ({ value: x * 10 }),
      maxItems: 2
    });
    
    expect(result).toEqual([
      { value: 10 },
      { value: 20 }
    ]);
  });
});