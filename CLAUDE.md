# gstack

Use the `/browse` skill from gstack for all web browsing. Never use `mcp_claude-in-chrome_*` tools.

Available gstack skills:

- `/office-hours`
- `/plan-ceo-review`
- `/plan-eng-review`
- `/plan-design-review`
- `/design-consultation`
- `/design-shotgun`
- `/design-html`
- `/review`
- `/ship`
- `/land-and-deploy`
- `/canary`
- `/benchmark`
- `/browse`
- `/connect-chrome`
- `/qa`
- `/qa-only`
- `/design-review`
- `/setup-browser-cookies`
- `/setup-deploy`
- `/setup-gbrain`
- `/retro`
- `/investigate`
- `/document-release`
- `/document-generate`
- `/codex`
- `/cso`
- `/autoplan`
- `/plan-devex-review`
- `/devex-review`
- `/careful`
- `/freeze`
- `/guard`
- `/unfreeze`
- `/gstack-upgrade`
- `/learn`

# Product UX philosophy

These directions apply to all UI, copy, and product decisions for Muqsit. They are
not sprint-specific and should be carried forward across sessions.

- **Operational-first.** The office dashboard exists to help an owner-operator run the
  business, not to admire analytics. Cards over charts; charts only when they read at
  a glance. Every screen should answer an operational question, not a curiosity.
- **Office dashboard priorities.** The office owner should immediately understand four
  things: **cash position, risk, collections, and investment performance.** Anything
  that doesn't reinforce one of these earns its space.
- **Saudi financial UX direction.** Warm, premium, and trustworthy — the visual
  register of modern Saudi banking (Al Rajhi, Alinma, STC Bank, Tamara, Tabby). Soft
  financial green as the primary identity, warm whites, muted gold accents used
  sparingly. No flashy startup gradients. No pitch-black dark mode.
- **Simplicity over complexity.** When in doubt, remove. Prefer fewer KPIs done well,
  fewer chart types, fewer states. Density only where it earns its keep.
- **Arabic-first clarity.** Arabic (RTL) is the default direction and the default
  voice. Use Latin digits in financial figures (standard for Saudi banking). All copy
  must be readable by non-technical users — plain terminology, no internal jargon in
  the UI.
- **Internal investment = investor account with a zero investor-profit ratio.** When
  the office self-finances, it is modeled as an internal investor on the same
  Investment Contract lifecycle as external investors. The UI and reporting slice by
  `Investor.type`; they never fork into a parallel flow.

