function transformData(inputArray, options = {}) {
  if (!Array.isArray(inputArray)) {
    throw new TypeError('Input must be an array');
  }

  const defaultOptions = {
    filterNulls: true,
    includeTimestamp: false,
    transformFn: item => item,
    maxItems: Infinity
  };

  const settings = { ...defaultOptions, ...options };
  let result = inputArray;

  // Apply filtering if needed
  if (settings.filterNulls) {
    result = result.filter(item => item != null);
  }

  // Apply custom transformation
  result = result.map(item => {
    const transformed = settings.transformFn(item);

    if (settings.includeTimestamp) {
      return {
        ...transformed,
        timestamp: new Date().toISOString()
      };
    }

    return transformed;
  });

  // Limit results if maxItems is set
  if (settings.maxItems < result.length) {
    result = result.slice(0, settings.maxItems);
  }

  return result;
}

module.exports = transformData;