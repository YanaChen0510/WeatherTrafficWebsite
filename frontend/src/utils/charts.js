
/**
 * Calculate a step size for chart axis ticks based on the maximum value.
 * @param {number[]} values - Array of numeric values to determine the step size.
 * @returns {number} Calculated step size for axis ticks.
 */
export function calculateStepSize(values) {
    const max = Math.max(...values, 1);

    if (max > 10000) return 10000;
    if (max > 1000) return 1000;

    return Math.ceil(max / 5);
}

/**
 * Calculate the linear regression line for a set of points.
 * @param {Array<{x: number, y: number}>} points - Array of points with `x` and `y` coordinates.
 * @returns {{ m: number, b: number, lineData: Array<{x: number, y: number}> }} Object containing the slope `m`, intercept `b`, and two points for the regression line (`lineData`).
 */
export function calculateLinearRegression(points) {
    if (!points || points.length === 0) {
        return { m: 0, b: 0, lineData: [] };
    }

    const n = points.length;
    const sumX = points.reduce((s, p) => s + p.x, 0);
    const sumY = points.reduce((s, p) => s + p.y, 0);
    const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
    const sumXX = points.reduce((s, p) => s + p.x * p.x, 0);

    const denominator = n * sumXX - sumX * sumX;

    const m = denominator === 0 ? 0 : (n * sumXY - sumX * sumY) / denominator;
    const b = n === 0 ? 0 : (sumY - m * sumX) / n;

    const minX = Math.min(...points.map(p => p.x));
    const maxX = Math.max(...points.map(p => p.x));

    const lineData = [
        { x: minX, y: m * minX + b },
        { x: maxX, y: m * maxX + b }
    ];

    return { m, b, lineData };
}
