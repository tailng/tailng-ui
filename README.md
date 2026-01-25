# TailNG – Angular 21

Nx + Angular 21 + Tailwind starter for TailNG.

## Included
- `apps/docs` – demo & docs site
- `apps/playground` – sandbox for testing components
- `libs/ui` – UI component library (Button, Input, Card, etc.)
- `libs/icons` – Bootstrap Icons wrapper
- `libs/theme` – Tailwind preset + plugin
- `libs/cdk` – utilities

## Getting Started

### Installation

```bash
yarn install
```

### Running the Playground

The playground is a development sandbox where you can test and preview components:

```bash
yarn playground
```

This will start the playground application at `http://localhost:4200` (or the next available port).

### Running the Docs Site

```bash
yarn docs
```

## Component Development Guide

### Project Structure

Components are organized in the `libs/ui` directory:

```
libs/ui/
  ├── button/
  │   └── src/
  │       ├── button.component.ts
  │       ├── button.component.html
  │       ├── button.types.ts
  │       ├── button.variants.ts
  │       └── public-api.ts
  ├── input/
  │   └── src/
  │       ├── input.component.ts
  │       ├── input.component.html
  │       └── public-api.ts
  └── src/
      └── public-api.ts  (main export file)
```

### Creating a New Component

#### Step 1: Create Component Files

1. **Create the component directory** in `libs/ui/`:
   ```bash
   mkdir -p libs/ui/my-component/src
   ```

2. **Create the component TypeScript file** (`libs/ui/my-component/src/my-component.component.ts`):
   ```typescript
   import { Component, input } from '@angular/core';

   @Component({
     selector: 'tng-my-component',
     standalone: true,
     templateUrl: './my-component.component.html',
   })
   export class TailngMyComponentComponent {
     // Define your inputs using Angular signals
     label = input<string>('');
     disabled = input(false);
   }
   ```

3. **Create the component template** (`libs/ui/my-component/src/my-component.component.html`):
   ```html
   <div class="my-component">
     <span>{{ label() }}</span>
   </div>
   ```

4. **Create the public API file** (`libs/ui/my-component/src/public-api.ts`):
   ```typescript
   export * from './my-component.component';
   ```

5. **Export from main UI library** (`libs/ui/src/public-api.ts`):
   ```typescript
   export * from '../my-component/src/public-api';
   ```

#### Step 2: Create a Demo Component in Playground

1. **Determine the category** for your component:
   - Form Controls: `apps/playground/src/app/demos/form-controls/`
   - Buttons & Indicators: `apps/playground/src/app/demos/buttons-indicators/`
   - Layout: `apps/playground/src/app/demos/layout/`
   - Navigation: `apps/playground/src/app/demos/navigation/`
   - Popups & Overlays: `apps/playground/src/app/demos/popups-overlays/`
   - Data Table & Structure: `apps/playground/src/app/demos/data-table-structure/`

2. **Create the demo component directory**:
   ```bash
   mkdir -p apps/playground/src/app/demos/[category]/my-component
   ```

3. **Create the demo component** (`my-component-demo.component.ts`):
   ```typescript
   import { Component } from '@angular/core';
   import { TailngMyComponentComponent } from '@tociva/tailng-ui';

   @Component({
     selector: 'playground-my-component-demo',
     standalone: true,
     imports: [TailngMyComponentComponent],
     templateUrl: './my-component-demo.component.html',
   })
   export class MyComponentDemoComponent {}
   ```

4. **Create the demo template** (`my-component-demo.component.html`):
   ```html
   <div>
     <h1 class="text-2xl font-bold mb-6">My Component</h1>
     
     <div class="space-y-6">
       <section>
         <h2 class="text-lg font-semibold mb-3">Basic Usage</h2>
         <tng-my-component label="Hello World"></tng-my-component>
       </section>

       <section>
         <h2 class="text-lg font-semibold mb-3">With Props</h2>
         <tng-my-component label="Disabled" [disabled]="true"></tng-my-component>
       </section>
     </div>
   </div>
   ```

#### Step 3: Add Route to Playground

1. **Add the route** in `apps/playground/src/app/app.routes.ts`:
   ```typescript
   {
     path: '[category]/my-component',
     loadComponent: () =>
       import('./demos/[category]/my-component/my-component-demo.component').then(
         (m) => m.MyComponentDemoComponent
       ),
   },
   ```

   Replace `[category]` with the appropriate category path (e.g., `form-controls`, `buttons-indicators`, etc.).

#### Step 4: Add to Navigation

1. **Add to sidebar navigation** in `apps/playground/src/app/app.component.html`:
   ```html
   <a
     routerLink="/[category]/my-component"
     class="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition"
     routerLinkActive="bg-primary/10 text-primary font-medium"
     [routerLinkActiveOptions]="{ exact: false }"
   >
     <span class="h-2 w-2 rounded-full bg-gray-300"></span>
     My Component
   </a>
   ```

2. **Add to home page** in `apps/playground/src/app/home/home.component.ts`:
   ```typescript
   {
     name: 'My Component',
     route: '/[category]/my-component',
   },
   ```

### Updating an Existing Component

1. **Modify the component** in `libs/ui/[component-name]/src/`
2. **Update the demo** in `apps/playground/src/app/demos/[category]/[component-name]/`
3. **Test in playground** - The changes will be hot-reloaded automatically

### Testing Components in Playground

1. **Start the playground**:
   ```bash
   yarn playground
   ```

2. **Navigate to the component**:
   - Visit the home page to see all components in a tiled layout
   - Click on any component tile to view its demo
   - Or use the sidebar navigation to browse by category

3. **Test different scenarios**:
   - Update the demo component to test various props and states
   - Check responsive behavior
   - Test edge cases and error states

### Component Categories

Components are organized into the following categories:

#### Form Controls
- Autocomplete, Checkbox, Chips, Datepicker, Form Field, Input, Radio Button, Select, Slider, Slide Toggle, Timepicker

#### Buttons & Indicators
- Button, Button Toggle, Badge, Icon, Ripples, Progress Bar, Progress Spinner

#### Layout
- Card, Divider, Expansion Panel, Grid List, List, Tabs, Toolbar

#### Navigation
- Menu, Sidenav, Stepper, Paginator

#### Popups & Overlays
- Dialog, Bottom Sheet, Snackbar, Tooltip

#### Data Table & Structure
- Table, Sort Header, Tree

### Best Practices

1. **Use Angular Signals**: Prefer `input()` for component inputs instead of `@Input()`
2. **Standalone Components**: All components should be standalone
3. **Tailwind CSS**: Use Tailwind utility classes for styling
4. **Type Safety**: Define types in separate `.types.ts` files when needed
5. **Variants**: Use a `.variants.ts` file for variant classes (see `button.variants.ts` as an example)
6. **Demo Components**: Create comprehensive demos showing different use cases
7. **Naming Convention**: 
   - Component selector: `tng-[component-name]`
   - Component class: `Tailng[ComponentName]Component`
   - Demo component: `[ComponentName]DemoComponent`

### Building

Build all projects:

```bash
yarn build
```

## Development Workflow

1. **Create or update a component** in `libs/ui/`
2. **Create/update the demo** in `apps/playground/src/app/demos/`
3. **Add/update routes** in `app.routes.ts`
4. **Update navigation** in `app.component.html` and `home.component.ts`
5. **Test in playground** by running `yarn playground`
6. **Iterate** until the component works as expected

## Project Structure Overview

```
tailng/
├── apps/
│   ├── docs/              # Documentation site
│   └── playground/        # Component testing playground
│       └── src/
│           └── app/
│               ├── demos/         # Demo components organized by category
│               ├── home/          # Home page component
│               ├── app.component.* # Main app component with navigation
│               └── app.routes.ts  # Route configuration
├── libs/
│   ├── ui/                # UI component library
│   ├── icons/             # Icon components
│   ├── theme/             # Tailwind configuration
│   └── cdk/               # Utilities
└── package.json
```

## Additional Resources

- [Angular Documentation](https://angular.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Nx Documentation](https://nx.dev)

## Publish to npm

```
cd dist/libs/cdk && npm publish --access public --dry-run
# make sure you're logged in
npm whoami || npm login

# publish in order
cd dist/libs/cdk   && npm publish --access public
cd ../theme        && npm publish --access public
cd ../icons        && npm publish --access public
cd ../ui           && npm publish --access public
```