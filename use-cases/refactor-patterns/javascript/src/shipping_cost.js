/** Returns the rate for a destination country from a rates map, or a default rate.
 * @param {Object} rates - Map of country to rate
 * @param {string} country - Destination country
 * @param {number} defaultRate - Rate for unlisted countries
 * @returns {number} The applicable rate
 */
function getRateForCountry(rates, country, defaultRate) {
  return rates[country] !== undefined ? rates[country] : defaultRate;
}

/** Shipping strategy for standard delivery. Calculates cost by weight and destination. */
const standardShipping = {
  calculate(packageDetails, destinationCountry) {
    const { weight, length, width, height } = packageDetails;
    let cost = 0;

    const rates = {
      USA: 2.5,
      Canada: 3.5,
      Mexico: 4.0
    };

    cost = weight * getRateForCountry(rates, destinationCountry, 4.5);

    if (weight < 2 && (length * width * height) > 1000) {
      cost += 5.0;
    }

    return cost;
  }
};

/** Shipping strategy for express delivery. Adds surcharge for large packages. */
const expressShipping = {
  calculate(packageDetails, destinationCountry) {
    const { weight, length, width, height } = packageDetails;
    let cost = 0;

    const rates = {
      USA: 4.5,
      Canada: 5.5,
      Mexico: 6.0
    };

    cost = weight * getRateForCountry(rates, destinationCountry, 7.5);

    if ((length * width * height) > 5000) {
      cost += 15.0;
    }

    return cost;
  }
};

/** Shipping strategy for overnight delivery. Only available for USA and Canada. */
const overnightShipping = {
  calculate(packageDetails, destinationCountry) {
    const { weight } = packageDetails;

    const rates = {
      USA: 9.5,
      Canada: 12.5
    };

    const rate = getRateForCountry(rates, destinationCountry, null);
    if (rate === null) {
      return null;
    }

    return weight * rate;
  }
};

// Map of strategies
const shippingStrategies = {
  standard: standardShipping,
  express: expressShipping,
  overnight: overnightShipping
};

/** Looks up the shipping strategy by method and delegates cost calculation.
 * @param {Object} packageDetails - Package dimensions and weight
 * @param {string} destinationCountry - Target country
 * @param {string} shippingMethod - 'standard', 'express', or 'overnight'
 * @returns {string|'Unknown shipping method'} Formatted cost or error string
 */
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
