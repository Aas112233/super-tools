export function loadGoogleFontsPairFinder() {
    return `
        <div class="tool-container">
            <div class="tool-header">
                <h1>Google Fonts Pair Finder</h1>
                <p>Discover perfect font combinations</p>
            </div>
            <div class="tool-content desktop-layout">
                <div class="input-section">
                    <div class="font-search">
                        <label for="fontSearch">Search Fonts:</label>
                        <input type="text" id="fontSearch" placeholder="Search Google Fonts...">
                    </div>
                    <div class="font-categories">
                        <button class="category-btn active" data-category="all">All</button>
                        <button class="category-btn" data-category="serif">Serif</button>
                        <button class="category-btn" data-category="sans-serif">Sans Serif</button>
                        <button class="category-btn" data-category="display">Display</button>
                        <button class="category-btn" data-category="handwriting">Handwriting</button>
                        <button class="category-btn" data-category="monospace">Monospace</button>
                    </div>
                    <button class="generate-btn" onclick="generateFontPair()">Generate New Pair</button>
                </div>
                <div class="output-section">
                    <div class="font-pairs" id="fontPairs">
                        <div class="font-pair">
                            <div class="pair-header">
                                <h3 id="pairTitle">Roboto + Open Sans</h3>
                                <button class="use-pair-btn">Use This Pair</button>
                            </div>
                            <div class="pair-preview">
                                <div class="primary-font" id="primaryFont" style="font-family: 'Roboto', sans-serif;">
                                    <h2>Primary Font (Roboto)</h2>
                                    <p>The quick brown fox jumps over the lazy dog</p>
                                </div>
                                <div class="secondary-font" id="secondaryFont" style="font-family: 'Open Sans', sans-serif;">
                                    <h3>Secondary Font (Open Sans)</h3>
                                    <p>The quick brown fox jumps over the lazy dog</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function initGoogleFontsPairFinder() {
    // Implementation placeholder
}

window.generateFontPair = function() {
    const pairs = [
        {primary: 'Playfair Display', secondary: 'Source Sans Pro'},
        {primary: 'Montserrat', secondary: 'Open Sans'},
        {primary: 'Oswald', secondary: 'Lato'},
        {primary: 'Raleway', secondary: 'Roboto'},
        {primary: 'Poppins', secondary: 'Inter'}
    ];
    
    const randomPair = pairs[Math.floor(Math.random() * pairs.length)];
    
    document.getElementById('pairTitle').textContent = `${randomPair.primary} + ${randomPair.secondary}`;
    document.getElementById('primaryFont').style.fontFamily = `'${randomPair.primary}', sans-serif`;
    document.getElementById('secondaryFont').style.fontFamily = `'${randomPair.secondary}', sans-serif`;
    document.getElementById('primaryFont').querySelector('h2').textContent = `Primary Font (${randomPair.primary})`;
    document.getElementById('secondaryFont').querySelector('h3').textContent = `Secondary Font (${randomPair.secondary})`;
};