
function bibtexToIeee(bibtex) {
    const { author, title, journal, year, volume, number, pages, publisher } = bibtex;
    let citationParts = [];
    if (author) citationParts.push(`${author}`);
    if (title) citationParts.push(`"${title}"`);
    if (journal) citationParts.push(`${journal}`);
    if (volume) citationParts.push(`vol. ${volume}`);
    if (number) citationParts.push(`no. ${number}`);
    if (pages) citationParts.push(`pp. ${pages}`);
    if (year) citationParts.push(`${year}`);
    let citation = citationParts.join(', ');
    if (publisher) citation += ` ${publisher}`;

    return citation + "." ;
}

function replaceCitations() {
    const citeElements = document.querySelectorAll('.cite');
    const bibliographyElement = document.querySelector('.bibliography');
    const references = [];

    citeElements.forEach((citeElement, index) => {
        const bibtex_id = citeElement.getAttribute('value');
        references.push(bibtexToIeee(bibliography[bibtex_id]));

        // Replace the cite element content with [i]
        citeElement.textContent = `[${index + 1}]`;
        const citationText = document.createTextNode(`[${index + 1}]`);

        // Replace the entire cite element with the text node
        citeElement.parentNode.replaceChild(citationText, citeElement)
    });

    // Generate the bibliography list
    const listElement = document.createElement('ol');
    const bibliography_header = document.createElement('h3');
    bibliography_header.textContent = "Bibliography";

    listElement.classList.add("bibliography");
    references.forEach(ref => {
        const listItem = document.createElement('li');
        listItem.textContent = ref;
        listElement.appendChild(listItem);
    });

    // Replace bibliography content with the list of references
    bibliographyElement.innerHTML = '';
    bibliographyElement.appendChild(bibliography_header);
    bibliographyElement.appendChild(listElement);
}

document.addEventListener('DOMContentLoaded', () => {
    replaceCitations();
});

const bibliography = {
    "Guo17" : {
        "title"   : "On Calibration of Modern Neural Networks",
        "author"  : "Guo, C and Pleiss, G and Sun, Y and Weinberger, K",
        "journal" : "ICML 2017",
        "year"    :  "2017"
    },

    "Oord18" : {
        "title"   : "Representation learning with contrastive predictive coding",
        "author"  : "Oord, Aaron van den and Li, Yazhe and Vinyals, Oriol",
        "journal" : "arXiv preprint arXiv:1807.03748",
        "year"    : "2018"
    },

    "Hastie09" : {
        "title"     : "Multi-class adaboost",
        "author"    : "Hastie, Trevor and Rosset, Saharon and Zhu, Ji and Zou, Hui",
        "journal"   : "Statistics and its Interface",
        "volume"    : "2",
        "number"    : "3",
        "pages"     : "349--360",
        "year"      : "2009",
        "publisher" : "International Press of Boston"
    }
}
