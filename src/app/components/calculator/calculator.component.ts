import { CarServiceService } from './../../services/car-service.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

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

  constructor(private formBuilder: FormBuilder, private decimalPipe: DecimalPipe, private carService: CarServiceService,
              private ref: ChangeDetectorRef) {
    const lastCalculation =
      window.localStorage.getItem('lastCalculation') ? JSON.parse(window.localStorage.getItem('lastCalculation')) : {};

    this.calculatorForm = this.formBuilder.group({
      distance: [lastCalculation.distance || ''],
      consumption: [lastCalculation.consumption || ''],
      price: [lastCalculation.price || ''],
      people: [lastCalculation.people || ''],
      additionalCosts: [lastCalculation.additionalCosts || 0]
    });

    this.calculatorForm.valueChanges.subscribe(val => {
      if (val.distance > 0 && val.consumption > 0 && val.price > 0) {
        const result = ((val.distance * val.consumption) / 100) * val.price + (val.additionalCosts || 0);
        this.result.setValue(result.toFixed(2));
        this.perPerson.setValue((result / (val.people || 1)).toFixed(2));

        window.localStorage.setItem('lastCalculation', JSON.stringify(val));
      } else {
        this.result.setValue('');
        this.perPerson.setValue('');
      }
    });

    if (window.localStorage.getItem('lastCalculation')) {
      // trigger change listener
      this.calculatorForm.get('distance').setValue(this.calculatorForm.get('distance').value);
    }

    this.getExpenses();

  }

  ngOnInit() {
  }

  async getExpenses() {
    const cars = await this.carService.getExpenses();
    console.log(cars);
    this.cars = cars;
    this.ref.detectChanges();
  }

}
