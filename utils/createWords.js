import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { RegExpMatcher, DataSet, englishDataset, pattern } from 'obscenity'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileName = __dirname + '/../src/utils/words.js'
const badwordsPath = __dirname + '/../assets/badwords.txt'
const wordspath = __dirname + '/../assets/enable1.txt'

const badWordsList = fs.readFileSync(badwordsPath).toString().split('\n')
const customDataSet = new DataSet().addAll(englishDataset)
badWordsList.forEach(word => {
    customDataSet.addPhrase(phrase => {
        return phrase.addPattern(pattern`|${word}|`)
    })
})
const matcher = new RegExpMatcher({
    ...customDataSet.build(),
})

const words = fs.readFileSync(wordspath).toString()
const obj = {}

const skippedWords = [];
console.log('run wordcheck');
words.split('\n').forEach(word => {
    const parsedWord = word.replace(/(\r\n|\n|\r)/gm, "").toLowerCase();
    console.log('Checking if profane:', word);
    if (matcher.hasMatch(parsedWord) || parsedWord.length < 3) {
        console.log('skipping');
        skippedWords.push(parsedWord);
        return;
    }
    obj[parsedWord] = true;
})

console.log({ skippedWords });
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