/**
 * https://en.wikipedia.org/wiki/Trading_day
 * 
 * There are approximately 21 trading days per month or 252 per year.
 * 
 * These numbers are the horizon past the last date in the series
 */

export const HORIZON_TYPES = [
    {
        value: "0",
        text: "Last Date"
    }, /* Special Case to match slider and end of timeseries */
    { value: "126", text: "6 months" },
    { value: "252", text: "1 year" },
    { value: "504", text: "2 years" },
    { value: "756", text: "3 years" },
    { value: "1260", text: "5 years" },
];