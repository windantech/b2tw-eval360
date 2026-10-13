# Deploying the B2THEWORLD demonstration

Three static files, served from a directory. No server-side anything.

```
/home/vantage/domains/eval360.tech/public_html/mel/
├── atbu/   → mel.eval360.tech/atbu
├── fpc/    → mel.eval360.tech/fpc
└── b2tw/   → mel.eval360.tech/b2tw   ← this one
```

## What gets served

| File | What it is |
|---|---|
| `index.html` | The landing page. **Generated** — edit `index.template.html`. |
| `b2tw_eval360_demo.html` | The system. One self-contained file. |
| `B2TW_Eval360_User_Guide.html` | The guide. **Generated** by the system itself. |

Nothing else in the repository is served — the docs, the scripts and the template stay out of
the web root.

## First time

On the server:

```bash
cd ~/repos                              # or wherever repos live
git clone https://github.com/<owner>/b2tw-eval360.git
cd b2tw-eval360
bash scripts/deploy_pull.sh
```

The target directory is `/home/vantage/domains/eval360.tech/public_html/mel/b2tw` by default.
Override it without editing the script:

```bash
TARGET=/some/other/path bash scripts/deploy_pull.sh
```

## Every time after that

Push from the laptop, pull on the server:

```bash
# laptop
git push

# server
cd ~/repos/b2tw-eval360 && bash scripts/deploy_pull.sh
```

`deploy_pull.sh` does a fast-forward-only pull, rebuilds the guide and the landing page if Node
is available, copies the three files, and sets them to 644.

## The two generated files

Both come from `scripts/build-guide.js`, which runs the demonstration's own guide builder under
Node against a stub document:

```bash
node scripts/build-guide.js
```

It works because the renderers are pure string builders that never touch the DOM, and because
chart *configurations* are collected rather than drawn — the plots are created when the guide is
opened in a browser, not when it is built.

Two things worth knowing:

- **A renamed screen stops the build.** If a chapter names a view that no longer exists, the
  builder throws rather than shipping a guide with a hole in it.
- **The landing page is stamped, not written.** Its figures come from the registers. A number
  typed by hand there would eventually disagree with the screen it describes, which is the same
  reason nothing inside the system is typed twice.

Run it before pushing if you changed a screen. `deploy_pull.sh` runs it again on the server
anyway, so a stale committed guide self-corrects on the next deploy.

## Requirements

Node 18 or later, only for the build. The served files need nothing: no PHP, no database, no
build step at request time. Chart.js and Bootstrap Icons come from a CDN; without a connection
the pages still open and the charts say so in place of a plot.
