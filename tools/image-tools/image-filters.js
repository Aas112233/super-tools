export function loadImageFilters() {
    return `
        <div class="tool-container">
            <div class="tool-header">
                <h1>Image Filters</h1>
                <p>Apply various filters to your images</p>
            </div>
            <div class="tool-content desktop-layout">
                <div class="input-section">
                    <div class="upload-area" id="uploadArea">
                        <i class='bx bx-cloud-upload'></i>
                        <p>Drag & drop an image here or click to browse</p>
                        <input type="file" id="imageInput" accept="image/*" hidden>
                        <button class="browse-btn" onclick="document.getElementById('imageInput').click()">Browse Files</button>
                    </div>
                    <div class="filter-controls" id="filterControls" style="display: none;">
                        <div class="filter-options">
                            <button class="filter-btn" data-filter="none">Original</button>
                            <button class="filter-btn" data-filter="grayscale">Grayscale</button>
                            <button class="filter-btn" data-filter="sepia">Sepia</button>
                            <button class="filter-btn" data-filter="blur">Blur</button>
                            <button class="filter-btn" data-filter="brightness">Brightness</button>
                            <button class="filter-btn" data-filter="contrast">Contrast</button>
                        </div>
                    </div>
                </div>
                <div class="output-section">
                    <div class="preview-area">
                        <canvas id="filterCanvas" style="max-width: 100%; display: none;"></canvas>
                        <div class="placeholder" id="placeholder">Upload an image to apply filters</div>
                    </div>
                    <div class="download-actions" id="downloadActions" style="display: none;">
                        <button class="download-btn" onclick="downloadFilteredImage()">Download Filtered Image</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function initImageFilters() {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const filterControls = document.getElementById('filterControls');
    const canvas = document.getElementById('filterCanvas');
    const ctx = canvas.getContext('2d');
    const placeholder = document.getElementById('placeholder');
    const downloadActions = document.getElementById('downloadActions');
    
    let originalImage = null;
    
    uploadArea.addEventListener('click', () => imageInput.click());
    
    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleImageUpload(e.target.files[0]);
        }
    });
    
    function handleImageUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                originalImage = img;
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                placeholder.style.display = 'none';
                canvas.style.display = 'block';
                filterControls.style.display = 'block';
                downloadActions.style.display = 'block';
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!originalImage) return;
            
            const filter = btn.dataset.filter;
            applyFilter(filter);
        });
    });
    
    function applyFilter(filter) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        switch(filter) {
            case 'none':
                ctx.filter = 'none';
                break;
            case 'grayscale':
                ctx.filter = 'grayscale(100%)';
                break;
            case 'sepia':
                ctx.filter = 'sepia(100%)';
                break;
            case 'blur':
                ctx.filter = 'blur(5px)';
                break;
            case 'brightness':
                ctx.filter = 'brightness(150%)';
                break;
            case 'contrast':
                ctx.filter = 'contrast(150%)';
                break;
        }
        
        ctx.drawImage(originalImage, 0, 0);
        ctx.filter = 'none';
    }
}

window.downloadFilteredImage = function() {
    const canvas = document.getElementById('filterCanvas');
    const link = document.createElement('a');
    link.download = 'filtered-image.png';
    link.href = canvas.toDataURL();
    link.click();
};