import { Component, signal } from "@angular/core";
import { TailngTagComponent } from "@tociva/tailng-ui";


@Component({
    selector: 'playground-demo-tag',
    standalone:true,
    imports: [TailngTagComponent],
    templateUrl:'./tag-demo.component.html',
})

export class TagDemoComponent{
     isDisabled = signal(false);

  toggleDisabled() {
    this.isDisabled.update(v => !v);
  }

}