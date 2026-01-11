import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfitLossPage } from './profit-loss.page';

describe('ProfitLossPage', () => {
  let component: ProfitLossPage;
  let fixture: ComponentFixture<ProfitLossPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfitLossPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
