export function loadCaseConverter() {
    return `
        <div class="tool-container">
            <div class="tool-header">
                <h1>Case Converter</h1>
                <p>Convert text between different cases</p>
            </div>
            <div class="tool-content desktop-layout">
                <div class="input-section">
                    <label for="caseInput">Enter your text:</label>
                    <textarea id="caseInput" placeholder="Type or paste your text here..."></textarea>
                </div>
                <div class="output-section">
                    <div class="case-options">
                        <button class="case-btn" data-case="upper">UPPERCASE</button>
                        <button class="case-btn" data-case="lower">lowercase</button>
                        <button class="case-btn" data-case="title">Title Case</button>
                        <button class="case-btn" data-case="sentence">Sentence case</button>
                        <button class="case-btn" data-case="camel">camelCase</button>
                        <button class="case-btn" data-case="pascal">PascalCase</button>
                        <button class="case-btn" data-case="snake">snake_case</button>
                        <button class="case-btn" data-case="kebab">kebab-case</button>
                    </div>
                    <div class="result-area">
                        <label for="caseOutput">Result:</label>
                        <textarea id="caseOutput" readonly></textarea>
                        <button class="copy-btn" onclick="copyToClipboard('caseOutput')">Copy Result</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function initCaseConverter() {
    const input = document.getElementById('caseInput');
    const output = document.getElementById('caseOutput');
    const buttons = document.querySelectorAll('.case-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const caseType = btn.dataset.case;
            const text = input.value;
            output.value = convertCase(text, caseType);
        });
    });

    input.addEventListener('input', () => {
        const activeBtn = document.querySelector('.case-btn.active');
        if (activeBtn) {
            const caseType = activeBtn.dataset.case;
            output.value = convertCase(input.value, caseType);
        }
    });
}

function convertCase(text, caseType) {
    switch (caseType) {
        case 'upper': return text.toUpperCase();
        case 'lower': return text.toLowerCase();
        case 'title': return text.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        case 'sentence': return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        case 'camel': return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, '');
        case 'pascal': return text.replace(/(?:^\w|[A-Z]|\b\w)/g, word => word.toUpperCase()).replace(/\s+/g, '');
        case 'snake': return text.toLowerCase().replace(/\s+/g, '_');
        case 'kebab': return text.toLowerCase().replace(/\s+/g, '-');
        default: return text;
    }
}