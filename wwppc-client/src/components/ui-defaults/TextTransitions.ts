// text transitions (from red pixel simulator)
export function flipTextTransition(from: string, to: string, update: (text: string) => boolean | void, speed: number, block = 1) {
    let cancelled = false;
    const ret: AsyncTextTransition = {
        promise: new Promise((resolve) => {
            const gen = flipTextTransitionGenerator(from, to, block);
            console.log('why')
            const animate = setInterval(() => {
                const next = gen.next();
                if (cancelled || next.done || update(next.value)) {
                    clearInterval(animate);
                    ret.finished = true;
                    resolve(!cancelled);
                }
            }, 1000 / speed);
        }),
        finished: false,
        cancel: () => cancelled = true
    };
    return ret;
}
export function* flipTextTransitionGenerator(from: string, to: string, block: number) {
    let i = 0;
    const addSpaces = to.length < from.length;
    const fromTags = from.match(/<(.*?)>/g) ?? [];
    const toTags = to.match(/<(.*?)>/g) ?? [];
    let cleanFrom = from;
    let cleanTo = to;
    fromTags.forEach((tag) => cleanFrom = cleanFrom.replace(tag, '§'));
    toTags.forEach((tag) => cleanTo = cleanTo.replace(tag, '§'));
    while (true) {
        let text = cleanTo.substring(0, i);
        if (addSpaces && i >= cleanTo.length) {
            for (let j = cleanTo.length; j < i; j++) {
                text += ' ';
            }
        }
        for (let j = 0; text.includes('§'); j++) {
            text = text.replace('§', toTags[j]);
        }
        text += cleanFrom.substring(i);
        let k = text.lastIndexOf('§'); // most useless optimization ever
        for (let j = fromTags.length - 1; k >= 0; j--) {
            text = text.substring(0, k) + fromTags[j] + text.substring(k + 1);
            k = text.lastIndexOf('§');
        }
        i += block;
        if (i >= cleanTo.length + block && (!addSpaces || i >= cleanFrom.length + block)) {
            yield to;
            break;
        }
        yield text;
    }
}
export function glitchTextTransition(from: string, to: string, update: (text: string) => boolean | void, speed: number, block = 1, glitchLength = 5, advanceMod = 1, startGlitched = false) {
    let cancelled = false;
    const ret: AsyncTextTransition = {
        promise: new Promise((resolve) => {
            const gen = glitchTextTransitionGenerator(from, to, block, glitchLength, advanceMod, startGlitched);
            const animate = setInterval(() => {
                const next = gen.next();
                if (cancelled || next.done || update(next.value)) {
                    clearInterval(animate);
                    ret.finished = true;
                    resolve(!cancelled);
                }
            }, 1000 / speed);
        }),
        finished: false,
        cancel: () => cancelled = true
    };
    return ret;
}
export function* glitchTextTransitionGenerator(from: string, to: string, block: number, glitchLength: number, advanceMod: number, startGlitched: boolean) {
    const addSpaces = to.length < from.length;
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890-=!@#$%^&*()_+`~[]\\{}|;\':",./?';
    const fromTags = from.match(/<(.*?)>/g) ?? [];
    const toTags = to.match(/<(.*?)>/g) ?? [];
    let cleanFrom = from;
    let cleanTo = to;
    fromTags.forEach((tag) => cleanFrom = cleanFrom.replace(tag, '§'));
    toTags.forEach((tag) => cleanTo = cleanTo.replace(tag, '§'));
    let a = 0;
    let i = startGlitched ? cleanTo.length : 0;
    while (true) {
        let text = cleanTo.substring(0, i - glitchLength);
        if (addSpaces && i >= cleanTo.length) {
            for (let j = cleanTo.length; j < i - glitchLength; j++) {
                text += ' ';
            }
        }
        for (let j = 0; text.includes('§'); j++) {
            text = text.replace('§', toTags[j]);
        }
        for (let j = Math.max(0, i - glitchLength); j < Math.min(i, Math.max(cleanFrom.length, cleanTo.length)); j++) {
            text += letters.charAt(~~(Math.random() * letters.length));
        }
        text += cleanFrom.substring(i);
        let k = text.lastIndexOf('§'); // most useless optimization ever
        for (let j = fromTags.length - 1; k >= 0; j--) {
            text = text.substring(0, k) + fromTags[j] + text.substring(k + 1);
            k = text.lastIndexOf('§');
        }
        if (a % advanceMod == 0) i += block;
        if (i >= cleanTo.length + block + glitchLength && (!addSpaces || i >= cleanFrom.length + block + glitchLength)) {
            yield to;
            break;
        }
        yield text;
        a++;
    }
}
export interface AsyncTextTransition {
    promise: Promise<boolean>,
    finished: boolean,
    cancel: () => true
}