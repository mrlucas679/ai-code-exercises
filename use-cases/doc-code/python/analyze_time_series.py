def analyze_time_series(data, column, start_date=None, end_date=None, freq='D', fill_method=None, aggregation=None):
    import pandas as pd
    import numpy as np
    from datetime import datetime

    # Convert to DataFrame if it's a list or dict
    if not isinstance(data, pd.DataFrame):
        data = pd.DataFrame(data)

    # Ensure date column is datetime
    if 'date' not in data.columns:
        raise ValueError("Data must contain a 'date' column")

    if not pd.api.types.is_datetime64_any_dtype(data['date']):
        data['date'] = pd.to_datetime(data['date'])

    # Filter by date range if specified
    if start_date:
        if not isinstance(start_date, datetime):
            start_date = pd.to_datetime(start_date)
        data = data[data['date'] >= start_date]

    if end_date:
        if not isinstance(end_date, datetime):
            end_date = pd.to_datetime(end_date)
        data = data[data['date'] <= end_date]

    # Ensure target column exists
    if column not in data.columns:
        raise ValueError(f"Column '{column}' not found in data")

    # Set date as index
    data = data.set_index('date')

    # Resample to regular time periods
    if aggregation:
        if aggregation == 'sum':
            resampled = data[column].resample(freq).sum()
        elif aggregation == 'mean':
            resampled = data[column].resample(freq).mean()
        elif aggregation == 'median':
            resampled = data[column].resample(freq).median()
        elif aggregation == 'max':
            resampled = data[column].resample(freq).max()
        elif aggregation == 'min':
            resampled = data[column].resample(freq).min()
        elif aggregation == 'count':
            resampled = data[column].resample(freq).count()
        else:
            raise ValueError(f"Unsupported aggregation method: {aggregation}")
    else:
        # Default to mean
        resampled = data[column].resample(freq).mean()

    # Handle missing values if specified
    if fill_method:
        if fill_method == 'ffill':
            resampled = resampled.fillna(method='ffill')
        elif fill_method == 'bfill':
            resampled = resampled.fillna(method='bfill')
        elif fill_method == 'interpolate':
            resampled = resampled.interpolate()
        elif isinstance(fill_method, (int, float)):
            resampled = resampled.fillna(fill_method)

    # Calculate basic statistics
    stats = {
        'mean': resampled.mean(),
        'median': resampled.median(),
        'std_dev': resampled.std(),
        'min': resampled.min(),
        'max': resampled.max(),
        'range': resampled.max() - resampled.min(),
        'count': resampled.count(),
        'missing': resampled.isna().sum()
    }

    # Check for trend using linear regression
    x = np.arange(len(resampled))
    y = resampled.values
    valid_mask = ~np.isnan(y)
    if np.sum(valid_mask) > 1:  # Need at least 2 points for regression
        x_valid = x[valid_mask]
        y_valid = y[valid_mask]
        slope, intercept = np.polyfit(x_valid, y_valid, 1)
        stats['trend_slope'] = slope
        stats['trend_direction'] = 'increasing' if slope > 0 else 'decreasing' if slope < 0 else 'stable'

    # Check for seasonality
    if len(resampled) >= 4:  # Need enough data points
        from statsmodels.tsa.seasonal import STL
        try:
            stl = STL(resampled.dropna(), seasonal=13)
            result = stl.fit()
            seasonal_strength = 1 - (result.resid.var() / (result.seasonal + result.resid).var())
            stats['seasonal_strength'] = seasonal_strength
            stats['has_seasonality'] = seasonal_strength > 0.3
        except:
            # STL might fail for various reasons
            stats['has_seasonality'] = False

    return {
        'resampled_data': resampled,
        'statistics': stats
    }