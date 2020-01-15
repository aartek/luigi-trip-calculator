import { Expense } from './../../models/Expense';
import { CarServiceService } from './../../services/car-service.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {
  calculatorForm: FormGroup = new FormGroup({});
  result: FormControl = new FormControl('');
  perPerson: FormControl = new FormControl('');
  cars: any[] = [];
  lastCarName: string;

  constructor(
    private formBuilder: FormBuilder,
    private carService: CarServiceService,
    private ref: ChangeDetectorRef
  ) {
    const lastCalculation = window.localStorage.getItem('lastCalculation')
      ? JSON.parse(window.localStorage.getItem('lastCalculation'))
      : {};
    this.lastCarName = lastCalculation.car || '';

    this.calculatorForm = this.formBuilder.group({
      distance: [lastCalculation.distance || ''],
      consumption: [lastCalculation.consumption || ''],
      price: [lastCalculation.price || ''],
      people: [lastCalculation.people || ''],
      additionalCosts: [lastCalculation.additionalCosts || 0],
      car: [{ value: '', disabled: true }]
    });

    this.calculatorForm.valueChanges.subscribe(val => {
      if (val.distance > 0 && val.consumption > 0 && val.price > 0) {
        const carCosts = this.calculateCarCosts(val.car, val.distance);

        const result =
          ((val.distance * val.consumption) / 100) * val.price +
          (val.additionalCosts || 0) +
          carCosts;

        this.result.setValue(result.toFixed(2));
        this.perPerson.setValue((result / (val.people || 1)).toFixed(2));

        window.localStorage.setItem('lastCalculation', JSON.stringify(val));
      } else {
        this.result.setValue('');
        this.perPerson.setValue('');
      }
    });

    if (window.localStorage.getItem('lastCalculation')) {
      // hack to trigger change listener
      this.calculatorForm
        .get('distance')
        .setValue(this.calculatorForm.get('distance').value);
    }
  }

  async ngOnInit() {
    await this.getCosts();
    if (this.cars.length) {
      let car;
      if (this.lastCarName) {
        car = this.cars.find(c => c.name === this.lastCarName);
      }
      this.calculatorForm.get('car').setValue(car ? car.name : '');
      this.calculatorForm.get('car').enable();
    }
  }

  async getCosts() {
    const cars = await this.carService.getCosts();
    this.cars = cars || [];
    this.ref.detectChanges();
  }

  calculateCarCosts(carName, distance): number {
    let carCosts = 0;
    if (carName) {
      const car = this.cars.find(c => c.name === carName);
      car.expenses.forEach((expense: Expense) => {
        carCosts += (distance * expense.price) / expense.distance;
      });
    }
    return carCosts;
  }
}
