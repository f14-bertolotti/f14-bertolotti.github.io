document.addEventListener("DOMContentLoaded", function() {
    // Select the footer element
    const bibtex = document.querySelector('.bibtex');
    const folder = document.getElementById('root-folder').getAttribute('value');

    // Define the content you want to add
    const pageTitle = document.querySelector('h1') ? document.querySelector('h1').textContent.trim() : 'Untitled';
    const pageUrl = window.location.href;
    const pageYear = bibtex.getAttribute('year');
    const pageMonth = bibtex.getAttribute('month');
    const pageDate = new Date().toISOString().split('T')[0];

    const bibContent = `
@misc{${pageTitle.replace(/\s+/g, '_').toLowerCase()}_${pageYear},
  author = {Bertolotti, Francesco},
  title = {${pageTitle}},
  url   = {${pageUrl}},
  note  = {Blog post, accessed: ${pageDate}},
  year  = {${pageYear}},
  month = {${pageMonth}},
}
    `;

    // Create a <pre><code> block to display it on the page
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.className = "language-bibtex";
    code.textContent = bibContent.trim();
    pre.appendChild(code);

    // create a pargraph to explain the bibtex entry
    const p = document.createElement('p');
    p.innerHTML = `If you found this page useful, please consider citing it using the following BibTeX entry:`;

    // create an h3 for the bibtex section
    const h3 = document.createElement('h3');
    h3.textContent = "Cite this page";

    // add h3 before p
    bibtex.appendChild(h3);

    // add p before pre
    bibtex.appendChild(p);

    // print bibContent inside bibtex element
    bibtex.appendChild(pre);

});

