export interface User {
  email: string,
  username: string,
  password: string
}

export interface FoodExample {
  Id: number,
  Name: string,
  Calories: number,
  Fats: number,
  Carbs: number,
  Proteins: number,
  Intake?: Intakes
}


export interface dateToChoose {
  id: number,
  dateS: string,
  date: Date
}

export type messageTemplate = | { isAI: true; data: FoodExample; time: string } | { isAI: false; text: string; time: string };

export type Intakes = "Breakfast" | "Lunch" | "Dinner";