const glob = require('glob');
const fs = require('fs');
['./dist', ...glob.sync('./component/**/dist')].forEach(path => {
    console.log(path);
    fs.rmdirSync(path, { recursive: true });
});