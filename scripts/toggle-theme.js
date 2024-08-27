function toggleTheme() {
    const folder = document.getElementById('root-folder').getAttribute('value');

    if (document.getElementById("theme-icon").src.endsWith("icons/moon.svg")) {
        document.getElementById("theme-icon").src = folder+"/"+"icons/sun.svg";
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');

        var posts = document.getElementsByClassName("post-block");
        for (let post of posts) {
            post.classList.remove("light-post-theme");
            post.classList.add("dark-post-theme");
        }

    } else if (document.getElementById("theme-icon").src.endsWith("icons/sun.svg")) {
        document.getElementById("theme-icon").src = folder +"/"+ "icons/moon.svg";

        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');

        var posts = document.getElementsByClassName("post-block");
        for (let post of posts) {
            post.classList.remove("dark-post-theme");
            post.classList.add("light-post-theme");
        }
    }
}
