import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMapComponent } from './dialog-map.component';

describe('DialogMapComponent', () => {
  let component: DialogMapComponent;
  let fixture: ComponentFixture<DialogMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
