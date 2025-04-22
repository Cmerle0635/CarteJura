import {Component, Input, OnInit} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-table',
  imports: [MatButtonModule, MatTableModule, MatExpansionModule, MatIconModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit{

  @Input()data: any[];

  displayedColumns: string[];

  expandedElement: any | null;
  columnsToDisplayWithExpand: string[];

  isExpanded(element: any) {
    return this.expandedElement === element;
  }

  /** Toggles the expanded state of an element. */
  toggle(element: any) {
    this.expandedElement = this.isExpanded(element) ? null : element;
  }


  ngOnInit(): void {
    let Fields = Object.keys(this.data[0]);
    let newFields: string[] = ["type"];
    if (Fields.includes("type")){
      Fields.forEach(field =>{
        if (!field.includes("type") && !field.includes("description") ){
          newFields.push(field);
        }
      });
    }
    this.displayedColumns = newFields;
    this.columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  }

}
