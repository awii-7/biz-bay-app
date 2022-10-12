import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InfluencerListPage } from './influencer-list.page';

describe('InfluencerListPage', () => {
  let component: InfluencerListPage;
  let fixture: ComponentFixture<InfluencerListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfluencerListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InfluencerListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
