document.addEventListener("DOMContentLoaded", function() {
    // Select the header element
    const header = document.getElementById('header');
    const folder = document.getElementById('root-folder').getAttribute('value');

    // Define the content you want to add
    const headerContent = `
        <header class="header">
            <div class="header-item">
                <button class="theme-button" onclick="toggleTheme()">
                    <img id="theme-icon" src="[FOLDER]/icons/moon.svg"/>
                </button> 
            </div>
        
            <div class="header-item">
                <a href="[FOLDER]/index.html" title="Posts" style="text-decoration: none; color:inherit">
                    <span class="active">Disarray</span>
                </a>
            </div>
        
            <div class="header-item">
                <div class="elem">
                    <a href="[FOLDER]/index.html" title="Posts" style="text-decoration: none; color:inherit">
                        <span class="active">Posts</span>
                    </a>
                </div>
            </div>

            <div class="header-item">
                <div class="elem">
                    <a href="[FOLDER]/about.html" title="About" style="text-decoration: none; color:inherit">
                        <span class="active">About</span>
                    </a>
                </div>
            </div>
        </header>
    `.replaceAll("[FOLDER]",folder);

    header.innerHTML = headerContent;
});


