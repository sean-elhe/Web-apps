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

const difficultyLevels = ["Easy", "Medium", "Hard"];

let book = null;
let currentChapter = null;
let currentVerseIndex = 0;
let difficultyLevel = "Easy";

async function loadBook(bookName) {
    const response = await fetch(bookFiles[bookName]);
    book = await response.json();
    console.log(book);


    document.getElementById("reference").textContent = 
        book.book;

    fillChapterDropdown();

    currentChapter = book.chapters[0];
    currentVerseIndex = 0;

    document.getElementById("chapterSelect").value = 
        currentChapter.chapter;

    displayCurrentVerse();
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

function fillDifficultyDropdown() {
    const difficultySelect = document.getElementById("difficultySelect");

    difficultySelect.innerHTML = "";

    difficultyLevels.forEach((level) => {
        const option = document.createElement("option");
        option.value = level;
        option.textContent = level;
        difficultySelect.appendChild(option);
    });
}

function displayCurrentVerse() {
    const verse =
        currentChapter.verses[currentVerseIndex];
    document.getElementById("reference").textContent =
        `${book.book} ${currentChapter.chapter}:${verse.verse}`;

    const difficulty =
        document.getElementById("difficultySelect").value;

    const verseDisplay =
        replacingWords(verse.text, difficulty);

    displayObfuscatedVerse(verseDisplay);

    updateProgressBar();
}

function updateProgressBar() {
    const progressBar = document.getElementById("progressBar");

    progressBar.value = currentVerseIndex;
    progressBar.max = currentChapter.verses.length;

    document.getElementById("progressCurrent").textContent =
        `${currentChapter.chapter}:${currentVerseIndex + 1}`;

    document.getElementById("progressTotal").textContent =
        `${currentVerseIndex}/${currentChapter.verses.length}`;
}

function replacingWords(text, difficultyLevel = "Easy") {
    const difficultiesMap = {
        Easy: 0.20,
        Medium: 0.40,
        Hard: 0.60
    };

    const difficulty =
        difficultiesMap[difficultyLevel] ?? 0.25;

    const splitWords = text
        .split(/[ —]+/)
        .filter(word => word.trim() !== "");

    const replaceableIndices = splitWords
        .map((word, index) => ({ word, index }))
        .filter(item =>
            item.word.length >= 3 &&
            /[a-zA-Z]/.test(item.word)
        )
        .map(item => item.index);

    const count = Math.max(
        1,
        Math.round(replaceableIndices.length * difficulty)
    );

    const shuffledIndices = replaceableIndices
        .sort(() => Math.random() - 0.5);

    const indicesToReplace =
        new Set(shuffledIndices.slice(0, count));

    const hiddenWords = [];

    const wordList = splitWords.map((word, index) => {
        const isHidden = indicesToReplace.has(index);

        if (isHidden) {
            hiddenWords.push(word);
        }

        return {
            word: word,
            isHidden: isHidden,
            index: index
        };
    });

    return {
        original: text,
        wordList: wordList,
        hiddenWords: hiddenWords
    };
}

function displayObfuscatedVerse(verseDisplay) {
    const verseText = 
        document.getElementById("verseText");

    verseText.innerHTML = "";

    verseDisplay.wordList.forEach(item => {

        if (item.isHidden) {

            verseText.innerHTML += `
                <input 
                    class="verseInput"
                    data-index="${item.index}"
                    data-answer="${item.word}"
                />
            `;

        } else {

            verseText.innerHTML += `
                <span>${item.word}</span>
            `;
        }

        verseText.innerHTML += " ";
    });

    setupInputLogic();
}

function setupInputLogic(){

        const inputs =
            document.querySelectorAll(".verseInput");

        inputs.forEach((input, index) => {
            
            input.addEventListener("input", (event) => {
                
                event.target.value = event.target.value
                    .toLowerCase()
                    .replace(/[^a-z]/g, "");

                const answer =
                    event.target.dataset.answer.toLowerCase();

                if (
                    event.target.value.length >= answer.length &&
                    index < inputs.length - 1
                ) {
                    inputs[index + 2].focus();
                }

                if (event.target.value === answer) {
                    event.target.classList.add("correct");
                } else {
                    event.target.classList.remove("correct");
                }
            });
        });
}

document
    .getElementById("bookSelect")
    .addEventListener("change", (event) => {
        loadBook(event.target.value);
    });

document
    .getElementById("chapterSelect")
    .addEventListener("change", (event) => {
        const selectedChapterNumber = Number(event.target.value);

        currentChapter = book.chapters.find(
            chapter => chapter.chapter === selectedChapterNumber
        );

        currentVerseIndex = 0;
        displayCurrentVerse();
    });

document
    .getElementById("difficultySelect")
    .addEventListener("change", () => {
        displayCurrentVerse();
    });

document
    .getElementById("randomBtn")
    .addEventListener("click", () => {
        displayCurrentVerse();
    });

document
    .getElementById("nextBtn")   
    .addEventListener("click", () => {
        if (currentVerseIndex < currentChapter.verses.length - 1) {
            currentVerseIndex++;
            displayCurrentVerse();
        }
    });

document
    .getElementById("prevBtn")   
    .addEventListener("click", () => {
        if (currentVerseIndex > 0) {
            currentVerseIndex--;
            displayCurrentVerse();
        }
    });

fillDifficultyDropdown();
fillBookDropdown();
loadBook("Genesis");
