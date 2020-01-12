import { AppLoadService } from './app-loader.service';
import { Expense } from './../models/Expense';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarServiceService {

  userId: string;
  db: any;

  constructor(appLoadService: AppLoadService) {
    this.userId = appLoadService.userId;
    this.db = appLoadService.database;
  }

  async getCosts() {
    if (this.userId) {
      const carsRef = await this.db.ref(`users/${this.userId}/cars`).once('value');
      const cars = carsRef.val();
      if (cars) {
        const carId = Object.keys(cars)[0];

        const ref = this.db.ref(`users/${this.userId}/expenses`);
        const expensesResponse = await ref.orderByChild('car').equalTo(carId).once('value');

        const expenses = expensesResponse.val() || {};

        return [{
          name: cars[carId].name,
          expenses: (Object.keys(expenses)).map(expenseKey => {
            const expense = expenses[expenseKey];
            return new Expense(expenseKey, expense.part, expense.distance, expense.price);
          })
        }];
      }
    }
  }
}
