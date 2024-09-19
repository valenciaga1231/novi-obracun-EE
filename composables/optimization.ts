import type { MonthsData, MonthData } from "~/types";

/**
 * Optimizes the connected power settings to minimize total expenses using the Golden Section Search algorithm.
 */
export const optimizePowerSettings = () => {
    const MIN_POWER = 0.1; // Minimum allowed power (kW)
    const MAX_POWER = 10; // Maximum allowed power (kW)
    const TOLERANCE = 0.001; // Precision threshold for optimization
    const GOLDEN_RATIO = (Math.sqrt(5) - 1) / 2; // Golden ratio constant for search

    const prikljucna_moc = usePrikljucnaMoc().value; // Reactive array of power settings
    const monthsData = useMonthsArray(); // Reactive object containing monthly data
    const tempPrikljucnaMoc: number[] = [...prikljucna_moc]; // Copy of the connected power settings

    /**
     * Optimizes the connected power for a specific index using the Golden Section Search method.
     * Ensures that the optimized power does not decrease below the previous block's power.
     *
     * @param index - The index of the connected power to optimize
     */
    const optimizePowerForIndex = (index: number) => {
        let a = MIN_POWER; // Lower bound of the search interval
        let b = MAX_POWER; // Upper bound of the search interval

        // Calculate initial internal points based on the Golden Ratio
        let c = b - GOLDEN_RATIO * (b - a);
        let d = a + GOLDEN_RATIO * (b - a);

        // Evaluate total expenses at the initial points
        let fc = evaluateTotalExpenses(c, monthsData, prikljucna_moc, index);
        let fd = evaluateTotalExpenses(d, monthsData, prikljucna_moc, index);

        // Perform the Golden Section Search until the interval size is within the specified tolerance
        while (Math.abs(b - a) > TOLERANCE) {
            if (fc < fd) {
                // If expenses at point c are lower, search within [a, d]
                b = d;
                d = c;
                fd = fc;
                c = b - GOLDEN_RATIO * (b - a);
                fc = evaluateTotalExpenses(c, monthsData, prikljucna_moc, index);
            } else {
                // If expenses at point d are lower or equal, search within [c, b]
                a = c;
                c = d;
                fc = fd;
                d = a + GOLDEN_RATIO * (b - a);
                fd = evaluateTotalExpenses(d, monthsData, prikljucna_moc, index);
            }
        }

        // Calculate the optimal power as the midpoint of the final interval
        const minPower = (b + a) / 2;

        // Determine the previous power to enforce non-decreasing power settings
        const previousPower = index > 0 ? prikljucna_moc[index - 1] : minPower;

        // Ensure the optimized power does not decrease below the previous block's power
        prikljucna_moc[index] = minPower < previousPower ? previousPower : Math.round(minPower * 10) / 10;

        console.log(`Optimized Power for index ${index}: ${prikljucna_moc[index]} kW`);
    };

    // Iterate over each connected power setting and optimize, excluding the last index where tariff is 0
    prikljucna_moc.forEach((_, index) => {
        if (index !== prikljucna_moc.length - 1) {
            optimizePowerForIndex(index);
        }
    });
    const optimizedPrikljucnaMoc = [...prikljucna_moc];

    // After optimizing all power settings, update the monthly data with the new expenses
    updateMonthlyExpenses(monthsData);

    console.log(`All power settings optimized: ${prikljucna_moc}`);
    console.log(`All power settings before optimization: ${tempPrikljucnaMoc}`);

    // Update the reactive state with the optimized power settings
    for (let i = 0; i < prikljucna_moc.length; i++) {
        prikljucna_moc[i] = tempPrikljucnaMoc[i];
    }
    // Update the monthly data back with the previous expenses
    updateMonthlyExpenses(monthsData);

    return optimizedPrikljucnaMoc;
};

/**
 * Evaluates the total expenses for a given power setting at a specific index.
 *
 * @param power - The power value to evaluate (kW)
 * @param monthsData - The reactive data for each month
 * @param prikljucna_moc - The array of connected power settings
 * @param optimizingIndex - The index of the power setting being optimized
 * @returns The total expenses calculated with the given power setting
 */
function evaluateTotalExpenses(power: number, monthsData: Ref<MonthsData>, prikljucna_moc: number[], optimizingIndex: number): number {
    // Update only the specific index being optimized
    prikljucna_moc[optimizingIndex] = power;

    let totalExpenses = 0;

    // Compute per-month summaries
    Object.values(monthsData.value).forEach((monthData) => {
        totalExpenses += getMonthExpenses(monthData);
    });

    return totalExpenses;
}

/**
 * Calculates the expenses for all months based on the current connected power settings.
 *
 * @param monthsData - The reactive data for all months
 * @param prikljucna_moc - The array of connected power settings
 */
export const updateMonthlyExpenses = (monthsData: Ref<MonthsData>) => {
    Object.values(monthsData.value).forEach((monthData: MonthData) => {
        getMonthExpenses(monthData);
    });
};

/**
 * Calculates the expenses for a given month based on the provided connected power settings.
 *
 * @param monthData - The data for the specific month
 * @param prikljucna_moc - The array of connected power settings
 * @returns The total expenses for the month
 */
export const getMonthExpenses = (monthData: MonthData) => {
    const monthInt = monthData.month;

    // Determine tariffs for blocks
    dolociTarifeZaBlok(monthInt);

    // Calculate network fee and excess power
    izracunajOmrezninoMoci(monthInt);
    izracunajPreseznoMoc(monthInt);

    // Calculate monthly expenses
    const monthExpenses = sumMonthCosts(monthInt);

    return monthExpenses;
};
