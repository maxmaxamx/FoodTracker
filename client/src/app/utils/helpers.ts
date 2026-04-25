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

        str.split(/ - | \| /).slice(1).forEach((item: any) => {
            const [key, value] = item.split(": ");
            obj[key] = value;
        });

        filtered.push({
            id: array[i].food_id,
            name: array[i].food_name,
            protein: obj.Protein,
            fat: obj.Fat,
            carbs: obj.Carbs,
            calories: obj.Calories,
        })
    }

    return filtered;
}