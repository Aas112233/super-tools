export function loadWhitespaceRemover() {
    return `
        <div class="tool-container">
            <div class="tool-header">
                <h1>Multiple Whitespace Remover</h1>
                <p>Clean up extra spaces and formatting</p>
            </div>
            <div class="tool-content desktop-layout">
                <div class="input-section">
                    <label for="whitespaceInput">Enter your text:</label>
                    <textarea id="whitespaceInput" placeholder="Paste text with multiple spaces here..."></textarea>
                    <div class="whitespace-options">
                        <label><input type="checkbox" id="removeExtraSpaces" checked> Remove extra spaces</label>
                        <label><input type="checkbox" id="removeExtraLines" checked> Remove extra line breaks</label>
                        <label><input type="checkbox" id="trimLines" checked> Trim line endings</label>
                        <label><input type="checkbox" id="removeAllSpaces"> Remove all spaces</label>
                    </div>
                    <button class="clean-btn" onclick="cleanWhitespace()">Clean Text</button>
                </div>
                <div class="output-section">
                    <label for="whitespaceOutput">Cleaned Text:</label>
                    <textarea id="whitespaceOutput" readonly></textarea>
                    <button class="copy-btn" onclick="copyToClipboard('whitespaceOutput')">Copy Cleaned Text</button>
                </div>
            </div>
        </div>
    `;
}

export function initWhitespaceRemover() {
    const input = document.getElementById('whitespaceInput');
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    input.addEventListener('input', cleanWhitespace);
    checkboxes.forEach(cb => cb.addEventListener('change', cleanWhitespace));
}

window.cleanWhitespace = function() {
    const input = document.getElementById('whitespaceInput');
    const output = document.getElementById('whitespaceOutput');
    let text = input.value;
    
    if (document.getElementById('removeExtraSpaces').checked) {
        text = text.replace(/[ \t]+/g, ' ');
    }
    if (document.getElementById('removeExtraLines').checked) {
        text = text.replace(/\n\s*\n/g, '\n');
    }
    if (document.getElementById('trimLines').checked) {
        text = text.split('\n').map(line => line.trim()).join('\n');
    }
    if (document.getElementById('removeAllSpaces').checked) {
        text = text.replace(/\s/g, '');
    }
    
    output.value = text;
};