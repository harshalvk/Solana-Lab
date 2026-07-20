# Security Policy

## Scope

This policy covers the on-chain programs in this repository
(`contracts/native/*`, `contracts/anchor/*`) and their deployment
configuration.

## Reporting a vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

If you find a bug that could affect the security of a deployed program
(fund loss, unauthorized state mutation, privilege escalation, denial of
service, etc.), please report it privately:

- Email: `security@<your-domain-or-github-username>.dev` — replace this
  with a real contact before your first mainnet deploy.
- Alternatively, use [GitHub's private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing/privately-reporting-a-security-vulnerability)
  (Security tab → "Report a vulnerability").

Please include:

- Which contract(s) are affected and their deployed program ID (if any)
- Steps to reproduce, or a proof-of-concept transaction
- Impact assessment (what an attacker could do)

## Response

We aim to acknowledge reports within 48 hours and provide a fix timeline
once the issue is confirmed. Please give us reasonable time to patch and
redeploy before any public disclosure.

## Program upgrade authority

Deployed program upgrade authorities and multisig details, if applicable,
are documented separately per contract in its `README.md` — not here, since
this file is public and that information should only note *where* to find
it, not the keys themselves.