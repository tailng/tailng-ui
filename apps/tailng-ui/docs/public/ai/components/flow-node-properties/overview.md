---
id: "components/flow-node-properties/overview"
title: "Flow Node Properties component"
description: "Selected-node details and edit panel for metadata, ports, data templates, and immutable change requests."
category: "components"
status: "stable"
tags: ["flow-node-properties","flow","component"]
package: "@tailng-ui/flow"
importPath: "@tailng-ui/flow/execution"
sourcePaths: ["libs/tailng-ui/flow/src/execution/components/node-properties/tng-flow-node-properties.component.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-node-properties/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/flow/flow-node-properties/overview"
componentGroup: "flow"
symbols: ["TngFlowNodePropertiesComponent"]
selectors: ["tng-flow-node-properties"]
productId: "flow-node-properties"
section: "overview"
officialCatalog: true
generated: true
---

# Flow Node Properties component

Selected-node details and edit panel for metadata, ports, data templates, and immutable change requests.

## Package and import

Import the standalone Angular API from `@tailng-ui/flow/execution`:

```ts
import { Component } from '@angular/core';
import { TngFlowNodePropertiesComponent } from '@tailng-ui/flow/execution';

@Component({
  standalone: true,
  imports: [TngFlowNodePropertiesComponent],
  template: `<tng-flow-node-properties />`,
})
export class FlowNodePropertiesAgentExample {}
```

Load `@tailng-ui/flow/styles.css` once in the application styles in addition to the TailNG theme contract.

## Component family

- `TngFlowNodePropertiesComponent` — selector `tng-flow-node-properties`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/flow/flow-node-properties/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/flow-node-properties/api.md)
- [Styling](https://tailng.dev/ai/components/flow-node-properties/styling.md)
- [Examples](https://tailng.dev/ai/components/flow-node-properties/examples.md)
