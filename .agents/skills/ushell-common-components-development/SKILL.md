---
name: ushell-common-components-development
description: Implementation-specific entry skill for UShell.CommonComponents.JS (npm ushell-common-components). Use before changing code, build or docs in this repository. Contains only implementation details (layout, build, versioning, local rules). All U-Shell design knowledge and the requirements for this layer live in the root skills of ProjectUShell/UShell.Docs, which must always be loaded as well.
---

# UShell.CommonComponents.JS - implementation details

> **This skill covers implementation details only.** The U-Shell target state, the
> requirements for this layer (what is generic, what is not), compatibility rules and backlog
> live in **UShell.Docs** (root level of the U-Shell skill set). Always load them first:
>
> - `ushell-architecture` (mandatory root entry)
> - `ushell-common-components` (requirements and catalog for this layer)
> - plus, depending on the task: `ushell-widget-contract`, `ushell-data-auth-scope`, `ushell-interaction-dynamics`, `ushell-server-commands`
>
> Location: sibling checkout `../UShell.Docs/.agents/skills/<name>/SKILL.md`, otherwise
> https://github.com/ProjectUShell/UShell.Docs/tree/master/.agents/skills
>
> Design knowledge discovered while working here goes into those skills, not into this file.

## Repository layout

- `src/_Atoms`, `src/_Molecules`, `src/_Organisms` - shared primitives (dialogs, menus, filters, `EntitySelection`, `TabControl`, ...).
- `src/components/` - larger generic components: `Table`, `guifad` (generic entity browser/editor), `report`, `schema-editor`, `dashboard`, `card-board`, `shell-layout`.
- `src/data/` - data connectors and transports (`FuseDataStore`, `FuseConnector`, `ServiceFactory`/`createServiceProxy`, local and object-graph datasources, `LocalWidgetHost`).
- `src/demo/` - demos per component.
- `src/[Move2LayoutDescription]`, `src/[Move2Logging]` - code planned to move to separate packages. Do not extend; ask before moving.
- `guidelines.md` - coding and structure guidelines (atomic design, PascalCase components, Tailwind). Follow them.

## Public API surface

`src/index.tsx` is the entire surface of npm `ushell-common-components`. A component that
exists in `src/` but is not re-exported there does not exist for consumers.

Status 2026-10-19 (`6eee61e`): the surface is **incomplete**. Not exported, although present
and listed as available in the layer skill `ushell-common-components`:

- `LocalWidgetHost` (`src/data/LocalWidgetHost.ts`)
- `GuifadModule`, `EntityTableModule` (`src/components/guifad/_Templates/`)
- `EntitySelection`, `MultiPanelLayout` (`src/_Organisms/`)
- `Dialog`, `Notification`, `LoadingScreen`, `ErrorScreen`, `TreeView` (`src/_Molecules/`)
- `components/schema-editor`, `components/dashboard`, `components/card-board`
- most of `src/data/`: `FuseConnector`, `GenericFuseFxRepositoryConnector`,
  `LocalDataSourceManager`, `LocalStoreDataSource`, `ObjectGraphDataSource*`,
  `EntitySchemaService`, `DataSourceService`, `FuseDataSourceMethod`

This blocks a documented workflow: module authors are told to develop widgets stand-alone with
`LocalWidgetHost`, which they cannot import. Tracked as UB-85 / DD-04 in `UShell.Docs`.

**Deep imports are not a workaround.** ReactFrontend currently reaches the missing components
through `ushell-common-components/dist/cjs/...`. That is debt (DD-05), not a pattern: a deep
**CJS** import into a federated module bundle can pull a second React instance into the page
and breaks the shared-singleton rule of U-Shell hosting. When a consumer needs a component,
export it here instead.

Adding an export is additive and never breaking. When adding one:

1. Re-export from `src/index.tsx` (both the default and any named types consumers need).
2. Check that the component takes everything through props, `IWidget`/`IWidgetHost`,
   `IDataSource` or callbacks - exporting it makes its signature a public contract.
3. Mention the new export in the commit message so the KVU minor increment is justified.

## Widget wrappers and their UnitOfWork contract

The `*Module` wrappers in `src/components/guifad/_Templates/` are the adapters between the
U-Shell widget contract and the plain components. Two things about them are easy to get wrong:

- They take the prop **`widget: IWidget`**. A federated remote widget loaded by the shell
  receives a single prop named **`inputData`** instead. The wrappers are therefore not a
  template for writing a remote widget (DD-01).
- Each wrapper reads a **fixed set of UnitOfWork fields**. That set is the contract a
  `module.json` author writes against, so renaming one breaks deployed portfolios. Additive
  alias fields only.

| Wrapper / widget name | Reads from the UoW | Writes back |
|---|---|---|
| `GuifadModule` (`guifad`) | `entityName`, `record`, `layoutDescription` | yes, via `populateChangedState` |
| `EntityTableModule` | `entityName`, `layoutDescription`, `pageSizes` (default `[50,100,200,500]`) | no |
| `GuifadFuse` (`guifadFuse`) | `fuseUrl`, `rootEntityName`, `routePattern` (default `"body"`) | no |
| `EntitySelection` (`scopeSelection`) | `entityName`, `scopeKey`, `layoutDescription` | no |

`GuifadFuse` taking a backend URL out of the UoW contradicts the U-Shell rule that widgets
never hold service URLs (DD-03, UB-88). Do not extend that pattern to new components.

## Build and versioning

- `npm run build` builds ESM (`dist/esm`) and CJS (`dist/cjs`) plus Tailwind output.
- Published version is controlled by KVU in `vers/` (`versioninfo.json`). The `version` in `package.json` is not the published version (it reads `1.0.23` while consumers are on `1.3.x`): never reason about compatibility from it. **Never edit `vers/changelog.md`.**

## Local rules

- No business knowledge, no shell orchestration, no token acquisition or storage, no global state reads. Receive everything via props, `IWidget`/`IWidgetHost`, `IDataSource` or callbacks.
- Transport changes stay backwards compatible: new options are optional parameters next to existing ones; response shapes (`{ return, fault }`) do not change.
- Any widget-contract change in `ushell-modulebase` must be reflected in `LocalWidgetHost`.
- A new component is only delivered once it is exported from `src/index.tsx` (see **Public API surface**).
- Reference backlog IDs (`UB-xx` from `UShell.Docs/doc/backlog.md`) in commit messages and PR descriptions. Known debt of this layer is inventoried as `DD-xx` in `UShell.Docs/.agents/skills/ushell-design-debt`.
