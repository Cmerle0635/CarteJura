import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog'; // ✅ IMPORT DIRECTEMENT

@Component({
  selector: 'app-dialog-map',
  imports: [MatDialogModule],
  templateUrl: './dialog-image.component.html',
  styleUrl: './dialog-image.component.css',
  standalone: true,
})
export class DialogImageComponent implements OnInit {

  constructor(
    @Inject (MAT_DIALOG_DATA) public data: {source_image: string},
    public dialogRef: MatDialogRef<DialogImageComponent>
   ) {}

     ngOnInit(){
       setTimeout(() => {
        this.source = this.data.source_image;
        let SourceSplit = this.source.split("/");
        let Index = SourceSplit.length - 1;
        let Name = SourceSplit[Index].replace(".png", "");
        let newArray = [];
        for (let elem of Name.split("_")){
          newArray.push(elem.charAt(0).toUpperCase() + elem.slice(1).toLowerCase());
        }
        let newString = newArray.join(" ");
        this.alt = newString;
  
       }, 100)
     }

   public source: string = "";
   public alt: string = "";
}