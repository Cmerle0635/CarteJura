import { Component } from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent {
  chartOptions: any;

  constructor() {
    this.chartOptions = {
      chart: {
        type: "pie"
      },
      series: [44, 55, 13, 43, 22],
      labels: ["A", "B", "C", "D", "E"]
    };
  }
}
