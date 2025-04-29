import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements AfterViewInit {

  ngAfterViewInit(): void {

    setTimeout(() => {
      if (/Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent)){
        let ElemID = document.getElementById("image");
        if (ElemID){
          ElemID.setAttribute("class", "mobile");
        }
      }
    }, 100); 
  }
}
