---
id: "components/flow-node-properties/api"
title: "Flow Node Properties API"
description: "Flow Node Properties API reference for Angular applications."
category: "components"
status: "stable"
tags: ["flow-node-properties","flow","api"]
package: "@tailng-ui/flow"
importPath: "@tailng-ui/flow/execution"
sourcePaths: ["libs/tailng-ui/flow/src/execution/components/node-properties/tng-flow-node-properties.component.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-node-properties/routes.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-node-properties/sections/api/flow-node-properties-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/flow/flow-node-properties/sections/api/flow-node-properties-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/flow/flow-node-properties/api"
componentGroup: "flow"
symbols: ["TngFlowNodePropertiesComponent"]
selectors: ["tng-flow-node-properties"]
productId: "flow-node-properties"
section: "api"
officialCatalog: true
generated: true
---

# Flow Node Properties API

Selected-node details and edit panel for metadata, ports, data templates, and immutable change requests.

## Node Properties API

Import `TngFlowNodePropertiesComponent`, the `TngFlowNodePropertiesDataTemplateDirective`, and related event types from `@tailng-ui/flow/execution`. The component is controlled: it displays the selected node and emits change requests for the application to apply.

### Properties inputs

Provide either `node` directly or `definition` plus `inspectedNodeId`. A direct `node` value takes precedence, which is useful when the surrounding app already resolves selection.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `definition` | `TngFlowDefinition<TData> \| null` | `null` | Workflow definition used to resolve the inspected node by id. |
| `node` | `TngFlowNode<TData> \| null` | `null` | Explicit selected node. When present, this overrides definition lookup. |
| `inspectedNodeId` | `string \| null` | `null` | Node id to inspect when the component receives a full definition. |
| `readonly` | `boolean` | `false` | Disables editable controls and prevents built-in fields or custom templates from emitting change requests. |
| `showData` | `boolean` | `true` | Shows the Data section with either the JSON preview or custom data template. |
| `showPorts` | `boolean` | `true` | Shows the Ports section with input and output port metadata. |

### Properties outputs

The component never mutates the supplied node or definition. Listen for `nodeChangeRequested`, validate the request if needed, then merge the partial changes into application state.

| Name | Type | Description |
| --- | --- | --- |
| `nodeChangeRequested` | `TngFlowNodePropertyChangeRequest<TData>` | Emitted for built-in name, description, disabled, and locked edits, and for custom data template requests. |

| Payload field | Type | Description |
| --- | --- | --- |
| `node` | `TngFlowNode<TData>` | The node that was displayed when the request was created. |
| `nodeId` | `string` | Stable id for matching the request back to the definition. |
| `changes` | `TngFlowNodePropertyChanges<TData>` | Partial changes for `name`, `description`, `disabled`, `locked`, or `data`. |
| `source` | `'field' \| 'data-template'` | Identifies whether the request came from built-in fields or a projected template. |

### Data template

Project `ng-template[tngFlowNodePropertiesData]` when a product needs a typed data editor or a domain-specific readonly summary. The template replaces only the Data section body; the built-in header, base fields, and port list remain available.

| Context value | Type | Description |
| --- | --- | --- |
| `$implicit`, `data` | `TData \| undefined` | The selected node data. |
| `node` | `TngFlowNode<TData>` | The selected node record. |
| `readonly` | `boolean` | Use this to disable custom controls consistently with the built-in fields. |
| `requestDataChange` | `(data: TData \| undefined) => void` | Requests a `data`-only node update. |
| `requestNodeChange` | `(changes: TngFlowNodePropertyChanges<TData>) => void` | Requests any supported node property update from the custom template. |

## Source-derived public Angular API

### `TngFlowNodePropertiesComponent` — `tng-flow-node-properties`

- Inputs: `definition`, `inspectedNodeId`, `node`, `readonly`, `showData`, `showPorts`
- Outputs: `nodeChangeRequested`
