import { Directive } from '@angular/core';

@Directive({ selector: '[tngSidenavHeader]', standalone: true })
export class TngSidenavHeaderSlot {}

@Directive({ selector: '[tngSidenavFooter]', standalone: true })
export class TngSidenavFooterSlot {}
