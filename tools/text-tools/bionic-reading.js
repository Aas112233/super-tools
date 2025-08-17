export function loadBionicReading() {
    return `
        <div class="tool-container">
            <div class="tool-header">
                <h1>Bionic Reading Converter</h1>
                <p>Enhance reading speed and comprehension</p>
            </div>
            <div class="tool-content desktop-layout">
                <div class="input-section">
                    <label for="bionicInput">Enter your text:</label>
                    <textarea id="bionicInput" placeholder="Paste your text here to convert to bionic reading format..."></textarea>
                    <div class="bionic-options">
                        <div class="option-group">
                            <label for="boldPercentage">Bold Percentage:</label>
                            <input type="range" id="boldPercentage" min="30" max="70" value="50">
                            <span id="boldValue">50%</span>
                        </div>
                    </div>
                    <button class="convert-btn" onclick="convertToBionic()">Convert to Bionic</button>
                </div>
                <div class="output-section">
                    <label>Bionic Reading Result:</label>
                    <div class="bionic-output" id="bionicOutput">
                        <p>Your bionic reading text will appear here...</p>
                    </div>
                    <button class="copy-btn" onclick="copyBionicText()">Copy Bionic Text</button>
                </div>
            </div>
        </div>
    `;
}

export function initBionicReading() {
    const slider = document.getElementById('boldPercentage');
    const value = document.getElementById('boldValue');
    
    slider.addEventListener('input', () => {
        value.textContent = slider.value + '%';
    });
}

window.convertToBionic = function() {
    const input = document.getElementById('bionicInput');
    const output = document.getElementById('bionicOutput');
    const percentage = document.getElementById('boldPercentage').value;
    
    const text = input.value;
    const bionicText = text.replace(/\b\w+\b/g, word => {
        const boldLength = Math.ceil(word.length * (percentage / 100));
        return `<strong>${word.slice(0, boldLength)}</strong>${word.slice(boldLength)}`;
    });
    
    output.innerHTML = bionicText || 'Your bionic reading text will appear here...';
};

window.copyBionicText = function() {
    const output = document.getElementById('bionicOutput');
    navigator.clipboard.writeText(output.innerHTML);
    alert('Bionic text copied to clipboard!');
};