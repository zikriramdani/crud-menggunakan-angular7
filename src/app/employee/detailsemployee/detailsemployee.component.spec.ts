import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsEmployeeComponent } from '../detailsemployee.component';

describe('DetailsEmployeeComponent', () => {
  let component: DetailsEmployeeComponent;
  let fixture: ComponentFixture<DetailsEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
