export interface User {
  email: string,
  username: string,
  password: string
}

export interface FoodExample{
  Calories: string,
  Fats: string,
  Carbs: string,
  Proteins: string
}


export interface dateToChoose {
  id: number,
  dateS: string,
  date: Date
}

export interface Dish{
  name: string,
  carbs: number,
  fats: number,
  proteins: number,
  calories: number
}

export interface DishList{
  time: string,
  food: Dish[];
}