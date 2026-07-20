# Solana Lab

A monorepo of Solana smart contracts (Anchor/Rust), orchestrated with
[Turborepo](https://turbo.build) and [Bun](https://bun.sh).

Each contract lives in its own folder under `contracts/` as a fully
independent Anchor workspace — its own program keypair, its own `Cargo.toml`,
its own tests. Turborepo caches and orchestrates `build`/`test`/`lint` across
all of them so adding contract #20 doesn't slow down testing contract #1.

## Stack

| Tool      | Role                                      |
|-----------|--------------------------------------------|
| Rust      | Program language                          |
| Anchor    | Solana program framework                  |
| Bun       | Package manager + test runner (`bun:test`)|
| Turborepo | Task orchestration & caching              |

## Structure

```
solana-forge/
├── contracts/
│   ├── native/hello-world/     
│   └── anchor/counter/
├── docs/
│   ├── architecture.md
│   └── adr/
├── scripts/new-contract.sh
├── .husky/{pre-commit,commit-msg}
├── .vscode/{settings.json,extensions.json}
├── .github/
│   ├── workflows/{ci.yml,commitlint.yml}
│   ├── dependabot.yml
│   ├── CODEOWNERS
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/{bug_report.yml,feature_request.yml}
├── biome.json
├── commitlint.config.js
├── deny.toml
├── rust-toolchain.toml
├── rustfmt.toml
├── turbo.json
├── package.json
├── README.md
├── CONTRIBUTING.md
└── SECURITY.md
```

## Prerequisites

- WSL2 (Ubuntu) if on Windows
- Rust, Solana CLI (Agave), Anchor CLI, Bun

Full install steps: see [`SETUP_GUIDE.md`](./SETUP_GUIDE.md).

## Getting started

```bash
bun install
bun run build   # turbo run build — builds every contract
bun run test    # turbo run test — tests every contract
```

Run a single contract instead of the whole repo:

```bash
cd contracts/counter
anchor test
```

## Adding a new contract

```bash
bun run new <contract-name>
```

This scaffolds a fresh Anchor project under `contracts/<name>` wired up for
Bun testing and picked up automatically by Turborepo — no root config changes
needed.

## Scripts

| Command          | What it does                                   |
|-------------------|-------------------------------------------------|
| `bun run build`   | Builds every contract (`anchor build`)          |
| `bun run test`    | Tests every contract (`anchor test`, via `bun:test`) |
| `bun run lint`    | `cargo fmt --check && cargo clippy` per contract |
| `bun run clean`   | `anchor clean` per contract                     |
| `bun run new`     | Scaffold a new contract                         |

## License

MIT

