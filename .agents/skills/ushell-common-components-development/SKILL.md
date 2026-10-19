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

## Build and versioning

- `npm run build` builds ESM (`dist/esm`) and CJS (`dist/cjs`) plus Tailwind output.
- Published version is controlled by KVU in `vers/` (`versioninfo.json`). The `version` in `package.json` is not the published version. **Never edit `vers/changelog.md`.**

## Local rules

- No business knowledge, no shell orchestration, no token acquisition or storage, no global state reads. Receive everything via props, `IWidget`/`IWidgetHost`, `IDataSource` or callbacks.
- Transport changes stay backwards compatible: new options are optional parameters next to existing ones; response shapes (`{ return, fault }`) do not change.
- Any widget-contract change in `ushell-modulebase` must be reflected in `LocalWidgetHost`.
- Reference backlog IDs (`UB-xx` from `UShell.Docs/doc/backlog.md`) in commit messages and PR descriptions.
