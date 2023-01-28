import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileName = __dirname + '/../src/utils/words.js'
const wordspath = __dirname + '/../assets/words.txt'
const badwordspath = __dirname + '/../assets/badwords.txt'

const words = fs.readFileSync(wordspath).toString()
const badwords = fs.readFileSync(badwordspath).toString().split('\n')
const obj = {}
words.split('\n').forEach(word => {
    const clean = word.replace(/(\r\n|\n|\r)/gm, "");
    if (!badwords.includes(clean.toLowerCase())) {
        obj[clean] = true;
    } else {
        console.log('Skipping');
        console.log(word);
    }
})
// lets create an obj with the wordArr
const wordStr = JSON.stringify(obj);
const str = `
export const wordObj = ${wordStr}
`
fs.writeFile(fileName, str, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log('File created successfully');
    }
});