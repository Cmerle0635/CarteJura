import { Injectable } from '@angular/core';
import { LegendInterface } from '../interfaces/legend';

@Injectable({
  providedIn: 'root'
})
export class SetLegendService {

  private jsonString!: string;

  constructor() {}

  public setLayerJSON(JSON: string){
    this.jsonString = JSON;
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
          bold: false,
          heatmap: false
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
        bold: false,
        heatmap: false
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
          bold: false,
          heatmap: false 
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
          bold: false,
          heatmap: false 
        }

        LegendForPoint.push(newLine);

      }

    }
    return LegendForPoint;
  }

  private CreateLegendHeatMap(compteur: number): LegendInterface[]{
      

      let LegendForHeatMap: LegendInterface[] = [];
      
      compteur += 1;

      let newLegend : LegendInterface = {
        id: compteur,
        text: '',
        hasSVG: false,
        typeSVG: '',
        fillSVG: '',
        strokeSVG: '',
        linedashSVG: '',
        widthSVG: 0,
        imageUrl: '',
        size: '12px',
        bold: false,
        heatmap: true 
      }

      LegendForHeatMap.push(newLegend);
  
      return LegendForHeatMap;
  }

  public parseJSONForLegend(Data: string, index: string): LegendInterface[]{

    let compteur = 1;
    let FinaleLegend: LegendInterface[] = [];

    if (Data){
      const nJSON = JSON.parse(JSON.stringify(Data));
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
              bold: true,
              heatmap: false
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

            } else if (JSONData.type == "HeatMap"){

              let JSONLegend = this.CreateLegendHeatMap(compteur);
              FinaleLegend = FinaleLegend.concat(JSONLegend);
              compteur = FinaleLegend.length + 1;

            }
          }
        }
      }
    }
    return FinaleLegend
  }

  public getLegend(index: string): LegendInterface[]{
    let NomIdLayerListe = this.parseJSONForLegend(this.jsonString, index);

    return NomIdLayerListe;

  };

}
