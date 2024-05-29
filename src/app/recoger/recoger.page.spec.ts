import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecogerPage } from './recoger.page';

describe('RecogerPage', () => {
  let component: RecogerPage;
  let fixture: ComponentFixture<RecogerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecogerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
