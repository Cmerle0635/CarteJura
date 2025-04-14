import { Component, Input } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { GetInfoService } from '../../services/get-info.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  imports: [NgApexchartsModule],
  standalone: true
})
export class ChartComponent {
  chartOptions: any;

  constructor(private GIService: GetInfoService) {
    this.chartOptions = {
      chart: {
        type: "pie"
      },
      title: {text:["Nombre de km de routes selon", "leur Vitesse Max"],
        align: "center",
        style: {
          fontSize:  '14px',
          fontWeight:  '',
          fontFamily:  undefined,
          color:  '#263238'
        },
      },
      series: this.GIService.returnData().value,
      labels: this.GIService.returnData().key,
      legend: {
        formatter(value: any, opts: any): any {
          return [value, "km/h - ", (opts.w.globals.series[opts.seriesIndex]/100).toFixed(2), " km"];
        }
      }
    };
  }

  ngOnChanges() {
  }

}
