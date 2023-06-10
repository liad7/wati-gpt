import fuzzysort from 'fuzzysort';

export const utilService = {
    makeId,
    makeLorem,
    getRandomIntInclusive,
    randomPastTime,
    saveToStorage,
    loadFromStorage,
    checkTextForSearchSuggestion
}

function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function makeLorem(size = 100) {
    var words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

function getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}

function randomPastTime() {
    const HOUR = 1000 * 60 * 60
    const DAY = 1000 * 60 * 60 * 24
    const WEEK = 1000 * 60 * 60 * 24 * 7

    const pastTime = getRandomIntInclusive(HOUR, WEEK)
    return Date.now() - pastTime
}

function saveToStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key: string) {
    const data = localStorage.getItem(key)
    return (data) ? JSON.parse(data) : undefined
}

function checkTextForSearchSuggestion(text: string | undefined): boolean {
    console.log('text: ', text);
    const searchPhrases = [
        'search',
        'search for',
        'look up',
        'find on the web',
        "find",
        'google',
        'web',
        'internet',
        // Add more phrases that you think imply an internet search
    ];

    if (!text) return false

    const lowerCaseText = text.toLowerCase();

    // Check for exact matches with regex
    for (const phrase of searchPhrases) {
        const regex = new RegExp('\\b' + phrase + '\\b', 'i');
        if (regex.test(lowerCaseText)) {
            return true;
        }
    }

    // Check for fuzzy matches with fuzzysort
    for (const phrase of searchPhrases) {
        const result = fuzzysort.single(phrase, lowerCaseText);
        if (result && result.score > -20) {  // Adjust the score threshold to control how fuzzy the match can be
            return true;
        }
    }

    return false;
}
