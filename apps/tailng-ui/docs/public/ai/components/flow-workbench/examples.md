---
id: "components/flow-workbench/examples"
title: "Flow Workbench examples"
description: "Flow Workbench examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["flow-workbench","flow","examples"]
package: "@tailng-ui/flow"
importPath: "@tailng-ui/flow/execution"
sourcePaths: ["libs/tailng-ui/flow/src/execution/components/workbench/tng-flow-workbench.component.ts","libs/tailng-ui/flow/src/execution/components/inspector/tng-flow-execution-inspector.component.ts","libs/tailng-ui/flow/src/execution/components/payload/tng-flow-execution-payload.component.ts","libs/tailng-ui/flow/src/execution/templates/tng-flow-execution-templates.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-workbench/routes.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-workbench/sections/examples/flow-workbench-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/flow/flow-workbench/sections/examples/flow-workbench-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/flow/flow-workbench/sections/examples/flow-workbench-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/flow/flow-workbench/examples"
componentGroup: "flow"
symbols: ["TngFlowExecutionInspectorComponent","TngFlowExecutionInspectorTemplateDirective","TngFlowExecutionPayloadComponent","TngFlowExecutionPayloadTemplateDirective","TngFlowNodePropertiesDataTemplateDirective","TngFlowWorkbenchComponent","TngFlowWorkbenchDetailsTemplateDirective","TngFlowWorkbenchPaletteTemplateDirective"]
selectors: ["tng-flow-execution-inspector","ng-template[tngFlowExecutionInspector]","tng-flow-execution-payload","ng-template[tngFlowExecutionPayload]","ng-template[tngFlowNodePropertiesData]","tng-flow-workbench","ng-template[tngFlowWorkbenchDetails]","ng-template[tngFlowWorkbenchPalette]"]
productId: "flow-workbench"
section: "examples"
officialCatalog: true
generated: true
---

# Flow Workbench examples

## Minimal example

```ts
import { Component } from '@angular/core';
import { TngFlowWorkbenchComponent } from '@tailng-ui/flow/execution';

@Component({
  standalone: true,
  imports: [TngFlowWorkbenchComponent],
  template: `<tng-flow-workbench />`,
})
export class FlowWorkbenchExample {}
```
