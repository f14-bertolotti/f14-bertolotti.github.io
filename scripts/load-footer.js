document.addEventListener("DOMContentLoaded", function() {
    // Select the footer element
    const footer = document.getElementById('footer');
    const folder = document.getElementById('root-folder').getAttribute('value');

    // Define the content you want to add
    const footerContent = `
        <footer class="footer"> 
        
        <div class="footer-contacts" >
        <a href="mailto:f14.bertolotti+disarray@gmail.com">                                <img src="[FOLDER]/icons/gmail.svg"     width=40px height=40px> </a>
        <a href="https://x.com/f14bertolotti">                                             <img src="[FOLDER]/icons/X.svg"         width=40px height=40px> </a>
        <a href="https://github.com/f14-bertolotti">                                       <img src="[FOLDER]/icons/github.svg"    width=40px height=40px> </a>
        <a href="https://scholar.google.com/citations?user=mFYoE-4AAAAJ&hl=it&authuser=1"> <img src="[FOLDER]/icons/scholar.svg"   width=40px height=40px> </a>
        <a href="https://www.instagram.com/f14.bertolotti">                                <img src="[FOLDER]/icons/instagram.svg" width=40px height=40px> </a>
        <a href="https://www.reddit.com/user/f14-bertolotti">                              <img src="[FOLDER]/icons/reddit.svg"    width=40px height=40px> </a>
        </div>

        </footer>
    `.replaceAll("[FOLDER]",folder);

    footer.innerHTML = footerContent;
});

