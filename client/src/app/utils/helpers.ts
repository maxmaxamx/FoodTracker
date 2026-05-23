import { filter } from "rxjs";
import { FoodExample } from "./identifiers";

export function subDays(count: number): Date {
    let today = new Date;
    today.setDate(today.getDate() - count);
    return today
}

export function splitArray(array: any): any[] {
    const filtered: any[] = [];

    for (let i = 0; i < array.length; i++) {
        const str = array[i].food_description;
        let obj: any = {};

        str.split(/ - | \| /).slice(1).forEach((item: string) => {
            const [key, value] = item.split(": ");
            obj[key] = parseFloat(value || "0") || 0;
        });

        filtered.push({
            id: array[i].food_id,
            name: array[i].food_name,
            protein: obj.Protein || 0,
            fat: obj.Fat || 0,
            carbs: obj.Carbs || 0,
            calories: obj.Calories || 0,
        });
    }

    return filtered;
}