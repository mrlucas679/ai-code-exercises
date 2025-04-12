// Example usage patterns for the transformData function
const { transformData } = require('./src');

// Example 1: Basic filtering of null values
const dataWithNulls = [
  { id: 1, name: 'Product A', price: 19.99 },
  null,
  { id: 2, name: 'Product B', price: 29.99 },
  undefined,
  { id: 3, name: 'Product C', price: 39.99 }
];

const cleanData = transformData(dataWithNulls);
console.log('Example 1 - Filter nulls:', cleanData);

// Example 2: Custom transformation
const users = [
  { id: 1, firstName: 'John', lastName: 'Doe' },
  { id: 2, firstName: 'Jane', lastName: 'Smith' },
  { id: 3, firstName: 'Bob', lastName: 'Johnson' }
];

const formattedUsers = transformData(users, {
  transformFn: user => ({
    id: user.id,
    fullName: `${user.firstName} ${user.lastName}`,
    initials: `${user.firstName[0]}${user.lastName[0]}`
  })
});

console.log('Example 2 - Custom transformation:', formattedUsers);

// Example 3: Adding timestamps for data tracking
const events = [
  { type: 'login', userId: 123 },
  { type: 'purchase', userId: 123, productId: 456 },
  { type: 'logout', userId: 123 }
];

const timestampedEvents = transformData(events, {
  includeTimestamp: true
});

console.log('Example 3 - With timestamps:', timestampedEvents);

// Example 4: Limiting results for pagination
const allProducts = [
  { id: 1, name: 'Product A' },
  { id: 2, name: 'Product B' },
  { id: 3, name: 'Product C' },
  { id: 4, name: 'Product D' },
  { id: 5, name: 'Product E' }
];

const firstPage = transformData(allProducts, {
  maxItems: 2
});

console.log('Example 4 - Paginated results:', firstPage);

// Example 5: Combining options
const rawData = [
  null,
  { id: 1, value: 10 },
  { id: 2, value: 20 },
  undefined,
  { id: 3, value: 30 },
  { id: 4, value: 40 },
  null
];

const processedData = transformData(rawData, {
  filterNulls: true,
  transformFn: item => ({
    id: item.id,
    doubledValue: item.value * 2
  }),
  includeTimestamp: true,
  maxItems: 3
});

console.log('Example 5 - Combined options:', processedData);