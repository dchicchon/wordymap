import Filter from 'bad-words'
import BadWordsNext from 'bad-words-next'
import en from 'bad-words-next/data/en.json' assert {type: "json"}

const badwords = new BadWordsNext({ data: en })
const filter = new Filter();

const test = filter.isProfane('fuckup');
const test2 = badwords.check('fuckup')
console.log({ test, test2 })