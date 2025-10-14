function toggleTheme() {
    const folder = document.getElementById('root-folder').getAttribute('value');
    const themeIcon = document.getElementById("theme-icon");
    const imgs = document.querySelectorAll("img");
    document.body.classList.toggle('dark-mode');
    if (themeIcon.src.endsWith("icons/moon.svg")) {
        themeIcon.src = folder + "/icons/sun.svg";
        // change images from *-light.* to *-dark.*
        imgs.forEach(img => {
            img.src = img.src.replace(/-light(\.[a-z]+)$/i, '-dark$1');
        });
    } else if (themeIcon.src.endsWith("icons/sun.svg")) {
        themeIcon.src = folder + "/icons/moon.svg";
        // change images from *-dark.* to *-light.*
        imgs.forEach(img => {
            img.src = img.src.replace(/-dark(\.[a-z]+)$/i, '-light$1');
        });
    }
}
