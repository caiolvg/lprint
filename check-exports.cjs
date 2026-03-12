const m = require('./dist/index.cjs');
console.log('module export is', typeof m);
if (m && m.listen) console.log('looks like express app with listen');
else console.log('keys', Object.keys(m));
