import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { cp } from 'fs';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill.js';
import Text from 'ol/style/Text.js';
import {Vector, Vector as VectorSource} from 'ol/source';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { firstValueFrom } from 'rxjs';
import Style from 'ol/style/Style.js';
import Icon from 'ol/style/Icon';
import { InfoLayer } from '../interfaces/info-layer';

@Injectable({
  providedIn: 'root'
})
export class SetLayerService {

  private jsonUrl = 'assets/layer/style.json';

  constructor(private http: HttpClient) { }

  public async getLayerNames(): Promise<InfoLayer[]>{
    let data = '';
    data = await firstValueFrom(this.http.get<string>(this.jsonUrl))
    .then((value) => {
      return value
    })
    let NomIdLayerListe = this.parseJSONLayerListe(data);
    
    return NomIdLayerListe;
  }

  public async readForStyle(info: number): Promise<VectorLayer[]>{
    let data = '';
    let Index = (info - 1).toString();

    data = await firstValueFrom(this.http.get<string>(this.jsonUrl))
    .then((value) => {
      return value
    })

    let LayersListe = this.parseJSONLayer(data, Index);
    
    return LayersListe;
  }

  private CreateAndStyleLines(JSONLayer: any): VectorLayer{
    const vectorSource = new VectorSource({
      format: new GeoJSON,
      url: JSONLayer.url,
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      className: '0',
    });

    let Keys = Object.keys(JSONLayer);
    if (Keys.includes("field")){
      let setStyleFunction = function(feature: { get: (arg0: string) => any; }){
        let Speed = feature.get(JSONLayer.field).toString();
        console.log(Speed);
        let style = new Style({
          stroke: new Stroke(JSONLayer.stroke[Speed])
        })
        return style;
      }
      vectorLayer.setStyle(setStyleFunction);
    }

    return vectorLayer
  }

  private CreateAndStylePoints(JSONLayer: any): VectorLayer{

    const vectorSource = new VectorSource({
      format: new GeoJSON,
      url: JSONLayer.url,
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      className: '0',
    });


    let setStyleFunction;

    let Keys = Object.keys(JSONLayer);
    if (Keys.includes("icon_field")){
      setStyleFunction = function(feature: { get: (arg0: string) => any; }){
        let style = new Style({
          image: new Icon({
            height: JSONLayer.height,
            src: JSONLayer.icon.replace("0", feature.get(JSONLayer.icon_field)),
          })
        })
        return style;
      }
      vectorLayer.setStyle(setStyleFunction);
    };

    return vectorLayer;
  }

  private CreateAndStylePolygon(JSONLayer: any): VectorLayer{


    const vectorSource = new VectorSource({
      format: new GeoJSON,
      url: JSONLayer.url,
    });

    let setStyleFunction;
    
    let Keys = Object.keys(JSONLayer);
    if (Keys.includes("text")){

        setStyleFunction = function(feature: { get: (arg0: string) => any; }){

          console.log(JSONLayer.text.font);
        
          let TextList: String[] = [];
          
          const Fields = JSONLayer.text.text;

          for (let ID = 0; ID < JSONLayer.text.text.length ; ID++){
            let Texte = feature.get(Fields[ID]);
            if (ID != 0){
              Texte = `(${Texte})`
            }
            TextList.push(Texte)
          }

          let TextValue = TextList.join("\n");

          let style = new Style({
            stroke: new Stroke(JSONLayer.stroke),
            fill: new Fill(JSONLayer.fill),
            text: new Text({
              font: JSONLayer.text.font,
              text: TextValue,
              fill: new Fill(JSONLayer.text.color),
              stroke: new Stroke(JSONLayer.stroke)
            })
          });
          return style;
      }
    } else {
      setStyleFunction = function(feature: { get: (arg0: string) => any; }){
        console.log(feature);
        let style = new Style({
          stroke: new Stroke(JSONLayer.stroke),
          fill: new Fill(JSONLayer.fill)
        });
        return style;
      }
    }

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      className: '0',
      style: setStyleFunction
    });

    return vectorLayer
  }

  private parseJSONLayerListe(Data: string): InfoLayer[]{
    let newInformation: InfoLayer[] = [];
    if (Data){
      const nJSON = JSON.parse(JSON.stringify(Data));
      let JSONKeys = Object.keys(nJSON);
      for (let elem of JSONKeys){
        let InfoL: InfoLayer = {IDLayer: "", NomLayer: ""};
        InfoL.IDLayer = elem;
        InfoL.NomLayer = nJSON[elem];
        console.log(InfoL);
        newInformation.push(InfoL);
      }
    }
    return newInformation
  }

  private parseJSONLayer(Data:string, index: string): VectorLayer[]{
    let Response = ["Oui"];
    let LayerList: VectorLayer[] = [];
    if (Data){
      const nJSON = JSON.parse(JSON.stringify(Data));
      if (Object.keys(nJSON).includes(index)){
        let JSONIndex = nJSON[index];
        let JSONKeys = Object.keys(JSONIndex);
        for (let elem of JSONKeys){
          if (elem != "nom"){
            let JSONData = JSONIndex[Number(elem)];
            console.log(JSONData.type);
            if (JSONData.type =="Polygon"){
              console.log("POLYGONE")
              let JSONVLayer = this.CreateAndStylePolygon(JSONData);
              LayerList.push(JSONVLayer);
            } else if (JSONData.type == "Points"){
              console.log("POINT")
              let JSONVLayer = this.CreateAndStylePoints(JSONData);
              LayerList.push(JSONVLayer);
            } else if (JSONData.type == "Line"){
              console.log("LIGNES !!!")
              let JSONVLayer = this.CreateAndStyleLines(JSONData);
              LayerList.push(JSONVLayer);
            }
          }
        }
      }
    }

    return LayerList;
  }

}