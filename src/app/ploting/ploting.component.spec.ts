import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotingComponent } from './ploting.component';

describe('PlotingComponent', () => {
  let component: PlotingComponent;
  let fixture: ComponentFixture<PlotingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlotingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlotingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
