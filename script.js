const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const sound = document.getElementById("sound");
const btn = document.getElementById("search-btn");
const inpWord = document.getElementById("inp-word");

btn.addEventListener("click", searchWord);

// Listen for the Enter key in the input field
inpWord.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        searchWord();
    }
});

function searchWord() {
    let word = inpWord.value.trim();
    
    if (word === "") {
        result.innerHTML = `<h3 class="error">Please enter a word.</h3>`;
        return;
    }

    fetch(`${url}${word}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Word not found");
            }
            return response.json();
        })
        .then((data) => {
            if (!data || !data[0]) {
                throw new Error("No data found");
            }

            const wordData = data[0];
            const phonetics = wordData.phonetics.find(p => p.audio) || {};
            const meanings = wordData.meanings || [];

            let phoneticText = wordData.phonetic || (phonetics.text || "N/A");

            let meaningsHTML = meanings.map(meaning => {
                return `
                    <div>
                        <p><strong>${meaning.partOfSpeech}</strong></p>
                        ${meaning.definitions.map(def => `
                            <p class="word-meaning">${def.definition}</p>
                            <p class="word-example">${def.example || ""}</p>
                        `).join('')}
                    </div>
                `;
            }).join('');

            result.innerHTML = `
                <div class="word">
                    <h3>${wordData.word}</h3>
                </div>
                <div class="details">
                    <p>Phonetic: /${phoneticText}/</p>
                </div>
                ${meaningsHTML}
            `;

            if (phonetics.audio) {
                const audioUrl = `https:${phonetics.audio}`;
                sound.setAttribute("src", audioUrl);
                sound.play().catch(error => console.error("Error playing sound:", error));
            } else {
                sound.removeAttribute("src");
            }
        })
        .catch((error) => {
            console.error(error);
            result.innerHTML = `<h3 class="error">Couldn't Find The Word</h3>`;
        });
}
