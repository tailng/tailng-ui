import { createTngFlowConnectorId } from './tng-flow-connector-id';
import type {
  TngFlowValidation,
  TngFlowValidationIssue,
  TngFlowValidationSeverity,
} from '../types/tng-flow-validation.types';

export type TngFlowIssueIndex = Readonly<{
  flowIssues: readonly TngFlowValidationIssue[];
  nodeIssues: ReadonlyMap<string, readonly TngFlowValidationIssue[]>;
  portIssues: ReadonlyMap<string, readonly TngFlowValidationIssue[]>;
  connectionIssues: ReadonlyMap<string, readonly TngFlowValidationIssue[]>;
}>;

const SEVERITY_RANK: Readonly<Record<TngFlowValidationSeverity, number>> = Object.freeze({
  info: 1,
  warning: 2,
  error: 3,
});

function appendIssue(
  index: Map<string, TngFlowValidationIssue[]>,
  key: string,
  issue: TngFlowValidationIssue,
): void {
  const current = index.get(key);
  if (current === undefined) {
    index.set(key, [issue]);
    return;
  }
  current.push(issue);
}

export function createTngFlowIssueIndex(validation: TngFlowValidation): TngFlowIssueIndex {
  const flowIssues: TngFlowValidationIssue[] = [];
  const nodeIssues = new Map<string, TngFlowValidationIssue[]>();
  const portIssues = new Map<string, TngFlowValidationIssue[]>();
  const connectionIssues = new Map<string, TngFlowValidationIssue[]>();

  for (const issue of validation.issues) {
    switch (issue.target.kind) {
      case 'flow':
        flowIssues.push(issue);
        break;
      case 'node':
        appendIssue(nodeIssues, issue.target.nodeId, issue);
        break;
      case 'port':
        appendIssue(
          portIssues,
          createTngFlowConnectorId(issue.target.nodeId, issue.target.portId),
          issue,
        );
        break;
      case 'connection':
        appendIssue(connectionIssues, issue.target.connectionId, issue);
        break;
    }
  }

  return { flowIssues, nodeIssues, portIssues, connectionIssues };
}

export function resolveTngFlowValidationSeverity(
  issues: readonly TngFlowValidationIssue[],
): TngFlowValidationSeverity | null {
  let resolved: TngFlowValidationSeverity | null = null;
  for (const issue of issues) {
    if (resolved === null || SEVERITY_RANK[issue.severity] > SEVERITY_RANK[resolved]) {
      resolved = issue.severity;
    }
  }
  return resolved;
}
