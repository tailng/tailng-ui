#!/usr/bin/env node
/**
 * Renames overview, api, styling, examples component files to {name}-overview, etc.
 * Usage: node scripts/rename-docs-components.js
 */
const fs = require('fs');
const path = require('path');

const DOCS_PAGES = path.join(__dirname, '../apps/docs/src/app/pages/components');

const categories = ['buttons', 'forms', 'layout', 'navigation', 'overlay', 'overlay-primitives', 'data', 'utilities'];

const subdirs = {
  buttons: ['badge', 'tag', 'button', 'icon', 'ripples', 'progress-bar', 'progress-spinner', 'skeleton'],
  forms: ['autocomplete', 'checkbox', 'chips', 'datepicker', 'timepicker', 'form-field', 'text-input', 'number-input', 'textarea', 'file-upload', 'radio-button', 'select', 'slider', 'slide-toggle', 'button-toggle'],
  layout: ['accordion', 'card', 'divider', 'expansion-panel', 'tabs'],
  navigation: ['breadcrumbs', 'drawer', 'menu', 'paginator', 'sidenav', 'stepper'],
  overlay: ['dialog', 'popover', 'snackbar', 'tooltip'],
  'overlay-primitives': ['connected-overlay', 'option-list'],
  data: ['empty-state', 'filter-header', 'sort-header', 'table', 'tree', 'virtual-scroll'],
  utilities: ['code-block', 'copy-button'],
};

function renameInDir(basePath, name, subfolder) {
  const dir = path.join(basePath, subfolder);
  if (!fs.existsSync(dir)) return;
  const prefix = subfolder === 'overview' ? `${name}-overview` : subfolder === 'api' ? `${name}-api` : subfolder === 'styling' ? `${name}-styling` : `${name}-examples`;
  const ext = subfolder;
  const oldTs = path.join(dir, `${subfolder}.component.ts`);
  const oldHtml = path.join(dir, `${subfolder}.component.html`);
  const newTs = path.join(dir, `${prefix}.component.ts`);
  const newHtml = path.join(dir, `${prefix}.component.html`);
  if (fs.existsSync(oldTs)) {
    let tsContent = fs.readFileSync(oldTs, 'utf8');
    tsContent = tsContent.replace(new RegExp(`\\./${subfolder}\\.component\\.html`), `./${prefix}.component.html`);
    fs.writeFileSync(newTs, tsContent);
    fs.unlinkSync(oldTs);
  }
  if (fs.existsSync(oldHtml) && !fs.existsSync(newHtml)) {
    fs.renameSync(oldHtml, newHtml);
  } else if (fs.existsSync(oldHtml)) {
    fs.unlinkSync(oldHtml);
  }
}

for (const cat of categories) {
  const list = subdirs[cat];
  if (!list) continue;
  for (const name of list) {
    const basePath = path.join(DOCS_PAGES, cat, name);
    if (!fs.existsSync(basePath)) continue;
    renameInDir(basePath, name, 'overview');
    renameInDir(basePath, name, 'api');
    renameInDir(basePath, name, 'styling');
    renameInDir(basePath, name, 'examples');
  }
}

console.log('Done renaming component files.');
