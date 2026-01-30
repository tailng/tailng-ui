#!/usr/bin/env node
/**
 * Updates route imports from overview.component to {name}-overview.component etc.
 */
const fs = require('fs');
const path = require('path');

const ROUTES_DIR = path.join(__dirname, '../apps/docs/src/app/routes');

const routeFiles = [
  'forms.routes.ts',
  'layout.routes.ts',
  'navigation.routes.ts',
  'overlay.routes.ts',
  'overlay-primitives.routes.ts',
  'data.routes.ts',
  'utilities.routes.ts',
];

// Map: path segment (e.g. "forms/text-input") -> component name (e.g. "text-input")
const replacements = [
  // forms
  ['forms/autocomplete', 'autocomplete'],
  ['forms/checkbox', 'checkbox'],
  ['forms/chips', 'chips'],
  ['forms/datepicker', 'datepicker'],
  ['forms/timepicker', 'timepicker'],
  ['forms/form-field', 'form-field'],
  ['forms/text-input', 'text-input'],
  ['forms/number-input', 'number-input'],
  ['forms/textarea', 'textarea'],
  ['forms/file-upload', 'file-upload'],
  ['forms/radio-button', 'radio-button'],
  ['forms/select', 'select'],
  ['forms/slider', 'slider'],
  ['forms/slide-toggle', 'slide-toggle'],
  ['forms/button-toggle', 'button-toggle'],
  // layout
  ['layout/accordion', 'accordion'],
  ['layout/card', 'card'],
  ['layout/divider', 'divider'],
  ['layout/expansion-panel', 'expansion-panel'],
  ['layout/tabs', 'tabs'],
  // navigation
  ['navigation/breadcrumbs', 'breadcrumbs'],
  ['navigation/drawer', 'drawer'],
  ['navigation/menu', 'menu'],
  ['navigation/paginator', 'paginator'],
  ['navigation/sidenav', 'sidenav'],
  ['navigation/stepper', 'stepper'],
  // overlay
  ['overlay/dialog', 'dialog'],
  ['overlay/popover', 'popover'],
  ['overlay/snackbar', 'snackbar'],
  ['overlay/tooltip', 'tooltip'],
  // overlay-primitives
  ['overlay-primitives/connected-overlay', 'connected-overlay'],
  ['overlay-primitives/option-list', 'option-list'],
  // data
  ['data/empty-state', 'empty-state'],
  ['data/filter-header', 'filter-header'],
  ['data/sort-header', 'sort-header'],
  ['data/table', 'table'],
  ['data/tree', 'tree'],
  ['data/virtual-scroll', 'virtual-scroll'],
  // utilities
  ['utilities/code-block', 'code-block'],
  ['utilities/copy-button', 'copy-button'],
];

for (const file of routeFiles) {
  const filePath = path.join(ROUTES_DIR, file);
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [pathSeg, name] of replacements) {
    const esc = pathSeg.replace(/\//g, '\\/');
    content = content.replace(
      new RegExp(`${esc}/overview/overview\\.component`, 'g'),
      `${pathSeg}/overview/${name}-overview.component`
    );
    content = content.replace(
      new RegExp(`${esc}/api/api\\.component`, 'g'),
      `${pathSeg}/api/${name}-api.component`
    );
    content = content.replace(
      new RegExp(`${esc}/styling/styling\\.component`, 'g'),
      `${pathSeg}/styling/${name}-styling.component`
    );
    content = content.replace(
      new RegExp(`${esc}/examples/examples\\.component`, 'g'),
      `${pathSeg}/examples/${name}-examples.component`
    );
  }
  fs.writeFileSync(filePath, content);
}

console.log('Done updating route files.');
