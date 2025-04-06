import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill.js';
import Text from 'ol/style/Text.js';
import {Vector as VectorSource} from 'ol/source';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { firstValueFrom } from 'rxjs';
import Style from 'ol/style/Style.js';
import Icon from 'ol/style/Icon';
import { InfoLayer } from '../interfaces/info-layer';
import Map from 'ol/Map';
import { LegendInterface } from '../interfaces/legend';

@Injectable({
  providedIn: 'root'
})
export class SetLayerService {

  private jsonUrl = 'assets/layer/style.json';
  private map!: Map;
  private jsonString!: string;

  constructor(private http: HttpClient) { }

  public async setLayerJSON(): Promise<void>{
    let data = '';
    data = await firstValueFrom(this.http.get<string>(this.jsonUrl))
    .then((value) => {
      return value
    })
    this.jsonString = data;
  }

  public setMap(InMap: Map){
    this.map = InMap;
  }

  public getLegend(index: string): LegendInterface[]{
    let NomIdLayerListe = this.parseJSONForLegend(this.jsonString, index);

    return NomIdLayerListe;

  };

  public changeLayers(index: string){

    let olMap = this.map;
    let newLayers = this.parseJSONLayer(this.jsonString, index);
    let actualLayers = this.map.getAllLayers();
    actualLayers.forEach(function(Layer){
      if(!Layer.getClassName().includes('ol-layer')){
        console.log(Layer);
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
              if (key < intField){
                indexValue = newKeyStroke.indexOf(key) - 1;
                ValueBreak = true;
              }
            }
          }

          if (!ValueBreak){
            indexValue = newKeyStroke.length - 1;
          }
          let style = new Style({
            stroke: new Stroke(JSONLayer.stroke[indexValue])
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
              if (key < intField){
                indexValue = newKeyStroke.indexOf(key) - 1;
                ValueBreak = true;
              }
            }
          }

          if (!ValueBreak){
            indexValue = newKeyStroke.length - 1;
          }

          let style = new Style({
            stroke: new Stroke(JSONLayer.stroke[indexValue]),
            fill: new Fill(JSONLayer.fill[indexValue]),
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

  private CreateLegendPolygon(JSONData: any, compteur: number): LegendInterface[]{

    let LegendForPolygon: LegendInterface[] = [];

    compteur += 1;

    let Keys = Object.keys(JSONData);
    let TextData = '';
    let lineDashData = '';

    if (Keys.includes("field")){

      for (let FieldValue of Object.keys(JSONData.stroke)){

        compteur += 1;

        let newLine : LegendInterface = {
          id: compteur,
          text: `${JSONData.nom} ${FieldValue}`,
          hasSVG: true,
          typeSVG: JSONData.type,
          fillSVG: JSONData.fill[FieldValue].color,
          strokeSVG: JSONData.stroke[FieldValue].color,
          linedashSVG: '',
          widthSVG: JSONData.stroke[FieldValue].width,
          imageUrl: '',
          size: '12px',
          bold: false    
        }

        LegendForPolygon.push(newLine);

      }

    } else {
      if (Keys.includes("text")){
        TextData = JSONData.text.text.join(" - ");
      }
  
      if (Object.keys(JSONData.stroke).includes("lineDash")){
        lineDashData = JSONData.stroke.lineDash.join(',');
      }
  
      let newLine : LegendInterface = {
        id: compteur,
        text: TextData,
        hasSVG: true,
        typeSVG: JSONData.type,
        fillSVG: '',
        strokeSVG: JSONData.stroke.color,
        linedashSVG: lineDashData,
        widthSVG: JSONData.stroke.width,
        imageUrl: '',
        size: '12px',
        bold: false
      }
  
      LegendForPolygon.push(newLine);
    }

    return LegendForPolygon;

    }

  private CreateLegendLines(JSONData: any, compteur: number): LegendInterface[]{

    let LegendForLines: LegendInterface[] = [];

    let Keys = Object.keys(JSONData);

    if (Keys.includes("field")){

      for (let FieldValue of Object.keys(JSONData.stroke)){

        compteur += 1;

        let newLine : LegendInterface = {
          id: compteur,
          text: FieldValue,
          hasSVG: true,
          typeSVG: JSONData.type,
          fillSVG: '',
          strokeSVG: JSONData.stroke[FieldValue].color,
          linedashSVG: '',
          widthSVG: JSONData.stroke[FieldValue].width,
          imageUrl: '',
          size: '12px',
          bold: false    
        }

        LegendForLines.push(newLine);

      }

    }
    return LegendForLines;
  }

  private CreateLegendPoints(JSONData: any, compteur: number): LegendInterface[]{

    let LegendForPoint: LegendInterface[] = [];

    let Keys = Object.keys(JSONData);

    let compteurItem = 0

    if (Keys.includes("icon_field")){

      for (let IconValue of JSONData.icon){

        compteur += 1;

        compteurItem += 1;

        let newLine : LegendInterface = {
          id: compteur,
          text: `${JSONData.nom} ${compteurItem}`,
          hasSVG: false,
          typeSVG: '',
          fillSVG: '',
          strokeSVG: '',
          linedashSVG: '',
          widthSVG: 0,
          imageUrl: IconValue,
          size: '12px',
          bold: false    
        }

        LegendForPoint.push(newLine);

      }

    }
    return LegendForPoint;
  }

  public parseJSONForLegend(Data: string, index: string): LegendInterface[]{

    let compteur = 1;
    let FinaleLegend: LegendInterface[] = [];

    if (Data){
      const nJSON = JSON.parse(JSON.stringify(Data));
      console.log("Je LOG !!!")
      if (Object.keys(nJSON).includes(index)){

        let JSONIndex = nJSON[index];
        let JSONKeys = Object.keys(JSONIndex);

        for (let elem of JSONKeys){
          if (elem != "nom"){

            let JSONData = JSONIndex[Number(elem)];

            let FirstLine : LegendInterface = {
              id: compteur,
              text: JSONData.nom,
              hasSVG: false,
              typeSVG: '',
              fillSVG: '',
              strokeSVG: '',
              linedashSVG: '',
              widthSVG: 0,
              imageUrl: '',
              size: '14px',
              bold: true
            }

            FinaleLegend.push(FirstLine);

            if (JSONData.type =="Polygon"){

              let JSONLegend = this.CreateLegendPolygon(JSONData, compteur);
              FinaleLegend = FinaleLegend.concat(JSONLegend);
              compteur = FinaleLegend.length + 1;

            } else if (JSONData.type == "Points"){

              let JSONLegend = this.CreateLegendPoints(JSONData, compteur);
              FinaleLegend = FinaleLegend.concat(JSONLegend);
              compteur = FinaleLegend.length + 1;

            } else if (JSONData.type == "Line"){

              let JSONLegend = this.CreateLegendLines(JSONData, compteur);
              FinaleLegend = FinaleLegend.concat(JSONLegend);
              compteur = FinaleLegend.length + 1;

            }
          }
        }
      }
    }
    console.log(FinaleLegend);
    return FinaleLegend
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

  private parseJSONLayer(Data:string, index: string): VectorLayer[]{
    let LayerList: VectorLayer[] = [];
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
            }
          }
        }
      }
    }

    return LayerList;
  }

}