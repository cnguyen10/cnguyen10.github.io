const orcidID = '0000-0003-2672-6291';
let publications = [];  // Array to store all retrieved publications
let displayedCount = 0;  // Tracks the number of publications currently displayed
const pageSize = 10;  // Number of publications to fetch and display at a time

// Author name variations to bold in publications
const myNames = ['Cuong C. Nguyen', 'Nguyen, Cuong C.', 'Nguyen, C.C.', 'Cuong Nguyen', 'Nguyen, Cuong', 'Nguyen, C.'];

function formatString(str) {
    return str
        .replace(/(\B)[^ ]*/g, match => match.toLowerCase())
        .replace(/^[^ ]/g, match => match.toUpperCase());
}

async function fetchPublications() {
    const worksUrl = `https://pub.orcid.org/v3.0/${orcidID}/works`;

    try {
        const response = await fetch(worksUrl, {
            headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        publications = data.group || [];

        await displayPublications(publications);
    } catch (error) {
        console.error('Error fetching publications list:', error);
        // Reset state so the user can try clicking the button again
        const fetchButton = document.getElementById('fetch-button');
        if (fetchButton) {
            fetchButton.hidden = false;
        }
        // Let user know there was a fetch issue
        const publicationListElement = document.getElementById('publication-list');
        if (publicationListElement) {
            publicationListElement.innerHTML = '<div class="text-danger ms-3">Failed to load publications. Please try again.</div>';
        }
    }
}

// Display publications in parallel chunks (pagination)
async function displayPublications(publicationsList) {
    const publicationListElement = document.getElementById('publication-list');
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (!publicationListElement) return;

    const endIndex = Math.min(displayedCount + pageSize, publicationsList.length);
    const batch = publicationsList.slice(displayedCount, endIndex);

    // Fetch all details in parallel rather than sequentially
    const detailsPromises = batch.map(async (pub) => {
        const workSummary = pub['work-summary']?.[0];
        if (!workSummary) return null;

        const title = workSummary['title']?.['title']?.['value'] || 'Untitled';
        const putCode = workSummary['put-code'];
        const journalTitle = workSummary['journal-title']?.['value'] || 'Preprint';

        const workDetailsUrl = `https://pub.orcid.org/v3.0/${orcidID}/work/${putCode}`;
        try {
            const res = await fetch(workDetailsUrl, {
                headers: { 'Accept': 'application/json' }
            });
            if (!res.ok) return null;
            const workDetails = await res.json();
            return { title, journalTitle, workDetails };
        } catch (err) {
            console.error(`Error fetching work details for put-code ${putCode}:`, err);
            return null;
        }
    });

    const results = await Promise.all(detailsPromises);

    // Append fetched items to DOM
    results.forEach((item) => {
        if (!item) return;

        const { title, journalTitle, workDetails } = item;

        // Safely extract contributors/authors
        let authors = '';
        if (workDetails?.contributors?.contributor) {
            authors = workDetails.contributors.contributor
                .map(contributor => contributor['credit-name']?.['value'])
                .filter(Boolean)
                .join(', ');
        }

        // Bold the author's name in the list
        for (const myName of myNames) {
            if (authors.includes(myName)) {
                authors = authors.replace(myName, `<strong style="color: MidnightBlue;">${myName}</strong>`);
                break; // Stop at the first match to avoid nested replacements
            }
        }

        const pubYear = workDetails['publication-date']?.['year']?.['value'] || 'N/A';

        // Create list item for publication
        const pubItem = document.createElement('div');
        const formattedTitle = formatString(title);

        let publicationText = `
            <div class="g-col-10 ms-3 mb-0 pb-0"><b>${formattedTitle}</b></div>
            <div class="g-col-1 mb-0 pb-0"></div>
            <div class="g-col-1 mb-0 pb-0">${pubYear}</div>
            <div class="g-col-10 ms-3 my-0 py-0"><small>${authors}</small></div>
        `;
        if (journalTitle) {
            publicationText += `<div class="g-col-10 ms-3 my-0 py-0"><small>${journalTitle}</small></div>`;
        }

        pubItem.innerHTML = `
            <div class="grid gap-0 row-gap-0 column-gap-3">${publicationText}</div>
            <div class="g-col-10 ms-3 mb-0 pb-0"><hr></div>
        `;
        pubItem.style.marginTop = "10px";
        publicationListElement.appendChild(pubItem);
    });

    // Update displayed count
    displayedCount = endIndex;

    // Show/Hide "Display More" button
    if (loadMoreBtn) {
        loadMoreBtn.style.display = displayedCount < publicationsList.length ? 'block' : 'none';
    }
}

// Bind events cleanly when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const fetchButton = document.getElementById('fetch-button');
    const loadMoreBtn = document.getElementById('load-more-btn');
    let isDataFetched = false;

    if (fetchButton) {
        fetchButton.addEventListener('click', () => {
            if (!isDataFetched) {
                isDataFetched = true;
                fetchPublications();
            }
            fetchButton.hidden = true;
        });
    }

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            displayPublications(publications);
        });
    }
});