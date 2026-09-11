import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

function readWorkspaceFile(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8');
}

describe('progress-bar theme contract', () => {
  it('maps progress-bar radius to the shared control radius vocabulary', () => {
    const progressBarContractCss = readWorkspaceFile(
      'libs/tailng-ui/theme/src/lib/component-contracts/feedback/progress-bar.css',
    );
    const componentContractsIndexCss = readWorkspaceFile(
      'libs/tailng-ui/theme/src/lib/component-contracts/index.css',
    );

    expect(progressBarContractCss).toContain(
      '--tng-progress-bar-radius: var(--tng-radius-control);',
    );
    expect(componentContractsIndexCss).toContain(
      "@import './feedback/progress-bar.css' layer(tng.contracts);",
    );
  });
});
