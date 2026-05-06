const bookFiles = {
"Genesis": "data/Genesis.json",
"Exodus": "data/Exodus.json",
"Leviticus": "data/Leviticus.json",
"Numbers": "data/Numbers.json",
"Deuteronomy": "data/Deuteronomy.json",
"Joshua": "data/Joshua.json",
"Judges": "data/Judges.json",
"Ruth": "data/Ruth.json",
"1 Samuel": "data/1_Samuel.json",
"2 Samuel": "data/2_Samuel.json",
"1 Kings": "data/1_Kings.json",
"2 Kings": "data/2_Kings.json",
"1 Chronicles": "data/1_Chronicles.json",
"2 Chronicles": "data/2_Chronicles.json",
"Ezra": "data/Ezra.json",
"Nehemiah": "data/Nehemiah.json",
"Esther": "data/Esther.json",
"Job": "data/Job.json",
"Psalms": "data/Psalms.json",
"Proverbs": "data/Proverbs.json",
"Ecclesiastes": "data/Ecclesiastes.json",
"Song of Solomon": "data/Song_of_Solomon.json",
"Isaiah": "data/Isaiah.json",
"Jeremiah": "data/Jeremiah.json",
"Lamentations": "data/Lamentations.json",
"Ezekiel": "data/Ezekiel.json",
"Daniel": "data/Daniel.json",
"Hosea": "data/Hosea.json",
"Joel": "data/Joel.json",
"Amos": "data/Amos.json",
"Obadiah": "data/Obadiah.json",
"Jonah": "data/Jonah.json",
"Micah": "data/Micah.json",
"Nahum": "data/Nahum.json",
"Habakkuk": "data/Habakkuk.json",
"Zephaniah": "data/Zephaniah.json",
"Haggai": "data/Haggai.json",
"Zechariah": "data/Zechariah.json",
"Malachi": "data/Malachi.json",
"Matthew": "data/Matthew.json",
"Mark": "data/Mark.json",
"Luke": "data/Luke.json",
"John": "data/John.json",
"Acts": "data/Acts.json",
"Romans": "data/Romans.json",
"1 Corinthians": "data/1_Corinthians.json",
"2 Corinthians": "data/2_Corinthians.json",
"Galatians": "data/Galatians.json",
"Ephesians": "data/Ephesians.json",
"Philippians": "data/Philippians.json",
"Colossians": "data/Colossians.json",
"1 Thessalonians": "data/1_Thessalonians.json",
"2 Thessalonians": "data/2_Thessalonians.json",
"1 Timothy": "data/1_Timothy.json",
"2 Timothy": "data/2_Timothy.json",
"Titus": "data/Titus.json",
"Philemon": "data/Philemon.json",
"Hebrews": "data/Hebrews.json",
"James": "data/James.json",
"1 Peter": "data/1_Peter.json",
"2 Peter": "data/2_Peter.json",
"1 John": "data/1_John.json",
"2 John": "data/2_John.json",
"3 John": "data/3_John.json",
"Jude": "data/Jude.json",
"Revelation": "data/Revelation.json"
}

let book = null;

async function loadBook(bookName) {
    const response = await fetch(bookFiles[bookName]);
    book = await response.json();
    console.log(book);


    document.getElementById("reference").textContent = 
        book.book;

    fillChapterDropdown();

    const chapter = book.chapters[0];
    const verse = chapter.verses[0];

    document.getElementById("reference").textContent =
        `${book.book} ${chapter.chapter}:${verse.verse}`;

    document.getElementById("verseText").textContent =
        verse.text;

    document.getElementById("chapterSelect").value =
        chapter.chapter;    


}


function fillBookDropdown() {
    const bookSelect = document.getElementById("bookSelect");

    Object.keys(bookFiles).forEach((bookName) => {
        const option = document.createElement("option");

        option.value = bookName;
        option.textContent = bookName;

        bookSelect.appendChild(option);
    });
}

function fillChapterDropdown() {
    const chapterSelect = document.getElementById("chapterSelect");
    chapterSelect.innerHTML = "";

    book.chapters.forEach((chapter) => {
        const option = document.createElement("option");
        option.value = chapter.chapter;
        option.textContent = chapter.chapter;
        chapterSelect.appendChild(option);
    });
}

function showRandomVerse() {
    if (book === null) {
        console.warn("Bible not loaded yet.");
        return;
    }

    const selectedChapterIndex =
        Number(document.getElementById("chapterSelect").value) - 1;
 
    const chapter = book.chapters.find(
        (ch) => ch.chapter === selectedChapterIndex + 1
    );

    const randomVerseIndex =
        Math.floor(Math.random() * chapter.verses.length);

    const verse = chapter.verses[randomVerseIndex];

    document.getElementById("reference").textContent =
        `${book.book} ${chapter.chapter}:${verse.verse}`;

    document.getElementById("verseText").textContent =
        verse.text;
}

document
    .getElementById("bookSelect")
    .addEventListener("change", (event) => {
        loadBook(event.target.value);
});

document
    .getElementById("randomBtn")
    .addEventListener("click", showRandomVerse);

fillBookDropdown();
loadBook("Genesis");
