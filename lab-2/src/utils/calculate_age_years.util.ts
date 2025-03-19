export const calculateAgeYears = (date: Date): number => {
    const currentDate = new Date();
    const createdAtDate = new Date(date);
    const timeDiff = currentDate.getTime() - createdAtDate.getTime();
    const years = timeDiff / (1000 * 3600 * 24 * 365);
    return Number(years.toString()[0]);
};
