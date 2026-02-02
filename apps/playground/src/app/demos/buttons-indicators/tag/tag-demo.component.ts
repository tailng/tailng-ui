import { Component, signal } from "@angular/core";
import { TngTag } from "@tociva/tailng-ui/buttons-indicators";


@Component({
    selector: 'playground-demo-tag',
    standalone:true,
    imports: [TngTag],
    templateUrl:'./tag-demo.component.html',
})

export class TagDemoComponent{
     isDisabled = signal(false);

  toggleDisabled() {
    this.isDisabled.update(v => !v);
  }

}