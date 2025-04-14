import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill.js';
import Text from 'ol/style/Text.js';
import {Vector as VectorSource} from 'ol/source';
import VectorLayer from 'ol/layer/Vector';
import Heatmap from 'ol/layer/Heatmap';
import GeoJSON from 'ol/format/GeoJSON';
import { firstValueFrom } from 'rxjs';
import Style from 'ol/style/Style.js';
import Icon from 'ol/style/Icon';
import { InfoLayer } from '../interfaces/info-layer';
import Map from 'ol/Map';
import { SetLegendService } from './set-legend.service';
import { SafeAssetService } from './safe-asset.service';

@Injectable({
  providedIn: 'root'
})
export class SetLayerService {

  private jsonUrl = 'assets/layer/style.json';
  private map!: Map;
  private jsonString!: string;

  constructor(private http: HttpClient, private LegendService: SetLegendService, private AssetService: SafeAssetService) { }

  public async setLayerJSON(): Promise<void>{
    const observable = this.AssetService.loadJSON<string>(this.jsonUrl);
    const data = await firstValueFrom(observable);
    if (data){
      this.jsonString = data;
      this.LegendService.setLayerJSON(data);
    }
  }

  public setMap(InMap: Map){
    this.map = InMap;
  }

  public changeLayers(index: string){

    let olMap = this.map;
    let newLayers = this.parseJSONLayer(this.jsonString, index);
    let actualLayers = this.map.getAllLayers();
    actualLayers.forEach(function(Layer){
      if(!Layer.getClassName().includes('ol-layer')){
        olMap.removeLayer(Layer);
      };
    })
    newLayers.forEach(function(Layer){
      olMap.addLayer(Layer);
    })

  }

  public getLayerNames(): InfoLayer[]{

    let NomIdLayerListe = this.parseJSONLayerListe(this.jsonString);
    
    return NomIdLayerListe;
  }

  public readForStyle(info: number): VectorLayer[]{

    let Index = (info - 1).toString();

    let LayersListe = this.parseJSONLayer(this.jsonString, Index);
    return LayersListe;

  }

  private CreateAndStyleLines(JSONLayer: any): VectorLayer{
    const vectorSource = new VectorSource({
      format: new GeoJSON,
      url: JSONLayer.url,
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      className: JSONLayer.nom,
    });

    let Keys = Object.keys(JSONLayer);
    if (Keys.includes("field")){

      let KeyStroke = Object.keys(JSONLayer.stroke);

      if (KeyStroke[0].includes("-")){
        let newKeyStroke = [];
        for (let key of KeyStroke){
          newKeyStroke.push(parseInt(key.split("-")[1]));
        }
        let setStyleFunction = function(feature: { get: (arg0: string) => any; }){

          let intField = feature.get(JSONLayer.field);
          
          let indexValue = 0;
          let ValueBreak = false;
          for (let key of newKeyStroke){
            if (!ValueBreak){
              if (intField <= key){
                indexValue = newKeyStroke.indexOf(key);
                ValueBreak = true;
              }
            }
          }

          if (!ValueBreak){
            indexValue = newKeyStroke.length - 1;
          }
          let style = new Style({
            stroke: new Stroke(JSONLayer.stroke[KeyStroke[indexValue]])
          })
          return style;
        }
        vectorLayer.setStyle(setStyleFunction);
      } else {
        let setStyleFunction = function(feature: { get: (arg0: string) => any; }){
          let Speed = feature.get(JSONLayer.field).toString();
          let style = new Style({
            stroke: new Stroke(JSONLayer.stroke[Speed])
          })
          return style;
        }
        vectorLayer.setStyle(setStyleFunction);
      }
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
      className: JSONLayer.nom,
    });


    let setStyleFunction;

    let Keys = Object.keys(JSONLayer);
    if (Keys.includes("icon_field")){
      let compteur = 0;
      setStyleFunction = function(feature: { get: (arg0: string) => any; }){
        let style = new Style({
          image: new Icon({
            height: JSONLayer.height,
            src: JSONLayer.icon[feature.get(JSONLayer.icon_field)],
          })
        })
        return style;
      }
      vectorLayer.setStyle(setStyleFunction);
    };

    return vectorLayer;
  }

  private CreateAndStyleHeatMap(JSONLayer: any): Heatmap{

    const vectorSource = new VectorSource({
      format: new GeoJSON,
      url: JSONLayer.url,
    });

    const heatmapLayer = new Heatmap({
      source: vectorSource,
      blur: 10,
      radius: 2,
      className: JSONLayer.nom,
      gradient: ['rgba(0, 0, 0, 0.5)','rgba(87, 16, 110, 0.5)','rgba(188, 55, 84, 0.5)','rgba(249, 142, 9, 0.5)','rgba(252, 255, 164,0.5)']
    });

    return heatmapLayer;

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
    } else if (Keys.includes("field")){

      let KeyStroke = Object.keys(JSONLayer.stroke);

      if (KeyStroke[0].includes("-")){
        let newKeyStroke = [];
        for (let key of KeyStroke){
          newKeyStroke.push(parseInt(key.split("-")[1]));
        }
        setStyleFunction = function(feature: { get: (arg0: string) => any; }){

          let intField = feature.get(JSONLayer.field);
          
          let indexValue = 0;
          let ValueBreak = false;
          for (let key of newKeyStroke){
            if (!ValueBreak){
              if (intField <= key){
                indexValue = newKeyStroke.indexOf(key);
                ValueBreak = true;
              }
            }
          }

          if (!ValueBreak){
            indexValue = newKeyStroke.length - 1;
          }

          let style = new Style({
            stroke: new Stroke(JSONLayer.stroke[KeyStroke[indexValue]]),
            fill: new Fill(JSONLayer.fill[KeyStroke[indexValue]]),
          });
          return style;
        }

      } else {

        setStyleFunction = function(feature: { get: (arg0: string) => any; }){

          let Field = feature.get(JSONLayer.field).toString();
          let style = new Style({
            stroke: new Stroke(JSONLayer.stroke[Field]),
            fill: new Fill(JSONLayer.fill[Field]),
          });
          return style;
      }
    }

    } else {
      setStyleFunction = function(feature: { get: (arg0: string) => any; }){
        let style = new Style({
          stroke: new Stroke(JSONLayer.stroke),
          fill: new Fill(JSONLayer.fill)
        });
        return style;
      }
    }

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      className: JSONLayer.nom,
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
        InfoL.NomLayer = nJSON[elem].nom;
        newInformation.push(InfoL);
      }
    }
    return newInformation
  }

  private parseJSONLayer(Data:string, index: string): any[]{
    let LayerList: any[] = [];
    if (Data){
      const nJSON = JSON.parse(JSON.stringify(Data));
      if (Object.keys(nJSON).includes(index)){
        let JSONIndex = nJSON[index];
        let JSONKeys = Object.keys(JSONIndex);
        for (let elem of JSONKeys){
          if (elem != "nom"){
            let JSONData = JSONIndex[Number(elem)];
            if (JSONData.type =="Polygon"){
              let JSONVLayer = this.CreateAndStylePolygon(JSONData);
              LayerList.push(JSONVLayer);
            } else if (JSONData.type == "Points"){
              let JSONVLayer = this.CreateAndStylePoints(JSONData);
              LayerList.push(JSONVLayer);
            } else if (JSONData.type == "Line"){
              let JSONVLayer = this.CreateAndStyleLines(JSONData);
              LayerList.push(JSONVLayer);
            } else if (JSONData.type == "HeatMap"){
              let JSONVLayer = this.CreateAndStyleHeatMap(JSONData);
              LayerList.push(JSONVLayer);
            }
          }
        }
      }
    }

    return LayerList;
  }

}