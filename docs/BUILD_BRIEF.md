# B2THEWORLD — Eval360 demonstration · build brief

A single self-contained HTML file, the same architecture as the FPC build: vanilla JS, one
`appData` as the only source of truth, every figure on screen derived rather than typed, Chart.js
from a CDN, no browser storage, deterministic seeding.

Read [SOURCE_RECONCILIATION.md](SOURCE_RECONCILIATION.md) first. It governs this brief.

---

## 1 · What this has to sell

B2THEWORLD's problem is not that they lack an M&E plan. It is that they have **three documents
that disagree**, a logframe with **nine blank sections**, and a **newer theory of change with no
targets attached to it**. A reporting system that silently picks one number is worse than no
system. The demonstration has to show:

1. **We read all three documents.** The Plan Reconciliation screen quotes them against each other.
2. **The system holds both plan generations** and maps the old outputs onto the new ones.
3. **It runs the operational work** — schools, students, teachers, leaders, school quality,
   stakeholder training, team culture — across five countries and three continents.
4. **It produces the reports** B2THEWORLD and their donors need, from the same figures.
5. **It names what is missing** instead of reporting zero.

---

## 2 · The organisation

| | |
|---|---|
| Name | B2THEWORLD |
| Vision | "Fullness of life for the future of every child impacted by war." |
| Mission | Combat the generational impacts of war by leveraging the power of education |
| Values | Faithful Presence · Human Flourishing · Spiritual Transformation · Global Partnerships · Transformative Education |
| Model | Partnership-based **member school** model — work through national and local leaders, build their capacity, connect them to a global network |
| Project | Transformative Education · May 2024 – May 2025 |
| Countries | Rwanda · South Sudan · Cameroon · Pakistan **(+ Iraq — see reconciliation §1.3)** |

**Three M&E projects**, from LogFrame FINAL:

| | Project | Objective as written |
|---|---|---|
| **P1** | Serving Children in Post-Conflict Countries | By 31 May 2025, increase students receiving transformative education through Why/Play/Lead to 6,896, by expanding school partnerships |
| **P2** | Stakeholder Capacity Building | By 31 May 2025, increase to 250 stakeholders from 3 current partnership countries in ongoing training |
| **P3** | Living Out Our Team Culture and Core Values | By 31 May 2025, all employees develop, adopt and live out the team culture and core values, a lifestyle of prayer, and a rule of life |

**POOA v5**, the adopted theory of change: problems P1 Teaching Quality · P2 Leadership Quality ·
P3 School Quality → outcomes OC1–OC3 → outputs OP1–OP3 → activities AC1–AC3 → assumptions AS1–AS6.
Its **Fullness of Life Framework** runs **Entry → Intermediate → Advanced**, assessed by a
**School Self-Study**.

---

## 3 · Screens

**OVERVIEW** — Dashboard · My Inbox

**PLAN**
1. **Theory of Change** — POOA v5 as a diagram: P→OC→OP→AC with AS1–AS6 attached
2. **Logframe** — the three 2024 projects, Impact → Outcomes → Outputs → Activities → Inputs
3. **Indicators** — every indicator from both, with baseline, target, value, status
4. **Plan Reconciliation** ⭐ — the nine differences, quoted, with a decision log
5. **Plan Mapping** — 2024 outputs ↔ OP1/OP2/OP3

**NETWORK**
6. **Countries** — the five, each with status (current / developing / candidate), coordinator, schools, students, funding
7. **Partner Schools** — the register: country, level, students, teachers, Fullness-of-Life stage
8. **Students & Enrolment** — enrolment, attendance, retention, transition, graduation; by sex and age band

**PEOPLE**
9. **Teachers** — training through Why/Play/Lead, observation scores, competency
10. **School Leaders** — the transformational-leadership indicators from OC2
11. **Stakeholder Training** — P2: cohorts, sessions, certificates, post-training mentoring

**QUALITY**
12. **Fullness of Life Framework** ⭐ — School Self-Study: each school scored across domains, Entry → Advanced, with improvement plans
13. **Classroom Observation** — the instrument behind OC1
14. **Safeguarding & Student Care** — child protection in conflict settings, referrals, the whole-child package

**ORGANISATION**
15. **Team Culture & Rule of Life** — P3 exactly as written: prayer practice, *Lead with Prayer*, ECO App, personal rules of life, retreats
16. **Team** — staff, countries, M&E responsibilities

**FINANCE**
17. **Funding & Budgets** — $1.1M target, $50,000 per country, against actuals — and the fact that no logframe carries a budget line

**REPORTING**
18. **Report Centre** — the documents below
19. **Data Quality Plan** — A §7.1's five measures, with the blanks named
20. **Ask Eval360** — computed answers
21. **Logframe Quality Check** — the findings from the reconciliation, scored

**SETTINGS** — Users & Roles · Configuration · User Guide

---

## 4 · Reports to generate

| # | Report | Source | Period |
|---|---|---|---|
| 1 | **Annual M&E Report** | A §6 + §7.2 Performance Results Report | Project year |
| 2 | **Quarterly Programme Report** | The three projects' outputs | Quarterly |
| 3 | **Country Report** | Per country — schools, students, staff, funding | Quarterly |
| 4 | **School Self-Study & Improvement Plan** | POOA v5 / Fullness of Life | Per school |
| 5 | **Donor / Partner Update** | Impact narrative + photos with consent | Quarterly |
| 6 | **Board Report** | All three projects, including P3 | Annual |

Every generated report: the donor's own section numbering, quantitative blocks built from
`appData`, narrative drafted from the same figures and marked as a draft, gaps shown in red where
they belong, sources viewable per number, print / .doc / CSV.

---

## 5 · Data model

Deterministic seed. A project year from **May 2024 to May 2025**, with the clock set so the **year
has just ended and the annual report is due** — the same device that made the FPC demo land.

- `plans` — `{ y2024: {...}, pooa5: {...} }`, held separately, never merged
- `reconciliation` — the nine differences, each with both quotes, a status and a decision log
- `countries`, `schools`, `students`, `teachers`, `leaders`, `stakeholders`
- `observations` — classroom and leadership
- `selfStudy` — Fullness of Life domain scores per school, per round
- `culture` — P3: prayer practice, book, ECO App, rules of life
- `finance` — revenue against $1.1M, per-country against $50,000
- `indicators` — computed where a register drives them, stored otherwise
- `gaps` — every blank from reconciliation §2, with the question that fills it

**Figures that must be derived, never typed:** students by country and sex; schools by level;
teachers trained; stakeholders in training; Fullness of Life stage distribution; every indicator
with a register behind it; report completeness.

---

## 6 · Non-negotiable

- **No conflict is resolved in code.** The reconciliation screen presents; a person decides; the
  decision is logged with a date and a name.
- **No blank is filled with an invented value.** A blank renders as a gap with its question.
- **No child is named.** Student data is aggregate by default; counts below three are suppressed
  wherever sex is crossed with anything identifying.
- **Project 3 is built as written** — prayer, Bible study, rule of life, the ECO App. It is one of
  three projects and is treated as such.
- **No browser storage.**
- Every number on screen traceable to a register or a source document.

---

## 7 · Build order

| Stage | Contents |
|---|---|
| 1 | Shell, navigation, roles, `appData` with both plans loaded |
| 2 | Seed generators, calculators, consistency checks |
| 3 | Dashboard · Theory of Change · Logframe · Indicators |
| 4 | **Plan Reconciliation** · Plan Mapping |
| 5 | Countries · Partner Schools · Students & Enrolment |
| 6 | Teachers · School Leaders · Stakeholder Training |
| 7 | **Fullness of Life Framework** · Classroom Observation · Safeguarding |
| 8 | Team Culture & Rule of Life · Team · Funding |
| 9 | Report Centre and all six generators |
| 10 | Data Quality Plan · Quality Check · Ask Eval360 |
| 11 | Users · Configuration · polish · the self-generating User Guide |

Stop for review after each.
