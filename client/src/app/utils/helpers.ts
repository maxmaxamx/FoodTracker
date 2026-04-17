export function subDays(count: number): Date {
    let today = new Date;
    today.setDate(today.getDate() - count);
    return today
}

