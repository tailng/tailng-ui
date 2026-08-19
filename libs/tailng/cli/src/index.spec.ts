/**
 * @vitest-environment node
 */
import { getRegistryItem, listRegistryItemNames, type RegistryItem } from '@tailng-ui/registry';
import { access, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import * as path from 'node:path';
import { afterEach, expect, it, vi } from 'vitest';
import { runCli } from './index';

type CliRegistryModule = Readonly<{
  getRegistryItem: typeof getRegistryItem;
  listRegistryItemNames: typeof listRegistryItemNames;
}>;

const registryModule: CliRegistryModule = {
  getRegistryItem,
  listRegistryItemNames,
};

const createdRoots: string[] = [];

async function createTargetRoot(): Promise<string> {
  const targetRoot = await mkdtemp(path.join(tmpdir(), 'tailng-cli-'));
  createdRoots.push(targetRoot);
  return targetRoot;
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function toCapturedText(chunk: string | Uint8Array): string {
  if (typeof chunk === 'string') {
    return chunk;
  }

  return Buffer.from(chunk).toString('utf8');
}

async function captureCli(
  argv: readonly string[],
  dependencies?: Readonly<{ registry: CliRegistryModule }>,
): Promise<Readonly<{ exitCode: number; stderr: string; stdout: string }>> {
  const stdoutChunks: string[] = [];
  const stderrChunks: string[] = [];
  const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(((
    chunk: string | Uint8Array,
  ) => {
    stdoutChunks.push(toCapturedText(chunk));
    return true;
  }) as typeof process.stdout.write);
  const stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(((
    chunk: string | Uint8Array,
  ) => {
    stderrChunks.push(toCapturedText(chunk));
    return true;
  }) as typeof process.stderr.write);

  try {
    const exitCode = await runCli(argv, dependencies ?? { registry: registryModule });
    return {
      exitCode,
      stderr: stderrChunks.join(''),
      stdout: stdoutChunks.join(''),
    };
  } finally {
    stdoutSpy.mockRestore();
    stderrSpy.mockRestore();
  }
}

afterEach(async (): Promise<void> => {
  for (const root of createdRoots) {
    await rm(root, { recursive: true, force: true });
  }

  createdRoots.length = 0;
});

it('tailng cli integration: list prints registry items and aliases', async (): Promise<void> => {
  const { exitCode, stderr, stdout } = await captureCli(['list']);

  expect(exitCode).toBe(0);
  expect(stderr).toBe('');
  expect(stdout).toContain('Available components:');
  expect(stdout).toContain('- button');
  expect(stdout).toContain('- progress-spinner');
  expect(stdout).toContain('Aliases (resolved to canonical components):');
  expect(stdout).toContain('- slide-toggle -> switch');
  expect(stdout).toContain('- sidenav -> drawer');
});

it('tailng cli integration: --help prints usage and exits zero', async (): Promise<void> => {
  const { exitCode, stderr, stdout } = await captureCli(['--help']);

  expect(exitCode).toBe(0);
  expect(stderr).toBe('');
  expect(stdout).toContain('tailng - TailNG CLI');
  expect(stdout).toContain('tailng list');
  expect(stdout).toContain('tailng add <component-name>');
});

it('tailng cli integration: help prints usage and exits zero', async (): Promise<void> => {
  const { exitCode, stderr, stdout } = await captureCli(['help']);

  expect(exitCode).toBe(0);
  expect(stderr).toBe('');
  expect(stdout).toContain('tailng - TailNG CLI');
  expect(stdout).toContain('tailng list');
  expect(stdout).toContain('tailng add <component-name>');
});

it('tailng cli integration: unknown command prints help and exits non-zero', async (): Promise<void> => {
  const { exitCode, stderr, stdout } = await captureCli(['deploy']);

  expect(exitCode).toBe(1);
  expect(stderr).toContain('Unknown command "deploy".');
  expect(stdout).toContain('tailng - TailNG CLI');
});

it('tailng cli integration: unsupported component prints available components and exits non-zero', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();
  const { exitCode, stderr, stdout } = await captureCli(['add', 'datepicker', '--cwd', targetRoot]);

  expect(exitCode).toBe(1);
  expect(stdout).toBe('');
  expect(stderr).toContain('Unknown component "datepicker".');
  expect(stderr).toContain('Available components:');
  expect(stderr).toContain('button');
  expect(stderr).toContain('switch');
});

it('tailng cli integration: add without a component name prints help and exits non-zero', async (): Promise<void> => {
  const { exitCode, stderr, stdout } = await captureCli(['add']);

  expect(exitCode).toBe(1);
  expect(stderr).toContain('Missing component name for "add".');
  expect(stdout).toContain('tailng - TailNG CLI');
});

it('tailng cli integration: invalid --cwd prints an error and exits non-zero', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();
  const missingDirectory = path.join(targetRoot, 'does-not-exist');
  const { exitCode, stderr, stdout } = await captureCli([
    'add',
    'button',
    '--cwd',
    missingDirectory,
  ]);

  expect(exitCode).toBe(1);
  expect(stdout).toBe('');
  expect(stderr).toContain(`Target directory does not exist: ${missingDirectory}`);
});

it('tailng cli integration: alias resolution output is printed for canonicalized components', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();
  const { exitCode, stderr, stdout } = await captureCli([
    'add',
    'slide-toggle',
    '--cwd',
    targetRoot,
    '--dry-run',
  ]);

  expect(exitCode).toBe(0);
  expect(stderr).toBe('');
  expect(stdout).toContain('Alias "slide-toggle" resolved to canonical component "switch".');
  expect(stdout).toContain("Import with: import { TngSwitch } from './tailng-ui/switch';");
});

it('tailng cli integration: dependency hints are printed from registry metadata', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();
  const { exitCode, stderr, stdout } = await captureCli([
    'add',
    'accordion',
    '--cwd',
    targetRoot,
    '--dry-run',
  ]);

  expect(exitCode).toBe(0);
  expect(stderr).toBe('');
  expect(stdout).toContain('Install dependencies: pnpm add @tailng-ui/cdk');
});

it('tailng cli integration: import hints are printed from registry install metadata', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();
  const { exitCode, stderr, stdout } = await captureCli([
    'add',
    'copy',
    '--cwd',
    targetRoot,
    '--dry-run',
  ]);

  expect(exitCode).toBe(0);
  expect(stderr).toBe('');
  expect(stdout).toContain("Import with: import { TngCopyButton } from './tailng-ui/copy';");
});

it('tailng cli integration: registry paths resolving outside the target root are rejected', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();
  const escapePath = path.resolve(targetRoot, '../escape.ts');
  const maliciousItem: RegistryItem = {
    dependencies: [],
    description: 'Malicious registry fixture.',
    files: [
      {
        content: 'export {};\n',
        path: '../escape.ts',
      },
    ],
    install: {
      importPath: './tailng-ui/danger',
      importSymbols: ['TngDanger'],
    },
    name: 'danger',
  };
  const maliciousRegistry: CliRegistryModule = {
    getRegistryItem: (name: string) => (name === 'danger' ? maliciousItem : undefined),
    listRegistryItemNames: () => ['danger'],
  };

  const { exitCode, stderr, stdout } = await captureCli(['add', 'danger', '--cwd', targetRoot], {
    registry: maliciousRegistry,
  });

  expect(exitCode).toBe(1);
  expect(stdout).toBe('');
  expect(stderr).toContain('One or more registry file paths resolve outside the target directory.');
  expect(await pathExists(escapePath)).toBe(false);
});

it('tailng cli integration: dry-run does not write files to disk', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'button', '--cwd', targetRoot, '--dry-run'], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/button/tng-button.ts'))).toBe(
    false,
  );
});

it('tailng cli integration: add writes all button source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'button', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);

  const buttonTsPath = path.join(targetRoot, 'src/app/tailng-ui/button/tng-button.ts');
  const primitivePath = path.join(targetRoot, 'src/app/tailng-ui/button/tng-press-primitive.ts');
  const indexPath = path.join(targetRoot, 'src/app/tailng-ui/button/index.ts');

  expect(await pathExists(buttonTsPath)).toBe(true);
  expect(await pathExists(primitivePath)).toBe(true);
  expect(await pathExists(indexPath)).toBe(true);

  const buttonTsContent = await readFile(buttonTsPath, 'utf8');
  expect(buttonTsContent).toContain("selector: 'tng-button'");

  const indexContent = await readFile(indexPath, 'utf8');
  expect(indexContent).toContain("export * from './tng-button';");
  expect(indexContent).toContain("export * from './tng-press-primitive';");
});

it('tailng cli integration: add writes accordion source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'accordion', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/accordion/tng-accordion.ts')),
  ).toBe(true);
  expect(
    await pathExists(
      path.join(targetRoot, 'src/app/tailng-ui/accordion/tng-accordion-primitive.ts'),
    ),
  ).toBe(true);
});

it('tailng cli integration: add writes menu source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'menu', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/menu/tng-menu.ts'))).toBe(true);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/menu/tng-menu-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes dropdown-menu source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'dropdown-menu', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/dropdown-menu/tng-dropdown-menu.ts')),
  ).toBe(true);
  expect(
    await pathExists(
      path.join(targetRoot, 'src/app/tailng-ui/dropdown-menu/tng-dropdown-menu-primitive.ts'),
    ),
  ).toBe(true);
});

it('tailng cli integration: add writes context-menu source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'context-menu', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/context-menu/tng-context-menu.ts')),
  ).toBe(true);
  expect(
    await pathExists(
      path.join(targetRoot, 'src/app/tailng-ui/context-menu/tng-context-menu-primitive.ts'),
    ),
  ).toBe(true);
});

it('tailng cli integration: add writes breadcrumb source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'breadcrumb', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/breadcrumb/tng-breadcrumb.ts')),
  ).toBe(true);
  expect(
    await pathExists(
      path.join(targetRoot, 'src/app/tailng-ui/breadcrumb/tng-breadcrumb-primitive.ts'),
    ),
  ).toBe(true);
});

it('tailng cli integration: add writes menubar source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'menubar', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/menubar/tng-menubar.ts'))).toBe(
    true,
  );
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/menubar/tng-menubar-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes navigation-menu source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'navigation-menu', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(
    await pathExists(
      path.join(targetRoot, 'src/app/tailng-ui/navigation-menu/tng-navigation-menu.ts'),
    ),
  ).toBe(true);
  expect(
    await pathExists(
      path.join(targetRoot, 'src/app/tailng-ui/navigation-menu/tng-navigation-menu-primitive.ts'),
    ),
  ).toBe(true);
});

it('tailng cli integration: add writes toolbar source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'toolbar', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/toolbar/tng-toolbar.ts'))).toBe(
    true,
  );
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/toolbar/tng-toolbar-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes tabs source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'tabs', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/tabs/tng-tabs.ts'))).toBe(true);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/tabs/tng-tabs-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes stepper source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'stepper', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/stepper/tng-stepper.ts'))).toBe(
    true,
  );
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/stepper/tng-stepper-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes toggle-group source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'toggle-group', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/toggle-group/tng-toggle-group.ts')),
  ).toBe(true);
  expect(
    await pathExists(
      path.join(targetRoot, 'src/app/tailng-ui/toggle-group/tng-toggle-group-primitive.ts'),
    ),
  ).toBe(true);
});

it('tailng cli integration: add writes toggle source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'toggle', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/toggle/tng-toggle.ts'))).toBe(
    true,
  );
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/toggle/tng-toggle-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes button-toggle source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'button-toggle', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/button-toggle/tng-button-toggle.ts')),
  ).toBe(true);
  expect(
    await pathExists(
      path.join(targetRoot, 'src/app/tailng-ui/button-toggle/tng-button-toggle-primitive.ts'),
    ),
  ).toBe(true);
  expect(
    await pathExists(
      path.join(targetRoot, 'src/app/tailng-ui/button-toggle/tng-button-toggle-group.ts'),
    ),
  ).toBe(true);
});

it('tailng cli integration: add writes chips source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'chips', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/chips/tng-chips.ts'))).toBe(
    true,
  );
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/chips/tng-chips-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes combobox source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'combobox', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/combobox/tng-combobox.ts')),
  ).toBe(true);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/combobox/tng-combobox-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes select source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'select', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/select/tng-select.ts'))).toBe(
    true,
  );
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/select/tng-select-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes autocomplete source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'autocomplete', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/autocomplete/tng-autocomplete.ts')),
  ).toBe(true);
  expect(
    await pathExists(
      path.join(targetRoot, 'src/app/tailng-ui/autocomplete/tng-autocomplete-primitive.ts'),
    ),
  ).toBe(true);
});

it('tailng cli integration: add writes multiselect source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'multiselect', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/multiselect/tng-multiselect.ts')),
  ).toBe(true);
  expect(
    await pathExists(
      path.join(targetRoot, 'src/app/tailng-ui/multiselect/tng-multiselect-primitive.ts'),
    ),
  ).toBe(true);
});

it('tailng cli integration: add writes grid source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'grid', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/grid/tng-grid.ts'))).toBe(true);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/grid/tng-grid-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes tree source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'tree', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/tree/tng-tree.ts'))).toBe(true);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/tree/tng-tree-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes drawer source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'drawer', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/drawer/tng-drawer.ts'))).toBe(
    true,
  );
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/drawer/tng-drawer-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: sidenav alias resolves to drawer source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'sidenav', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/drawer/tng-drawer.ts'))).toBe(
    true,
  );
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/drawer/tng-drawer-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes bottom-sheet source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'bottom-sheet', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/bottom-sheet/tng-bottom-sheet.ts')),
  ).toBe(true);
  expect(
    await pathExists(
      path.join(targetRoot, 'src/app/tailng-ui/bottom-sheet/tng-bottom-sheet-primitive.ts'),
    ),
  ).toBe(true);
});
it('tailng cli integration: add writes avatar source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'avatar', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/avatar/tng-avatar.ts'))).toBe(
    true,
  );
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/avatar/tng-avatar-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes tag source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'tag', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/tag/tng-tag.ts'))).toBe(true);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/tag/tng-tag-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes badge source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'badge', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/badge/tng-badge.ts'))).toBe(
    true,
  );
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/badge/tng-badge-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes copy source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'copy', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/copy/tng-copy-button.ts'))).toBe(
    true,
  );
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/copy/tng-copy-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes code-block source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'code-block', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/code-block/tng-code-block.ts')),
  ).toBe(true);
  expect(
    await pathExists(
      path.join(targetRoot, 'src/app/tailng-ui/code-block/tng-code-block-primitive.ts'),
    ),
  ).toBe(true);
  expect(
    await pathExists(
      path.join(targetRoot, 'src/app/tailng-ui/code-block/tng-code-highlighting.ts'),
    ),
  ).toBe(true);
});

it('tailng cli integration: add writes checkbox source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'checkbox', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/checkbox/tng-checkbox.ts')),
  ).toBe(true);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/checkbox/tng-checkbox-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes label source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'label', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/label/tng-label.ts'))).toBe(
    true,
  );
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/label/tng-label-primitive.ts')),
  ).toBe(true);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/label/tng-label.html'))).toBe(
    true,
  );
});

it('tailng cli integration: add writes input-otp source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'input-otp', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/input-otp/tng-input-otp.ts')),
  ).toBe(true);
  expect(
    await pathExists(
      path.join(targetRoot, 'src/app/tailng-ui/input-otp/tng-input-otp-primitive.ts'),
    ),
  ).toBe(true);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/input-otp/tng-input-otp.html')),
  ).toBe(true);
});

it('tailng cli integration: add writes card source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'card', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/card/tng-card.ts'))).toBe(true);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/card/tng-card-primitive.ts')),
  ).toBe(true);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/card/tng-card-footer.html')),
  ).toBe(true);
});

it('tailng cli integration: add writes empty source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'empty', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/empty/tng-empty.ts'))).toBe(
    true,
  );
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/empty/tng-empty-actions.html')),
  ).toBe(true);
});

it('tailng cli integration: add writes progress-bar source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'progress-bar', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/progress-bar/tng-progress-bar.ts')),
  ).toBe(true);
  expect(
    await pathExists(
      path.join(targetRoot, 'src/app/tailng-ui/progress-bar/tng-progress-bar-primitive.ts'),
    ),
  ).toBe(true);
});

it('tailng cli integration: list and add support confetti', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();
  expect(registryModule.listRegistryItemNames()).toContain('confetti');

  const exitCode = await runCli(['add', 'confetti', '--cwd', targetRoot], {
    registry: registryModule,
  });
  expect(exitCode).toBe(0);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/confetti/tng-confetti.ts')),
  ).toBe(true);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/confetti/tng-confetti.utils.ts')),
  ).toBe(true);
});

it('tailng cli integration: list and add support range-slider', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();
  expect(registryModule.listRegistryItemNames()).toContain('range-slider');

  const exitCode = await runCli(['add', 'range-slider', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/range-slider/tng-range-slider.ts')),
  ).toBe(true);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/range-slider/tng-range-slider.html')),
  ).toBe(true);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/range-slider/index.ts'))).toBe(
    true,
  );
});

it('tailng cli integration: add writes progress-spinner source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'progress-spinner', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(
    await pathExists(
      path.join(targetRoot, 'src/app/tailng-ui/progress-spinner/tng-progress-spinner.ts'),
    ),
  ).toBe(true);
  expect(
    await pathExists(
      path.join(targetRoot, 'src/app/tailng-ui/progress-spinner/tng-progress-spinner-primitive.ts'),
    ),
  ).toBe(true);
});

it('tailng cli integration: spinner alias resolves to progress-spinner source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'spinner', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(
    await pathExists(
      path.join(targetRoot, 'src/app/tailng-ui/progress-spinner/tng-progress-spinner.ts'),
    ),
  ).toBe(true);
  expect(
    await pathExists(
      path.join(targetRoot, 'src/app/tailng-ui/progress-spinner/tng-progress-spinner-primitive.ts'),
    ),
  ).toBe(true);
});

it('tailng cli integration: add writes skeleton source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'skeleton', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/skeleton/tng-skeleton.ts')),
  ).toBe(true);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/skeleton/tng-skeleton-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: snackbar alias resolves to toast source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'snackbar', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/toast/tng-toast.ts'))).toBe(
    true,
  );
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/toast/tng-toast-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: sonner alias resolves to toast source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'sonner', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/toast/tng-toast.ts'))).toBe(
    true,
  );
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/toast/tng-toast-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes separator source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'separator', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/separator/tng-separator.ts')),
  ).toBe(true);
  expect(
    await pathExists(
      path.join(targetRoot, 'src/app/tailng-ui/separator/tng-separator-primitive.ts'),
    ),
  ).toBe(true);
});

it('tailng cli integration: add writes textarea source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'textarea', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/textarea/tng-textarea.ts')),
  ).toBe(true);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/textarea/tng-textarea-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes dialog source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'dialog', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);

  const dialogTsPath = path.join(targetRoot, 'src/app/tailng-ui/dialog/tng-dialog.ts');
  const primitivePath = path.join(targetRoot, 'src/app/tailng-ui/dialog/tng-dialog-primitive.ts');
  const htmlPath = path.join(targetRoot, 'src/app/tailng-ui/dialog/tng-dialog.html');
  const cssPath = path.join(targetRoot, 'src/app/tailng-ui/dialog/tng-dialog.css');

  expect(await pathExists(dialogTsPath)).toBe(true);
  expect(await pathExists(primitivePath)).toBe(true);
  expect(await pathExists(htmlPath)).toBe(true);
  expect(await pathExists(cssPath)).toBe(true);

  const dialogTsContent = await readFile(dialogTsPath, 'utf8');
  expect(dialogTsContent).toContain("selector: 'tng-dialog'");
  expect(dialogTsContent).toContain("from './tng-dialog-primitive';");
  expect(dialogTsContent).not.toContain('TngDialogSize');

  const htmlContent = await readFile(htmlPath, 'utf8');
  expect(htmlContent).not.toContain('data-size');

  const cssContent = await readFile(cssPath, 'utf8');
  expect(cssContent).toContain('var(--tng-dialog-width, 34rem)');
  expect(cssContent).toContain('var(--tng-dialog-height, auto)');
});

it('tailng cli integration: add writes popover source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'popover', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);

  const popoverTsPath = path.join(targetRoot, 'src/app/tailng-ui/popover/tng-popover.ts');
  const primitivePath = path.join(targetRoot, 'src/app/tailng-ui/popover/tng-popover-primitive.ts');
  const htmlPath = path.join(targetRoot, 'src/app/tailng-ui/popover/tng-popover.html');

  expect(await pathExists(popoverTsPath)).toBe(true);
  expect(await pathExists(primitivePath)).toBe(true);
  expect(await pathExists(htmlPath)).toBe(true);

  const popoverTsContent = await readFile(popoverTsPath, 'utf8');
  expect(popoverTsContent).toContain("selector: 'tng-popover'");
  expect(popoverTsContent).toContain("from './tng-popover-primitive';");
});

it('tailng cli integration: add writes tooltip source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'tooltip', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);

  const tooltipTsPath = path.join(targetRoot, 'src/app/tailng-ui/tooltip/tng-tooltip.ts');
  const primitivePath = path.join(targetRoot, 'src/app/tailng-ui/tooltip/tng-tooltip-primitive.ts');
  const htmlPath = path.join(targetRoot, 'src/app/tailng-ui/tooltip/tng-tooltip.html');

  expect(await pathExists(tooltipTsPath)).toBe(true);
  expect(await pathExists(primitivePath)).toBe(true);
  expect(await pathExists(htmlPath)).toBe(true);

  const tooltipTsContent = await readFile(tooltipTsPath, 'utf8');
  expect(tooltipTsContent).toContain("selector: 'tng-tooltip'");
  expect(tooltipTsContent).toContain("from './tng-tooltip-primitive';");
});

it('tailng cli integration: returns non-zero when files already exist without --force', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const firstRunExitCode = await runCli(['add', 'button', '--cwd', targetRoot], {
    registry: registryModule,
  });
  expect(firstRunExitCode).toBe(0);

  const secondRunExitCode = await runCli(['add', 'button', '--cwd', targetRoot], {
    registry: registryModule,
  });
  expect(secondRunExitCode).toBe(1);
});

it('tailng cli integration: overwrites files when --force is provided', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const firstRunExitCode = await runCli(['add', 'button', '--cwd', targetRoot], {
    registry: registryModule,
  });
  expect(firstRunExitCode).toBe(0);

  const buttonTsPath = path.join(targetRoot, 'src/app/tailng-ui/button/tng-button.ts');
  await writeFile(buttonTsPath, '// stale content\n', 'utf8');

  const overwriteExitCode = await runCli(['add', 'button', '--cwd', targetRoot, '--force'], {
    registry: registryModule,
  });
  expect(overwriteExitCode).toBe(0);

  const overwrittenContent = await readFile(buttonTsPath, 'utf8');
  expect(overwrittenContent).toContain('export class TngButton');
  expect(overwrittenContent).not.toContain('// stale content');
});
