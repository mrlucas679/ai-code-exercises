// Strategy for standard shipping
const standardShipping = {
  calculate(packageDetails, destinationCountry) {
    const { weight, length, width, height } = packageDetails;
    let cost = 0;

    if (destinationCountry === 'USA') {
      cost = weight * 2.5;
    } else if (destinationCountry === 'Canada') {
      cost = weight * 3.5;
    } else if (destinationCountry === 'Mexico') {
      cost = weight * 4.0;
    } else {
      cost = weight * 4.5;
    }

    if (weight < 2 && (length * width * height) > 1000) {
      cost += 5.0;
    }

    return cost;
  }
};

// Strategy for express shipping
const expressShipping = {
  calculate(packageDetails, destinationCountry) {
    const { weight, length, width, height } = packageDetails;
    let cost = 0;

    if (destinationCountry === 'USA') {
      cost = weight * 4.5;
    } else if (destinationCountry === 'Canada') {
      cost = weight * 5.5;
    } else if (destinationCountry === 'Mexico') {
      cost = weight * 6.0;
    } else {
      cost = weight * 7.5;
    }

    if ((length * width * height) > 5000) {
      cost += 15.0;
    }

    return cost;
  }
};

// Strategy for overnight shipping
const overnightShipping = {
  calculate(packageDetails, destinationCountry) {
    const { weight } = packageDetails;

    if (destinationCountry === 'USA') {
      return weight * 9.5;
    } else if (destinationCountry === 'Canada') {
      return weight * 12.5;
    } else {
      return null;
    }
  }
};

// Map of strategies
const shippingStrategies = {
  standard: standardShipping,
  express: expressShipping,
  overnight: overnightShipping
};

// Main function  now delegates to the right strategy
function calculateShippingCost(packageDetails, destinationCountry, shippingMethod) {
  const strategy = shippingStrategies[shippingMethod];

  if (!strategy) {
    return 'Unknown shipping method';
  }

  const cost = strategy.calculate(packageDetails, destinationCountry);

  if (cost === null) {
    return 'Overnight shipping not available for this destination';
  }

  return parseFloat(cost).toFixed(2);
}

module.exports = { calculateShippingCost };
