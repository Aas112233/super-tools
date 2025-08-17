export function loadLoremIpsum() {
    return `
        <div class="tool-container">
            <div class="tool-header">
                <h1>Lorem Ipsum Generator</h1>
                <p>Generate placeholder text for your designs</p>
            </div>
            <div class="tool-content desktop-layout">
                <div class="input-section">
                    <div class="lorem-controls">
                        <div class="control-group">
                            <label for="loremType">Type:</label>
                            <select id="loremType">
                                <option value="paragraphs">Paragraphs</option>
                                <option value="words">Words</option>
                                <option value="sentences">Sentences</option>
                            </select>
                        </div>
                        <div class="control-group">
                            <label for="loremCount">Count:</label>
                            <input type="number" id="loremCount" value="3" min="1" max="100">
                        </div>
                        <div class="control-group">
                            <label>
                                <input type="checkbox" id="startWithLorem"> Start with "Lorem ipsum"
                            </label>
                        </div>
                        <button class="generate-btn" onclick="generateLorem()">Generate</button>
                    </div>
                </div>
                <div class="output-section">
                    <label for="loremOutput">Generated Text:</label>
                    <textarea id="loremOutput" readonly></textarea>
                    <button class="copy-btn" onclick="copyToClipboard('loremOutput')">Copy Text</button>
                </div>
            </div>
        </div>
    `;
}

export function initLoremIpsum() {
    generateLorem();
}

window.generateLorem = function() {
    const type = document.getElementById('loremType').value;
    const count = parseInt(document.getElementById('loremCount').value);
    const startWithLorem = document.getElementById('startWithLorem').checked;
    const output = document.getElementById('loremOutput');
    
    const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua'];
    
    let result = '';
    
    if (type === 'words') {
        const selectedWords = [];
        for (let i = 0; i < count; i++) {
            selectedWords.push(words[Math.floor(Math.random() * words.length)]);
        }
        result = selectedWords.join(' ');
    } else if (type === 'sentences') {
        for (let i = 0; i < count; i++) {
            const sentenceLength = Math.floor(Math.random() * 10) + 5;
            const sentence = [];
            for (let j = 0; j < sentenceLength; j++) {
                sentence.push(words[Math.floor(Math.random() * words.length)]);
            }
            result += sentence.join(' ').charAt(0).toUpperCase() + sentence.join(' ').slice(1) + '. ';
        }
    } else {
        for (let i = 0; i < count; i++) {
            const paragraph = [];
            const sentenceCount = Math.floor(Math.random() * 5) + 3;
            for (let j = 0; j < sentenceCount; j++) {
                const sentenceLength = Math.floor(Math.random() * 10) + 5;
                const sentence = [];
                for (let k = 0; k < sentenceLength; k++) {
                    sentence.push(words[Math.floor(Math.random() * words.length)]);
                }
                paragraph.push(sentence.join(' ').charAt(0).toUpperCase() + sentence.join(' ').slice(1) + '.');
            }
            result += paragraph.join(' ') + '\n\n';
        }
    }
    
    if (startWithLorem && !result.toLowerCase().startsWith('lorem')) {
        result = 'Lorem ipsum ' + result;
    }
    
    output.value = result.trim();
};