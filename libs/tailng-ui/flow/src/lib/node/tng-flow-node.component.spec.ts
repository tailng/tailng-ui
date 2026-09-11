import { TestBed } from '@angular/core/testing';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  TngFlowNodeComponent,
  resolveTngFlowNodeProgressState,
  resolveTngFlowStatusTone,
} from './tng-flow-node.component';

const specDirectory = dirname(fileURLToPath(import.meta.url));
const nodeStyles = readFileSync(resolve(specDirectory, 'tng-flow-node.component.css'), 'utf8');

describe('TngFlowNodeComponent', () => {
  it('maps agent execution states to semantic tones', () => {
    expect(resolveTngFlowStatusTone('completed')).toBe('success');
    expect(resolveTngFlowStatusTone('failed')).toBe('danger');
    expect(resolveTngFlowStatusTone('running')).toBe('info');
    expect(resolveTngFlowStatusTone('awaiting-input')).toBe('warning');
    expect(resolveTngFlowStatusTone('custom')).toBe('neutral');
  });

  it('maps status-driven progress to completed, running, and fallback states', () => {
    expect(resolveTngFlowNodeProgressState('completed', null, false, 'status-driven')).toEqual({
      indeterminate: false,
      value: 100,
      visible: true,
    });
    expect(resolveTngFlowNodeProgressState('running', 58, true, 'status-driven')).toEqual({
      indeterminate: true,
      value: 0,
      visible: true,
    });
    expect(resolveTngFlowNodeProgressState('queued', 58, true, 'status-driven')).toEqual({
      indeterminate: false,
      value: 0,
      visible: true,
    });
  });

  it('renders status, progress, and validation presentation', () => {
    const fixture = TestBed.createComponent(TngFlowNodeComponent);
    fixture.componentRef.setInput('name', 'Research agent');
    fixture.componentRef.setInput('description', 'Collect relevant sources.');
    fixture.componentRef.setInput('status', 'failed');
    fixture.componentRef.setInput('progress', 140);
    fixture.componentRef.setInput('selected', true);
    fixture.componentRef.setInput('disabled', true);
    fixture.componentRef.setInput('invalid', true);
    fixture.componentRef.setInput('message', 'Missing credentials');
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const header = host.querySelector<HTMLElement>('.tng-flow-node__header');
    const status = host.querySelector<HTMLElement>('.tng-flow-node__status');
    const progress = host.querySelector('tng-progress-bar');

    expect(host.getAttribute('data-validation')).toBe('error');
    expect(host.getAttribute('aria-invalid')).toBe('true');
    expect(host.hasAttribute('data-selected')).toBe(true);
    expect(host.hasAttribute('data-disabled')).toBe(true);
    expect(header?.hasAttribute('data-has-icon')).toBe(false);
    expect(status?.textContent?.trim()).toBe('failed');
    expect(status?.getAttribute('data-tone')).toBe('danger');
    expect(progress).not.toBeNull();
    expect(host.textContent).toContain('Missing credentials');
  });

  it('uses explicit progress mode without status-driven indeterminate progress', () => {
    const fixture = TestBed.createComponent(TngFlowNodeComponent);
    fixture.componentRef.setInput('name', 'Research agent');
    fixture.componentRef.setInput('status', 'running');
    fixture.componentRef.setInput('progressDisplayMode', 'explicit');
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('tng-progress-bar')).toBeNull();

    fixture.componentRef.setInput('progressSpecified', true);
    fixture.componentRef.setInput('progress', null);
    fixture.detectChanges();

    expect(host.querySelector('tng-progress-bar')).not.toBeNull();
  });

  it('keeps completed status text visually hidden while exposing progress semantics', () => {
    const fixture = TestBed.createComponent(TngFlowNodeComponent);
    fixture.componentRef.setInput('name', 'Research agent');
    fixture.componentRef.setInput('status', 'completed');
    fixture.componentRef.setInput('statusMessage', 'Completed successfully');
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const progressRoot = host.querySelector<HTMLElement>('[data-slot="progress-bar"]');

    expect(host.querySelector('.tng-flow-node__message')).toBeNull();
    expect(progressRoot?.getAttribute('data-state')).toBe('determinate');
    expect(progressRoot?.getAttribute('aria-valuenow')).toBe('100');
    expect(progressRoot?.getAttribute('aria-valuetext')).toBe('Completed successfully, 100%');
    expect(host.querySelector('.tng-flow-node__progress-label')).toBeNull();
    expect(host.textContent).not.toContain('Completed successfully');
    expect(nodeStyles).toMatch(
      /\[data-status='completed'\][^{]*\{[^}]*--tng-progress-bar-indicator:\s*var\(--tng-semantic-accent-success/s,
    );
  });

  it('renders running progress as indeterminate and every other status at 0%', () => {
    const fixture = TestBed.createComponent(TngFlowNodeComponent);
    fixture.componentRef.setInput('name', 'Research agent');
    fixture.componentRef.setInput('status', 'running');
    fixture.componentRef.setInput('progress', 72);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    let progressRoot = host.querySelector<HTMLElement>('[data-slot="progress-bar"]');
    expect(progressRoot?.getAttribute('data-state')).toBe('indeterminate');
    expect(progressRoot?.getAttribute('aria-valuenow')).toBeNull();

    fixture.componentRef.setInput('status', 'queued');
    fixture.detectChanges();

    progressRoot = host.querySelector<HTMLElement>('[data-slot="progress-bar"]');
    expect(progressRoot?.getAttribute('data-state')).toBe('determinate');
    expect(progressRoot?.getAttribute('aria-valuenow')).toBe('0');
    expect(host.querySelector('.tng-flow-node__progress-value')).toBeNull();
  });

  it('propagates a consumer minimum height to the card host', () => {
    const fixture = TestBed.createComponent(TngFlowNodeComponent);
    fixture.nativeElement.style.minHeight = '116px';
    fixture.componentRef.setInput('name', 'Merge decision');
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const cardHost = host.querySelector<HTMLElement>('tng-card.tng-flow-node');
    const cardSurface = cardHost?.querySelector<HTMLElement>('article.tng-card');

    expect(cardHost).not.toBeNull();
    expect(cardSurface).not.toBeNull();
    expect(nodeStyles).toMatch(/\.tng-flow-node\s*{[^}]*min-height:\s*inherit;/s);
  });
});
