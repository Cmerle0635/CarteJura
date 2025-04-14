import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map, Observable } from 'rxjs';
import { RoutesInfoInterface } from '../interfaces/routes';
import { SafeAssetService } from './safe-asset.service';

@Injectable({
  providedIn: 'root'
})
export class GetInfoService {
  data: string[];

  constructor(private http: HttpClient, private AssetService: SafeAssetService) { }

  jsonUrl = 'assets/data/Routes.geojson';
  csvUrl = 'assets/data/StatRouteTableau.csv'
  jsonString: string;
  RouteData: RoutesInfoInterface;


  HeaderRoute: string[];
  DataRoute: string[];

  ReadCSV(): Observable<any[]> {
    return this.AssetService.loadText(this.csvUrl).pipe(
      map(data => {
        if (data) {
          return this.parseCsv(data);
        } else {
          return [];
        }
      })
    )
  }

  private parseCsv(csv: string): any[] {
    const lines = csv.trim().split('\r\n');
    const headers = lines[0].split(';');
    return lines.slice(1).map(line => {
      const values = line.split(';');
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = values[index];
      });
      return obj;
    });
  }


  public returnData(): RoutesInfoInterface{
    return this.RouteData;
  }

  public async getRouteData(): Promise<RoutesInfoInterface>{
      let data = '';
      data = await firstValueFrom(this.http.get<string>(this.jsonUrl))
      .then((value) => {
        return value
      })
      let returnData = this.getFullInformationRoute(data);
      this.RouteData = returnData;
      return returnData;
  }

  public getFullInformationRoute(data: string): RoutesInfoInterface{
    let newInformation: RoutesInfoInterface = {key: [], value: []};
    if (data){
      const nJSON = JSON.parse(JSON.stringify(data));
      let arrayVitesse =  [];
      let FullData = nJSON["features"];
      for (let info of FullData){
        let Prop = info.properties;
        arrayVitesse.push(Prop.vitesse);
      }
      let UniqueVitesse  = [...new Set(arrayVitesse)];
      let StringVitesse = UniqueVitesse.join().split(',');
      let DictValue = Object.fromEntries(StringVitesse.map(key => [key, 0]));
      for (let info of FullData){
        let Prop = info.properties;
        DictValue[Prop.vitesse.toString()] += Prop.longueur;
      }
      const roundedDictValue = Object.fromEntries(
        Object.entries(DictValue).map(([key, value]) => [key, Number(value.toFixed(2))])
      );
      newInformation.key = StringVitesse;
      newInformation.value = Object.values(roundedDictValue);
    }
    return newInformation;
  }


}
