/**
 * Convert a timestamp into a short date string "M/D".
 * 
 * @param {string|number|Date} timestamp - The timestamp to format.
 * @returns {string} Short date string in "month/day" format.
 */
export function toShortTime(timestamp) {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()}`;

}


/**
 * Get the current year and month.
 * 
 * @returns {{ year: number, month: number }} Object containing current year and 0-based month.
 */
export function getCurrentYearMonth() {
    const now = new Date();
    return {
        year: now.getFullYear(),
        month: now.getMonth()
    };
}

/**
 * Convert a Date object to a YYYY-MM-DD string.
 * 
 * @param {Date} date - The date to convert.
 * @returns {string} Date string in "YYYY-MM-DD" format.
 */
export function toYYYYMMDD(date) {
    return date.toISOString().split("T")[0];
}

/**
 * Convert a decimal number of hours to "H:MM" format.
 * 
 * @param {number} hours - Number of hours, may include fraction.
 * @returns {string} Formatted string "H:MM".
 */
export function hoursToHourMinutes(hours) {
    const totalMinutes = hours * 60;
    const totalHours = Math.floor(totalMinutes/60);
    const minutes = totalMinutes%60; 
    return `${totalHours}:${minutes.toFixed(0)}`;
}