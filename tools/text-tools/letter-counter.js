export function loadLetterCounter() {
    return `
        <div class="tool-container">
            <div class="tool-header">
                <h1>Letter Counter</h1>
                <p>Count characters, words, sentences, and paragraphs</p>
            </div>
            <div class="tool-content desktop-layout">
                <div class="input-section">
                    <label for="counterInput">Enter your text:</label>
                    <textarea id="counterInput" placeholder="Type or paste your text here..."></textarea>
                </div>
                <div class="output-section">
                    <div class="counter-stats">
                        <div class="stat-item">
                            <span class="stat-number" id="charCount">0</span>
                            <span class="stat-label">Characters</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number" id="charNoSpaceCount">0</span>
                            <span class="stat-label">Characters (no spaces)</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number" id="wordCount">0</span>
                            <span class="stat-label">Words</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number" id="sentenceCount">0</span>
                            <span class="stat-label">Sentences</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number" id="paragraphCount">0</span>
                            <span class="stat-label">Paragraphs</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function initLetterCounter() {
    const input = document.getElementById('counterInput');
    
    function updateCounts() {
        const text = input.value;
        document.getElementById('charCount').textContent = text.length;
        document.getElementById('charNoSpaceCount').textContent = text.replace(/\s/g, '').length;
        document.getElementById('wordCount').textContent = text.trim() ? text.trim().split(/\s+/).length : 0;
        document.getElementById('sentenceCount').textContent = text.split(/[.!?]+/).filter(s => s.trim()).length;
        document.getElementById('paragraphCount').textContent = text.split(/\n\s*\n/).filter(p => p.trim()).length;
    }
    
    input.addEventListener('input', updateCounts);
    updateCounts();
}