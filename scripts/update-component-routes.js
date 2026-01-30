#!/usr/bin/env node
/**
 * Updates per-component route files (e.g. text-input.routes.ts) to use new file names.
 */
const fs = require('fs');
const path = require('path');

const DOCS_PAGES = path.join(__dirname, '../apps/docs/src/app/pages/components');

const routeFiles = [
  'forms/autocomplete/autocomplete.routes.ts',
  'forms/text-input/text-input.routes.ts',
  'forms/checkbox/checkbox.routes.ts',
  'forms/chips/chips.routes.ts',
  'forms/datepicker/datepicker.routes.ts',
  'forms/timepicker/timepicker.routes.ts',
  'forms/number-input/number-input.routes.ts',
  'forms/textarea/textarea.routes.ts',
  'forms/form-field/form-field.routes.ts',
  'forms/file-upload/file-upload.routes.ts',
  'forms/radio-button/radio-button.routes.ts',
  'forms/select/select.routes.ts',
  'forms/slider/slider.routes.ts',
  'forms/slide-toggle/slide-toggle.routes.ts',
  'forms/button-toggle/button-toggle.routes.ts',
];

for (const rel of routeFiles) {
  const filePath = path.join(DOCS_PAGES, rel);
  if (!fs.existsSync(filePath)) continue;
  const parts = rel.split('/');
  const name = parts[parts.length - 2]; // e.g. text-input, autocomplete
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(
    /\.\/overview\/overview\.component/g,
    `./overview/${name}-overview.component`
  );
  content = content.replace(
    /\.\/api\/api\.component/g,
    `./api/${name}-api.component`
  );
  content = content.replace(
    /\.\/styling\/styling\.component/g,
    `./styling/${name}-styling.component`
  );
  content = content.replace(
    /\.\/examples\/examples\.component/g,
    `./examples/${name}-examples.component`
  );
  fs.writeFileSync(filePath, content);
}

console.log('Done updating component route files.');
