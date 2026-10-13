#!/usr/bin/env node
/* Build the user guide and the landing page without a browser.
 *
 * The demonstration's own builder is run here against a stub document. It works
 * because the renderers are pure string builders that never touch the DOM, and
 * because chart configurations are collected rather than drawn — the plots are
 * created when the guide is opened, not when it is built.
 *
 *   node scripts/build-guide.js [outfile]
 *
 * Default output: B2TW_Eval360_User_Guide.html beside the demonstration. It also
 * stamps index.template.html into index.html, so the figures on the landing page
 * come from the registers rather than from somebody's memory of them.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const SRC  = path.join(ROOT, 'b2tw_eval360_demo.html');
const OUT  = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(ROOT, 'B2TW_Eval360_User_Guide.html');

const page = fs.readFileSync(SRC, 'utf8');
const script = (page.match(/<script>\n([\s\S]*)<\/script>\s*<\/body>/) || [])[1];
if (!script){
  console.error('Could not find the application script in ' + SRC);
  process.exit(1);
}
/* The guide inlines the app's stylesheet so a figure looks like the screen it
   came from. There is no DOM here, so the <style> blocks are lifted out of the
   file and handed to the stub querySelectorAll. */
const styles = [...page.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m => m[1]);

const node = () => ({
  innerHTML:'', textContent:'', value:'', dataset:{},
  style:{setProperty(){}, removeProperty(){}},
  classList:{add(){}, remove(){}, contains:() => false},
  addEventListener(){}, appendChild(){}, remove(){}, setAttribute(){}, getAttribute(){},
  querySelector:() => null, querySelectorAll:() => [], closest:() => null,
  scrollTop:0, scrollHeight:0
});
const made = {};
const byId = id => (made[id] = made[id] || node());

const ctx = {
  document:{
    getElementById: byId,
    createElement: node,
    addEventListener(){},
    querySelector:() => null,
    querySelectorAll: sel => sel === 'style' ? styles.map(t => ({textContent:t})) : [],
    documentElement:{style:{setProperty(){}, removeProperty(){}}},
    body:{appendChild(){}}
  },
  window:{scrollTo(){}, addEventListener(){}},
  getComputedStyle:() => ({getPropertyValue:() => ''}),
  console:{log(){}, warn(){}, error(){}},
  setTimeout, Number, String, Object, Array, Math, Date, JSON,
  isNaN, parseInt, parseFloat, Set, Map, Promise, Blob:null, URL:null
};
ctx.window.document = ctx.document;
ctx.window.Chart = null;
vm.createContext(ctx);
vm.runInContext(script + `
;globalThis.__build = buildGuideDocument;
globalThis.__charts = () => guideCharts;
globalThis.__facts = () => ({
  countries: appData.countries.length,
  countryList: appData.countries.map(c => c.name).join(', ')
    .replace(/, ([^,]*)$/, ' and $1'),
  schools: calcSchools().total,
  students: num(calcStudents().total),
  conflicts: appData.reconciliation.length,
  gaps: appData.gaps.length,
  reports: REPORT_CARDS.length,
  screens: NAV.flatMap(g => g.items).length,
  chapters: guideChapters().length + guideChapters2().length + 1,
  teachers: calcObservation().total
});`, ctx);

let last = '';
const html = ctx.__build((done, total, label) => {
  const line = `  [${String(done).padStart(2)}/${total}] ${label.slice(0, 68)}`;
  if (line !== last){ console.log(line); last = line; }
});

fs.writeFileSync(OUT, html, 'utf8');
const kb = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(0);
console.log(`\n  ${path.relative(process.cwd(), OUT)} — ${kb} KB, `
  + `${ctx.__charts().length} charts, no screenshots.`);

/* ── The landing page, stamped from the same registers ─────────────────── */
const TPL = path.join(ROOT, 'index.template.html');
const IDX = path.join(ROOT, 'index.html');
if (fs.existsSync(TPL)){
  const f = ctx.__facts();
  const figures = [...html.matchAll(/<figure class="fig">/g)].length;
  const facts = [
    [f.countries, 'countries'],
    [f.schools, 'partner schools'],
    [f.students, 'children enrolled'],
    [f.conflicts, 'documented differences'],
    [f.gaps, 'named gaps, none invented'],
    [f.reports, 'reports']
  ].map(([v, l]) => `\n    <div><b>${v}</b><span>${l}</span></div>`).join('') + '\n  ';

  const vals = {
    FACTS: facts, CHAPTERS: f.chapters, FIGURES: figures, SCREENS: f.screens,
    REPORTS: f.reports, CONFLICTS: f.conflicts, GAPS: f.gaps,
    COUNTRY_LIST: f.countryList
  };
  let idx = fs.readFileSync(TPL, 'utf8');
  Object.keys(vals).forEach(k => {
    idx = idx.split('{{' + k + '}}').join(String(vals[k]));
  });
  const left = idx.match(/\{\{[A-Z_]+\}\}/g);
  if (left){
    console.error('  ! the landing page template has placeholders nothing filled: '
      + [...new Set(left)].join(', '));
    process.exit(1);
  }
  fs.writeFileSync(IDX, idx, 'utf8');
  console.log(`  index.html — stamped with ${Object.keys(vals).length} live figures.`);
}
