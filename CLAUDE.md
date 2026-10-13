# B2THEWORLD — Eval360 demonstration · CLAUDE.md

Last updated: 2026-10-13 — all 11 stages complete, plus data entry

> **Read [docs/SOURCE_RECONCILIATION.md](docs/SOURCE_RECONCILIATION.md) before writing a line of
> code.** Three source documents disagree in nine places and leave nine sections blank. The
> supplied material says explicitly: *do not invent values for blanks or resolve differing targets
> without user approval.* That is a hard rule here, not a preference.

---

## What this is

A demonstration of **Eval360** configured around B2THEWORLD's own work: transformative education
for children affected by war, across Rwanda, South Sudan, Cameroon, Pakistan and Iraq, delivered
through a partnership-based member-school model.

**One self-contained HTML file.** Vanilla JS, no build step, no framework, no server. Chart.js and
Bootstrap Icons from a CDN; everything else inline. The same architecture as the FPC build in
`../FPC` — read `fpc_eval360_demo.html` for the patterns before adding a module here.

```
B2TW/
├── b2tw_eval360_demo.html        the demonstration — 26 screens, ~486 KB
├── B2TW_Eval360_User_Guide.html  GENERATED — 14 chapters, 27 figures
├── index.template.html           the landing page, before its figures are stamped in
├── index.html                    GENERATED
├── README.md
├── docs/
│   ├── SOURCE_RECONCILIATION.md  what the three documents say, and where they differ
│   ├── BUILD_BRIEF.md            screens, data model, build order
│   └── DEPLOY.md
└── scripts/
    ├── build-guide.js            builds the guide AND stamps index.html, no browser needed
    └── deploy_pull.sh            run on the server
```

Both generated files are **committed on purpose**: a server without Node still has something to
serve, and `deploy_pull.sh` rebuilds them when it can, so a stale copy self-corrects.

---

## State — all 11 stages done

26 screens, 12 test suites, **530 assertions**, 52/52 internal consistency checks.
Suites live in the session scratchpad as `b1.js`–`b12.js`; each runs the page under `node vm`
against a stub DOM and probes rendered output, not the seed.

| Stage | What landed |
|---|---|
| 1–2 | Shell, nav, roles, both plans, seeds, calculators, consistency checks |
| 3 | Dashboard · Theory of Change · Logframe · Indicators |
| 4 | **Plan Reconciliation** · Plan Mapping |
| 5 | Countries · Schools · Students |
| 6 | Teachers · Leaders · Stakeholder Training |
| 7 | **Fullness of Life** · Classroom Observation · Safeguarding |
| 8 | Culture & Rule of Life · Team · Funding |
| 9 | Report Centre + all six generators, print/.doc/CSV |
| 10 | Data Quality Plan · Plan Quality Check · Ask Eval360 |
| 11 | Inbox · Users & Roles · Configuration · the self-generating guide |
| — | **Data entry**: nine forms, an audit trail, and the gap-answering loop |

---

## Data entry

A form kit (`4c`) and nine forms (`4d`). Two rules:

1. **A form writes to `appData` and nothing else.** Screens re-derive, so a typed figure reaches
   every table, chart and report in the same instant. `entrySubmit()` re-runs the checks and
   re-renders the current view.
2. **Every write is logged** to `appData.entryLog` with a name and a timestamp.

```
ENTRY_FORMS[key] = { build(meta) → {title, intro, fields, values, submit, after},
                     save(values, meta) → {message, view?, meta?, errors?} }
```

`openEntryForm(key, meta)` → modal; `data-action="entry-submit"` → `formRead()` validates, then
`save()`. Field types: text, number, select, textarea, date, **score** (1–4 pills), **yesno**,
static, heading. `formRead()` bounds a score to 1–4 and a yesno to 0–1 **regardless of what the
widget sends** — the validator does not trust its own input. `entryBtn()` / `editBtn()` return
nothing but a "read-only for your role" chip when `access(currentView) === 'read'`.

### The gap-answering loop — the point of the whole build

`appData.gaps[i].answer = {text, source, by, on}`, set only by a person on Plan Quality Check.
One entry moves five things at once: `gapNote()` prints a green attributed block instead of the
red question · `calcCompleteness()` stops counting the section as blocked · `calcPlanFindings()`
marks it `decided` · the blanks half of `calcPlanScore()` leaves zero · the dashboard and inbox
counts follow. **Nothing pre-fills an answer**, ever.

### Integrity is the one verdict the system can earn

`calcDataQuality()` recomputes the `integrity` cell per register from `entriesFor(key).length`:
weak → partial once anything has been recorded through a form, with a note saying how many
changes it is based on and that the seeded figures still have no author. Registers a form may
write to that the matrix does not assess are declared in `ENTRY_UNASSESSED_REGISTERS` — a
consistency check catches a register-key typo, which would otherwise make a write silently inert.

### Things a green suite did not catch, and the read did

Kept as a record, because every one was a figure that was *true* and still misleading:

- The beneficiary table counted sex over all 397 enrolled while printing 350 in training — the
  row's own three figures did not add up.
- "Total reached: 8,709" summed groups that overlap; a teacher in the training register is also a
  teacher in the school register.
- The eval-plan table claimed a baseline of "first round" for all 13 indicators. Only two
  instruments ran twice, so only two have one.
- "7 reports held up" was four sections of one report, counted four times.
- Every report was signed by the same person as author *and* approver.
- The plan score bottomed out at 4/100 under a penalty model — identical whether one blank was
  filled or ten, so no reason to fill the first. Replaced with the share of what a plan needs
  that this plan has.
- Five data-quality verdicts were one-liners ("Monthly.") that told a reader nothing.
- **R9 and gap G11 were the same fact** — B row 9's missing fourth outcome — counted twice, with
  a "Decide" button on something nobody can decide. The gap register now wins and the
  reconciliation item is deduped; a `kind:'gap'` item never sits in the "awaiting a ruling"
  column.
- A double rounding turned 45.45 into 46 by way of 45.5.

### Found by the data-entry work

- **`folFor()` returns undefined for a school with no self-study**, and eight call sites
  dereferenced it. A new school crashed the schools table, the heat matrix, safeguarding, the
  country report and a consistency check. Fixed with `folAssessed()` / `NOT_ASSESSED` and an
  honest "not assessed" state everywhere — *not* a record of zeros, which would make an
  unassessed school read as the worst in the network. `calcFolMovement()` now drops schools
  without both rounds rather than counting them as no change.
- **Eleven consistency checks asserted the seed, not an invariant** — "27 partner schools",
  "Students = 7,963", "10 of 27 at the benchmark". Adding one school turned the chip red, which
  teaches everyone to ignore it. All converted: the invariant is asserted against the live
  registers, and the seed figure is stated separately against `appData.seedFacts`, captured once
  at load by `captureSeedFacts()` and labelled "Seed figure:". **This is the second time this
  project has paid for that mistake — see the FPC build.**
- **`captureView()` rendered guide figures without setting `currentView`**, so a figure could
  carry the access level of whatever screen the reader was on when they pressed build. It now
  sets and restores both `currentView` and `currentMeta`.
- **Guide chapter numbers were typed into each chapter**, and `"chapter 4 — Plan Reconciliation"`
  was typed into two places. Inserting the data-entry chapter would have broken all of it.
  Numbers now come from list position (`guideAllChapters()`) and cross-references resolve by
  title (`chRef()`).
- The plan-score band label asserted "the differences are decided, the blanks are not", which
  stops being true as blanks get answered. Now computed from both halves.

---

## The rules that cost time elsewhere

### Data

- **`appData` is the only source of truth.** No figure is written into HTML. If it appears on
  screen it came from `appData` or a calculator over it.
- **Derived, not typed.** Students by country, schools by level, teachers trained, Fullness-of-Life
  stage distribution, every indicator with a register behind it, report completeness — all computed.
  A figure typed in two places will eventually disagree with itself.
- **Deterministic seeding.** `mulberry32` with a fixed seed. The demo must look identical on every
  machine, every time.
- **No browser storage.** No `localStorage`, `sessionStorage` or IndexedDB. State lives in memory
  for the session and says so where a person might assume otherwise.

### The two plans

- `appData.plans.y2024` and `appData.plans.pooa5` are **separate objects and stay separate.** Never
  merge them, never let one default to the other.
- A conflict is **presented, not resolved.** The Plan Reconciliation screen quotes both sources and
  offers a decision; the decision is logged with a date and a name. Code never picks.
- A blank is a **gap with a question attached**, never a zero and never an invention.

### Safeguarding

These are children in conflict zones. The FPC rules carry over:

- No child is named anywhere.
- Student data is aggregate by default.
- Counts below three are suppressed wherever sex is crossed with anything identifying.
- Generated donor reports carry no individual record.
- The AI assistant receives counts, never records, and says so.

### Faith content

Project 3 — team culture, a lifestyle of prayer, a rule of life, *Lead with Prayer*, the ECO App —
is one of three M&E projects and is built exactly as written. It is not neutralised and not given
more prominence than the source gives it.

### Rendering

- `afterRender(fn)` queues chart mounts; `showView()` runs them once `innerHTML` has landed.
  A renderer is a pure string builder and never touches the DOM.
- **Event delegation via `data-action`**, not inline `onclick`.
- Colour comes from CSS custom properties on `:root`. **No component hardcodes a hex**, so
  rebranding is one token block and the charts follow it.
- `chartTheme()` must fall back to a literal palette when the tokens cannot be read — the user
  guide builds chart configurations outside the page, where `getComputedStyle` does not exist.
- Three typefaces by role: **Fraunces** headings · **Inter** UI and body · **JetBrains Mono**
  codes and identifiers.

### Exports

- **Blob URL, never `document.write`.** Build the string, make a `Blob`, `URL.createObjectURL()`,
  open it. Include a `@media print` stylesheet and a visible Print / Save as PDF button.
- A `.doc` export is Word-openable HTML with the on-screen tooling stripped.
- Chart **configurations** travel into a generated document, not canvases — a canvas cannot cross
  documents. Drop every function from the config first: callbacks close over this page, and a tick
  callback that throws takes the whole chart with it.

### Testing

There is no DOM here. Suites run under `node vm` against a stub document. A green suite is not
proof — read the rendered output as a reader would, every time. Everything in the list above was
found that way, after the suite was green.

Three harness habits that save time: the product escapes everything it prints, so compare against
the escaped form or every title with an ampersand reads as a failure; `scripts/build-guide.js` is
itself a test — it renders every figure and throws if a chapter names a screen that no longer
exists; and to test a *form*, give the stub DOM a `FIELDS` map that `getElementById('f-x')` and
`querySelector('input[name="x"]:checked')` both read from, then call `formRead()` and `save()` —
`b12.js` drives all nine forms that way, including the ones that should be refused.

---

## Deployment

Static, alongside the others:

```
/home/vantage/domains/eval360.tech/public_html/mel/
├── atbu/   → mel.eval360.tech/atbu
├── fpc/    → mel.eval360.tech/fpc
└── b2tw/   → mel.eval360.tech/b2tw
```

`git push` here, `bash scripts/deploy_pull.sh` on the server — it pulls, rebuilds the guide and
the landing page, and copies the three served files. `.env` is gitignored. Full walkthrough in
[docs/DEPLOY.md](docs/DEPLOY.md).

**Not yet done:** no GitHub repo, no remote, nothing deployed. The local build is complete.

---

## Working agreement

1. All stages in [BUILD_BRIEF.md §7](docs/BUILD_BRIEF.md) are complete. Changes from here are
   edits, not stages — but still run the full `b1`–`b11` regression and rebuild the guide.
2. Never resolve a documented conflict or fill a documented blank in code.
3. When a source document is ambiguous, say so on screen rather than choosing quietly.
