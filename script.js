document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', currentTheme);

    // Update icon based on current theme
    function updateThemeIcon() {
        const icon = themeToggle.querySelector('i');
        if (body.getAttribute('data-theme') === 'dark') {
            icon.className = 'bx bx-sun';
        } else {
            icon.className = 'bx bx-moon';
        }
    }

    updateThemeIcon();

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon();
    });

    // Sidebar Collapse
    const collapseHeaders = document.querySelectorAll('.collapse-header');

    collapseHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const collapseItem = header.parentElement;
            const icon = header.querySelector('.expand-icon i');
            
            collapseItem.classList.toggle('expanded');
            icon.classList.toggle('rotated');
        });
    });

    // Tool Selection
    const toolLinks = document.querySelectorAll('.category-tool');
    const toolInterface = document.getElementById('toolInterface');
    const sidebar = document.querySelector('.sidebar');

    if (sidebar) {
        // Sidebar collapse/expand handlers
        sidebar.addEventListener('mouseenter', () => {
            if (sidebar.classList.contains('collapsed')) {
                sidebar.classList.add('hover-expanded');
            }
        });

        sidebar.addEventListener('mouseleave', () => {
            sidebar.classList.remove('hover-expanded');
        });

        sidebar.addEventListener('click', () => {
            if (sidebar.classList.contains('collapsed')) {
                sidebar.classList.add('hover-expanded');
            }
        });
    }

    function collapseSidebar() {
        if (sidebar) sidebar.classList.add('collapsed');
    }

    function expandSidebar() {
        if (sidebar) sidebar.classList.remove('collapsed');
    }

    // Make functions globally available
    window.collapseSidebar = collapseSidebar;
    window.expandSidebar = expandSidebar;

    toolLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all tools
            toolLinks.forEach(tool => tool.classList.remove('active'));
            
            // Add active class to clicked tool
            link.classList.add('active');
            
            // Get tool name and load content
            const toolName = link.querySelector('.tool-name').textContent;
            
            // Only load tool if toolInterface exists
            if (toolInterface && window.loadTool) {
                loadTool(toolName);
            }
            
            // Collapse sidebar when tool is selected
            setTimeout(() => {
                collapseSidebar();
            }, 100);
        });
    });

    // Load default tool only if toolInterface exists
    if (toolInterface && window.loadTool) {
        loadTool('Case Converter');
    }
});

// Tool mapping for dynamic imports
const toolMap = {
    'Case Converter': 'case-converter',
    'Lorem Ipsum Generator': 'lorem-ipsum',
    'Letter Counter': 'text-tools/letter-counter',
    'Text to Handwriting Converter': 'text-tools/text-to-handwriting',
    'Bionic Reading Converter': 'text-tools/bionic-reading',
    'Multiple Whitespace Remover': 'text-tools/whitespace-remover',
    'Google Fonts Pair Finder': 'text-tools/google-fonts-pair-finder',
    'Image Cropper': 'image-cropper',
    'Image Filters': 'image-tools/image-filters'
};

window.loadTool = async function(toolName) {
    const toolInterface = document.getElementById('toolInterface');
    if (!toolInterface) return;
    
    const toolFile = toolMap[toolName];
    
    if (toolFile) {
        try {
            const module = await import(`./tools/${toolFile}.js`);
            const fileName = toolFile.split('/').pop();
            const functionName = fileName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
            
            const loadFunction = module[`load${functionName}`];
            const content = loadFunction();
            toolInterface.innerHTML = content;
            
            // Initialize the tool
            const initFunction = module[`init${functionName}`];
            if (initFunction) {
                initFunction();
            }
        } catch (error) {
            console.error(`Failed to load tool: ${toolName}`, error);
            showComingSoon(toolName);
        }
    } else {
        showComingSoon(toolName);
    }
}

function showComingSoon(toolName) {
    const content = `
        <div class="tool-container">
            <div class="tool-header">
                <h1>${toolName}</h1>
                <p>Coming Soon</p>
            </div>
            <div class="tool-content">
                <p>We're working hard to bring you this tool. Check back soon!</p>
            </div>
        </div>
    `;
    toolInterface.innerHTML = content;
}

// Global utility functions
window.copyToClipboard = function(elementId) {
    const element = document.getElementById(elementId);
    element.select();
    document.execCommand('copy');
    
    // Show feedback
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    setTimeout(() => {
        button.textContent = originalText;
    }, 2000);
};