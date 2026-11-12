# `@tailng-ui/ai` CI/CD Integration Plan

Status: Proposed; implementation has not started

Last reviewed: 2026-11-12

Target package: `@tailng-ui/ai`

Target workflow: `.github/workflows/prod-build-deploy.yml`

Release model: npm Trusted Publishing from GitHub Actions

## Tracking convention

- `[ ]` marks an open implementation item, test, release gate, or externally configured prerequisite.
- `[x]` is used only after evidence proves the stated completion condition.
- Each production change follows Red, Green, Refactor: first add the named failing test, observe the
  intended failure, implement the minimum behavior, then run the relevant regression suite.
- Existing package cases in
  [`tests/security-packaging-integration.md`](./tests/security-packaging-integration.md) remain the
  source of truth for package behavior. This document adds only release-orchestration cases.

## Goal

Integrate `@tailng-ui/ai` into TailNG's existing production release pipeline so a maintainer can
select `ai`, verify the exact packed artifact, publish it to npm through OIDC, and safely resume or
reconcile an interrupted release.

The integration is complete only when selecting `ai` cannot silently skip its build, tests,
artifact checks, smoke consumers, or publish operation.

## Decisions

- Reuse `.github/workflows/prod-build-deploy.yml`; do not create a second AI-only release workflow.
- Register `ai` as an Angular Package Format package in the shared release catalog.
- Treat `@tailng-ui/ai/ag-ui` as a required secondary entry point of the same npm package.
- Give AI an explicit test-matrix entry so its result is visible in GitHub Actions.
- Use npm Trusted Publishing with GitHub OIDC; do not add a long-lived npm write token.
- Protect publishing with the existing `production` GitHub environment and its approval rules.
- Run clean build, pack inspection, and packed-consumer tests before any external publish operation.
- Make the release scripts fail closed for unknown or unhandled selected targets.
- Make interrupted and partially completed releases resumable without accidentally bumping again.
- Publish `0.1.0` on the `alpha` dist-tag first. The version itself intentionally has no
  prerelease suffix; move that same immutable version to `latest` only after the stable-release
  gates in this plan and the main AI delivery plan are satisfied.

## Current baseline

The repository already has a strong shared release workflow: manual dispatch, main-branch
validation, test jobs, clean builds, version updates, packed-artifact assertions, an Angular
consumer smoke test, npm publication, Git tags, and GitHub releases.

The audit identified these AI-specific gaps:

- `ai` is absent from the workflow target choices and defaults.
- `ai` is absent from `tools/release/package-catalog.mjs` and the test-matrix resolver.
- the bundle assertion does not require the `./ag-ui` secondary entry point.
- the packed Angular consumer does not import either AI entry point.
- release validation rejects `ai`, while some later scripts can currently treat it as an empty
  selection and finish successfully; this is a silent no-op risk.
- the source package is intentionally set to `0.1.0`; the initial publication must preserve that
  exact version and use the npm `alpha` dist-tag instead of applying another automatic version bump.

Existing baseline evidence is encouraging but is not a release approval: the AI tests, direct
package build, and `npm pack --dry-run` passed during planning. CI must reproduce those checks from
a clean checkout and verify the exact tarball that will be published.

## Scope

In scope:

- GitHub Actions orchestration for selecting, testing, building, verifying, and publishing AI.
- shared release-script catalog, validation, matrix, bundle, pack, and smoke-consumer behavior.
- npm Trusted Publishing and provenance prerequisites.
- preview release, stable promotion, retry, and reconciliation procedures.
- traceable tests for every CI/CD-specific behavior.

Out of scope:

- changing AI component or protocol behavior.
- adding a second package for the AG-UI adapter.
- publishing directly from developer laptops.
- auto-publishing on every merge to `main`.
- using a long-lived npm automation token as a hidden fallback.
- declaring the AI product stable while its product-level release gates remain open.

## Target release topology

```text
workflow_dispatch
  target=ai, version=0.1.0, dist-tag=alpha, mode=publish
             |
             v
  validate target + resolve test matrix
             |
             v
       test:ai in clean CI
             |
             v
  validate explicit initial version (0.1.0)
             |
             v
  clean Nx/ng-packagr build
             |
             v
  verify exports, declarations, dependency boundaries
             |
             v
  npm pack + tarball allowlist + consumer projects
             |
             v
  protected production environment approval
             |
             v
  npm OIDC publish with provenance, dist-tag=alpha
             |
             v
  release commit/tag/GitHub Release reconciliation
```

## Planned release-catalog entry

The catalog record will use the repository's existing schema with these values:

| Field                     | Planned value                    |
| ------------------------- | -------------------------------- |
| target                    | `ai`                             |
| npm package               | `@tailng-ui/ai`                  |
| Nx project                | `ai`                             |
| source manifest           | `libs/tailng-ui/ai/package.json` |
| distribution directory    | `dist/libs/tailng-ui/ai`         |
| Angular Package Format    | `true`                           |
| published `sideEffects`   | `false`                          |
| required secondary export | `./ag-ui`                        |

The primary entry point must remain usable without installing `@ag-ui/core`. The `./ag-ui` entry
point must be tested with a compatible peer installed and must give a clear dependency failure when
the consumer attempts to use it without that peer.

## TDD orchestration test catalog

These cases supplement, rather than replace, the existing `AI-PKG-*` cases.

### Catalog and target selection

| Done | ID              | Scenario                                       | Expected evidence                                                                                                         | Level            |
| ---- | --------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| [x]  | AI-CICD-CAT-001 | Validate a release request with target `ai`.   | Validation accepts `ai` and returns exactly one catalog package.                                                          | unit             |
| [x]  | AI-CICD-CAT-002 | Resolve the `ai` catalog record.               | Package name, project, source manifest, dist directory, APF flag, and side-effects flag exactly match the planned record. | unit             |
| [ ]  | AI-CICD-CAT-003 | Select `ai` with another valid target.         | Both are selected once in deterministic dependency-safe order.                                                            | unit             |
| [ ]  | AI-CICD-CAT-004 | Pass an unknown target to every release stage. | Validate, build, verify, assert, pack, and publish stages fail non-zero; none reports success with an empty selection.    | unit/integration |
| [ ]  | AI-CICD-CAT-005 | Pass duplicate or whitespace-padded targets.   | Input is normalized or rejected consistently without duplicate publication.                                               | unit             |

### Test matrix and workflow contract

| Done | ID              | Scenario                                               | Expected evidence                                                                              | Level                |
| ---- | --------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | -------------------- |
| [x]  | AI-CICD-MAT-001 | Resolve the test matrix for target `ai`.               | A visible AI matrix entry containing `test:ai` is returned.                                    | unit                 |
| [ ]  | AI-CICD-MAT-002 | Resolve a multi-target request containing `ai`.        | AI tests run exactly once and other selected suites remain present.                            | unit                 |
| [ ]  | AI-CICD-MAT-003 | Inspect workflow inputs.                               | Target help/default includes `ai`; bump, dist-tag, and safe verification mode are unambiguous. | workflow/static      |
| [ ]  | AI-CICD-MAT-004 | Run the AI matrix job from a clean checkout.           | `test:ai` passes without relying on developer caches or previously built `dist` files.         | CI                   |
| [ ]  | AI-CICD-MAT-005 | Make `test:ai` fail intentionally in the test fixture. | Build and publish jobs are not eligible to run.                                                | workflow/integration |

### Build, bundle, and pack verification

| Done | ID              | Scenario                                           | Expected evidence                                                                                                        | Level            |
| ---- | --------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| [ ]  | AI-CICD-BLD-001 | Build selected target `ai` from a clean workspace. | `dist/libs/tailng-ui/ai` is freshly produced and non-empty.                                                              | integration      |
| [ ]  | AI-CICD-BLD-002 | Inspect the primary APF output.                    | ESM runtime, declarations, manifest exports, README, and licenses required by policy are present.                        | package          |
| [x]  | AI-CICD-BLD-003 | Inspect the secondary entry point.                 | `./ag-ui` runtime and declarations are present and addressable only through documented exports.                          | package          |
| [ ]  | AI-CICD-BLD-004 | Inspect the package tarball.                       | No source-only, cache, secret, workspace-only, or unintended private-path files are included.                            | package/security |
| [ ]  | AI-CICD-BLD-005 | Inspect dependency metadata.                       | `tslib` and optional `@ag-ui/core` peer metadata match package policy; no Mastra dependency is published.                | package          |
| [ ]  | AI-CICD-BLD-006 | Compare verified directory with packed tarball.    | Consumer tests install the same tarball intended for publication, identified by name, version, size, and SHA-256 digest. | integration      |
| [ ]  | AI-CICD-BLD-007 | Delete or corrupt `./ag-ui` output in the fixture. | Bundle assertion fails before the production environment or publish stage.                                               | integration      |

### Packed-consumer verification

| Done | ID              | Scenario                                                                  | Expected evidence                                                                | Level               |
| ---- | --------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------- |
| [ ]  | AI-CICD-CON-001 | Install only the packed primary package in a minimal consumer.            | Primary imports, TypeScript, and runtime/build smoke pass without `@ag-ui/core`. | package/integration |
| [ ]  | AI-CICD-CON-002 | Install the packed package plus a compatible `@ag-ui/core`.               | `@tailng-ui/ai/ag-ui` imports, types, and production build pass.                 | package/integration |
| [ ]  | AI-CICD-CON-003 | Import `./ag-ui` without its peer.                                        | Installation or build fails with a clear peer/dependency diagnostic.             | package             |
| [ ]  | AI-CICD-CON-004 | Consume both entry points from Node ESM and TypeScript NodeNext fixtures. | All documented imports resolve without private deep imports.                     | package/type        |
| [ ]  | AI-CICD-CON-005 | Consume the tarball from a minimal Vitest fixture.                        | Test transformation and runtime import pass.                                     | package/integration |
| [ ]  | AI-CICD-CON-006 | Consume the tarball from a strict Angular production application.         | AOT/production build passes with the supported Angular version policy.           | package/integration |
| [ ]  | AI-CICD-CON-007 | Run the primary-only consumer with no network after installation.         | Import does not fetch or dynamically require the optional adapter peer.          | integration         |

### Version, publish, and idempotency

| Done | ID              | Scenario                                                         | Expected evidence                                                                                                             | Level                |
| ---- | --------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| [ ]  | AI-CICD-PUB-001 | Plan the initial AI alpha publication.                           | Explicit version `0.1.0` is preserved everywhere, `alpha` is only the dist-tag, and the workflow does not apply another bump. | unit                 |
| [ ]  | AI-CICD-PUB-002 | Run the whole workflow in verify-only mode.                      | Every test/build/pack/consumer stage runs; no Git push, npm publish, dist-tag change, tag, or GitHub Release occurs.          | workflow/integration |
| [ ]  | AI-CICD-PUB-003 | Run publish dry-run for `ai` and `next`.                         | Summary shows the exact public-package publish operation and never reports success for an empty selection.                    | integration          |
| [ ]  | AI-CICD-PUB-004 | Publish a package version not yet on npm.                        | `@tailng-ui/ai@version` is public, has `alpha`, and contains registry provenance.                                             | external/CI          |
| [ ]  | AI-CICD-PUB-005 | Rerun after that exact version was published.                    | Script verifies the existing artifact and fixes/validates the requested dist-tag without publishing a new version.            | integration/external |
| [ ]  | AI-CICD-PUB-006 | Simulate a multi-package release that stops after AI publishes.  | Rerun skips matching completed packages and continues remaining packages.                                                     | integration          |
| [ ]  | AI-CICD-PUB-007 | Existing npm version has a different tarball digest or metadata. | Reconciliation stops for human review instead of silently treating it as equivalent.                                          | integration/security |
| [ ]  | AI-CICD-PUB-008 | Promote approved `0.1.0` from `alpha` to `latest`.               | No rebuild or republish occurs; the reviewed immutable version receives the stable tag.                                       | external/CI          |

### OIDC, permissions, and supply-chain controls

| Done | ID               | Scenario                                           | Expected evidence                                                                                          | Level             |
| ---- | ---------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------- |
| [ ]  | AI-CICD-OIDC-001 | Inspect the publish job.                           | It runs on a GitHub-hosted runner with `id-token: write` and only the minimum other permissions.           | workflow/static   |
| [ ]  | AI-CICD-OIDC-002 | Inspect tool versions before publish.              | Node is at least `22.14`; OIDC dist-tag work uses npm `11.21.0+` on major 11 or `12.2.0+` on major 12.     | CI                |
| [ ]  | AI-CICD-OIDC-003 | Match npm trusted-publisher configuration.         | Owner/repository, `prod-build-deploy.yml`, and `production` environment exactly match the workflow claims. | external/manual   |
| [ ]  | AI-CICD-OIDC-004 | Search workflow and repository secrets usage.      | No long-lived npm write token is required or exposed to the publish job.                                   | workflow/security |
| [ ]  | AI-CICD-OIDC-005 | Inspect the registry entry after publish.          | npm displays provenance linking the package to the expected repository and workflow run.                   | external/manual   |
| [ ]  | AI-CICD-OIDC-006 | Attempt publish from an untrusted fork/PR context. | Protected environment and OIDC claim matching prevent publication.                                         | workflow/security |
| [ ]  | AI-CICD-OIDC-007 | Emit workflow logs and summaries.                  | Secrets, OIDC tokens, auth headers, and registry credentials are absent.                                   | CI/security       |

### Failure recovery and observability

| Done | ID              | Scenario                                                                    | Expected evidence                                                                                                                 | Level                |
| ---- | --------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| [ ]  | AI-CICD-REC-001 | Verification fails before external mutation.                                | No version commit, push, registry mutation, tag, or GitHub Release occurs.                                                        | workflow/integration |
| [ ]  | AI-CICD-REC-002 | Workflow stops after a release commit is pushed but before npm publication. | Resume mode reuses the planned version; it does not create another version bump.                                                  | integration          |
| [ ]  | AI-CICD-REC-003 | npm publish succeeds but Git tag or GitHub Release fails.                   | Reconciliation creates the missing Git metadata for the same immutable version without republishing.                              | integration          |
| [ ]  | AI-CICD-REC-004 | Git metadata exists but npm publication does not.                           | Runbook identifies the mismatch and resumes the exact package/version after approval.                                             | integration/manual   |
| [ ]  | AI-CICD-REC-005 | A release is cancelled at each major stage.                                 | Summary states completed mutations, pending actions, and the safe resume command/input.                                           | workflow/integration |
| [ ]  | AI-CICD-OBS-001 | A verify or publish run completes.                                          | Job summary includes target, version, dist-tag, tarball digest, test results, registry URL when applicable, and commit/tag state. | workflow             |
| [ ]  | AI-CICD-OBS-002 | Retain release evidence.                                                    | Pack manifest, checksums, test reports, and consumer logs are uploaded with a documented retention period.                        | workflow             |

## Implementation phases

### Phase 0: Freeze the release contract

- [ ] Review and approve reuse of `prod-build-deploy.yml` and the `ai` catalog record.
- [ ] Confirm that the first external release is version `0.1.0` with dist-tag `alpha`.
- [ ] Confirm whether `@tailng-ui/ai` already exists on npm and that the TailNG organization owns the
      scope and package name.
- [ ] Decide and document the npm-supported bootstrap procedure if this is the package's first
      publication; do not embed a permanent token fallback in the workflow.
- [ ] Define the supported Node, npm, Angular, TypeScript, and `@ag-ui/core` versions for release
      consumers.
- [ ] Define exact release-state fields used to resume a run: commit, package, version, tarball digest,
      dist-tag, npm status, Git tag status, and GitHub Release status.
- [ ] Map every item in this document to an owner and pull request before implementation starts.

Exit gate:

- [ ] Release contract and external ownership prerequisites are approved.
- [ ] No open decision can change the public package name, version, dist-tag, workflow identity, or
      recovery semantics.

### Phase 1: Add failing release-script tests

- [ ] Add executable tests for `AI-CICD-CAT-*` and observe the intended failures.
- [ ] Add executable tests for `AI-CICD-MAT-*` and observe the intended failures.
- [ ] Add fixture-based tests proving an unhandled selected target fails in every release stage.
- [ ] Add a regression test for the current silent publish no-op risk.
- [ ] Record Red-step evidence in the pull request or CI run linked to each case ID.

Exit gate:

- [ ] All Phase 1 tests fail only because AI catalog/matrix support and fail-closed handling are
      missing.

### Phase 2: Register AI and make selection fail closed

- [ ] Add the approved AI record to `tools/release/package-catalog.mjs`.
- [ ] Add `ai` to the workflow target description and the intended default target set.
- [ ] Add an explicit AI group to `tools/release/resolve-test-matrix.mjs`.
- [ ] Make validate, build, verify, assert, pack, and publish stages reject selected targets they do
      not handle.
- [ ] Make all stages reject a non-empty request that resolves to zero packages.
- [ ] Run the catalog/matrix regression suites and mark their case IDs only after Green evidence.

Exit gate:

- [ ] `ai` selection is deterministic and no selected target can succeed as a silent no-op.
- [ ] `test:ai` is a required upstream gate for an AI publication.

### Phase 3: Verify the AI artifact

- [ ] Add the `./ag-ui` secondary export requirement to bundle assertions.
- [ ] Verify primary and secondary declarations and ESM bundles from a clean build.
- [ ] Verify published dependencies, optional peer metadata, side-effects metadata, and absence of
      Mastra/provider dependencies.
- [ ] Pack AI once, compute its SHA-256 digest, and pass that same tarball to every consumer test.
- [ ] Add tarball content and size policies with useful failure output.
- [ ] Run `AI-CICD-BLD-*` plus the existing `AI-PKG-CORE-*` and `AI-PKG-AGUI-*` cases.

Exit gate:

- [ ] A missing, stale, malformed, or unexpectedly large AI artifact blocks publication.
- [ ] The verified artifact and the publish candidate are byte-identical.

### Phase 4: Expand packed-consumer smoke tests

- [ ] Add a primary-only consumer that deliberately omits `@ag-ui/core`.
- [ ] Add an adapter consumer with a supported `@ag-ui/core` version.
- [ ] Add the documented failure fixture for adapter import without its peer.
- [ ] Add Node ESM, TypeScript NodeNext, Vitest, and strict Angular production consumers.
- [ ] Run supported minimum/maximum Angular consumers according to package policy.
- [ ] Run `AI-CICD-CON-*` plus the existing `AI-PKG-NG-*` cases.

Exit gate:

- [ ] The packed primary and optional adapter work in all supported consumer shapes.
- [ ] Consumer tests never import from the workspace source tree or an unpacked `dist` directory.

### Phase 5: Make release orchestration safe and resumable

- [ ] Add a verify-only workflow mode that performs all local checks without external mutation.
- [ ] Calculate and persist the release plan before any version/Git/npm mutation.
- [ ] Prevent a pre-publish verification failure from pushing a release version commit.
- [ ] Add resume behavior that detects an existing planned version instead of bumping again.
- [ ] Compare an already-published version with the planned package identity/digest before treating it
      as complete.
- [ ] Add reconciliation for missing npm dist-tag, Git tag, and GitHub Release state.
- [ ] Publish an explicit mutation/recovery summary even for cancellation or partial failure.
- [ ] Run `AI-CICD-PUB-001..003`, `AI-CICD-PUB-005..007`, and `AI-CICD-REC-*` with local fixtures or
      mocks before using the real registry.

Exit gate:

- [ ] Every partial-failure state has a tested safe resume or a deliberate human-review stop.
- [ ] A rerun cannot accidentally skip AI, bump twice, republish a changed tarball at the same
      version, or tag the wrong commit.

### Phase 6: Configure trusted publishing

- [ ] Confirm the workflow runs on GitHub-hosted runners.
- [ ] Limit publish-job permissions and retain `id-token: write`.
- [ ] Pin/assert supported Node and npm versions before requesting an OIDC token.
- [ ] Configure npm Trusted Publishing for the exact GitHub owner/repository, workflow filename, and
      `production` environment.
- [ ] Allow the required npm operations, including `npm dist-tag` if the reconciliation script uses
      it.
- [ ] Configure `production` environment protection for `main`, required review, and appropriate
      deployment controls.
- [ ] Remove any dependency on a long-lived npm write token; document separately if a read-only token
      is required for private installation dependencies.
- [ ] Schedule the first successful pilot publication within npm's allowed activation window after a
      newly created trusted-publisher configuration.

Exit gate:

- [ ] `AI-CICD-OIDC-*` passes and the publish job can authenticate only through the intended trusted
      workflow identity.

### Phase 7: Run the preview release

- [ ] Run verify-only from a clean `main` commit with target `ai`, explicit version `0.1.0`, and
      dist-tag `alpha`.
- [ ] Review tests, packed manifest, tarball digest, dependency metadata, consumer results, and
      planned `0.1.0` version.
- [ ] Approve the protected production deployment only after verify-only evidence passes.
- [ ] Publish `@tailng-ui/ai@0.1.0` to `alpha` through OIDC.
- [ ] Confirm registry provenance, public visibility, exports, optional peer metadata, README, license,
      and tarball contents.
- [ ] Install `@tailng-ui/ai@next` in a clean external Angular smoke application and exercise primary
      and AG-UI imports.
- [ ] Confirm release commit, Git tag, GitHub Release, and npm version all reference the same version
      and source commit.
- [ ] Exercise an idempotent rerun or non-mutating reconciliation against the completed preview.

Exit gate:

- [ ] The immutable preview is installable, traceable to CI, reproducible from its source commit, and
      recoverable through the documented runbook.

### Phase 8: Promote to stable

- [ ] Close or explicitly defer every stable blocker in the AI delivery plan.
- [ ] Make all non-deferred `AI-PKG-*` and `AI-CICD-*` cases green.
- [ ] Complete accessibility, security, long-thread performance, AG-UI conformance, documentation,
      and Mastra reference-integration release gates.
- [ ] Review preview feedback and confirm no public-contract correction requires a new version.
- [ ] Promote the already verified immutable `0.1.0` artifact from `alpha` to `latest` without
      rebuilding or republishing it.
- [ ] Publish release notes with the supported Angular and AG-UI ranges, conformance profile, known
      limitations, and migration policy.

Exit gate:

- [ ] `@tailng-ui/ai` is publish-ready for stable use according to the definition below.

## Failure and recovery policy

| Observed state                                 | Required response                                                                   |
| ---------------------------------------------- | ----------------------------------------------------------------------------------- |
| Tests/build/pack fail before mutation          | Fix and rerun verify-only; no version or release state should exist.                |
| Release commit exists, npm version absent      | Resume the recorded version and digest after protected approval; do not bump again. |
| Some selected npm packages exist               | Verify their identity, skip exact matches, and continue unpublished packages.       |
| npm version exists, requested dist-tag missing | Verify identity, then add only the missing permitted dist-tag.                      |
| npm version exists, Git tag/Release absent     | Reconcile Git metadata to the recorded source commit without republishing.          |
| Same npm version has an unexpected identity    | Stop; require security/release-owner review. Never overwrite an npm version.        |
| Git tag points at a different commit           | Stop; do not force-move a published release tag automatically.                      |

The implementation must preserve this table as an executable state machine where practical, with a
human runbook for states that intentionally stop.

## Definition of publish-ready

The CI/CD integration is ready to publish AI only when:

- [ ] `ai` is a valid, fully handled target in every release stage.
- [ ] AI's required test suite runs and blocks downstream work on failure.
- [ ] clean build and tarball checks cover both `.` and `./ag-ui` exports.
- [ ] primary-without-peer and adapter-with-peer packed consumers pass.
- [ ] the verified tarball is exactly the artifact sent to npm.
- [ ] verify-only mode proves that no external mutation occurs.
- [ ] OIDC trusted-publisher claims and protected-environment settings match exactly.
- [ ] no long-lived npm write credential is required.
- [ ] retry and reconciliation behavior pass their failure-injection cases.
- [ ] preview publication, provenance, clean external installation, and idempotent rerun pass.
- [ ] release evidence identifies the package, version, source commit, tarball digest, dist-tag, and
      workflow run without exposing credentials.

Stable `latest` publication additionally requires:

- [ ] every non-deferred product, package, security, performance, accessibility, documentation, and
      protocol-conformance gate in the AI plan is complete.
- [ ] the exact `0.1.0` version has been reviewed on `alpha` and is not rebuilt during dist-tag
      promotion.

## Planned files

- [ ] `.github/workflows/prod-build-deploy.yml` — target input, AI test job, verify-only mode,
      permissions, summaries, artifacts, and release/recovery orchestration.
- [ ] `tools/release/package-catalog.mjs` — AI catalog record.
- [ ] `tools/release/resolve-test-matrix.mjs` — AI test-matrix group.
- [ ] `tools/release/assert-bundles.mjs` — AI root and `./ag-ui` artifact assertions.
- [ ] `tools/release/angular-package-smoke-test.mjs` — packed AI primary and adapter imports.
- [ ] shared release-script tests/fixtures — `AI-CICD-*` catalog, no-op, publish, and recovery cases.
- [ ] `package.json` or release command documentation — discoverable verify/dry-run command if needed.
- [ ] AI documentation and release notes — installation, version ranges, provenance, and support
      policy.

File names may change during implementation, but every responsibility and test case must remain
traceable.

## External configuration checklist

- [ ] npm scope ownership and package-name availability are confirmed.
- [ ] npm Trusted Publishing points to the exact GitHub owner/repository.
- [ ] trusted workflow filename is `prod-build-deploy.yml`.
- [ ] trusted environment is `production`.
- [ ] direct publish and required dist-tag operations are allowed.
- [ ] GitHub `production` environment restricts publication to approved `main` runs.
- [ ] required reviewers and deployment branch rules are enabled.
- [ ] repository URL/casing in package metadata exactly matches GitHub.
- [ ] package visibility is public and publish access is appropriate for a scoped public package.

## References

- [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers/)
- [npm package provenance](https://docs.npmjs.com/generating-provenance-statements/)
- [GitHub Actions OIDC security reference](https://docs.github.com/en/actions/reference/security/oidc)
- [AI package test catalog](./tests/security-packaging-integration.md)
- [AI delivery and verification plan](./delivery-and-verification.md)
