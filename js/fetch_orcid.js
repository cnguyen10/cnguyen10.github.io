const orcidID = '0000-0003-2672-6291';
let publications = [];  // Array to store all retrieved publications
let displayedCount = 0;  // Tracks the number of publications currently displayed
const pageSize = 10;  // Number of publications to fetch and display at a time

function formatString(str) {
    return str
    .replace(/(\B)[^ ]*/g, match => (match.toLowerCase()))
    .replace(/^[^ ]/g, match => (match.toUpperCase()));
}

async function fetchBiography() {
    const personUrl = `https://pub.orcid.org/v3.0/${orcidID}/personal-details`;

    try{
        const response = await fetch(personUrl, {
            headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();

        const biographyDiv = document.getElementById('biography');
        biographyDiv.innerHTML = data.biography.content;
    } catch (error) {
        console.error('Error fetching publications:', error);
    }
}

async function fetchPublications() {
    // load list of publications from Orcid
    const worksUrl = `https://pub.orcid.org/v3.0/${orcidID}/works`;

    try {
        const response = await fetch(worksUrl, {
            headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();
        publications = data.group;

        displayPublications(publications);
    } catch (error) {
        console.error('Error fetching publications:', error);
    }
}

// Display publications in chunks (pagination)
async function displayPublications(publications) {
    const myNames = ['Cuong C. Nguyen', 'Nguyen, Cuong C.', 'Nguyen, C.C.', 'Cuong Nguyen', 'Nguyen, Cuong', 'Nguyen, C.']

    const publicationList = document.getElementById('publication-list');

    // Display publications in batches of `pageSize`
    for (let i = displayedCount; i < Math.min(displayedCount + pageSize, publications.length); i++) {
    const workSummary = publications[i]['work-summary'][0];
    const title = workSummary['title']['title']['value'];
    const putCode = workSummary['put-code'];  // Get the unique identifier for each work

    let journalTitle = null;
    if (workSummary['journal-title'] != null) {
        journalTitle = workSummary['journal-title']['value'];
    }
    
    let workUrl = null;
    if (workSummary['url'] != null) {
        workUrl = workSummary['url']['value'];
    }

    // Fetch detailed information about the publication
    const workDetailsUrl = `https://pub.orcid.org/v3.0/${orcidID}/work/${putCode}`;
    const workDetailsResponse = await fetch(workDetailsUrl, {
    headers: { 'Accept': 'application/json' }
    });
    const workDetails = await workDetailsResponse.json();

    // Get the list of contributors (authors)
    let authors = workDetails.contributors.contributor
        .map(contributor => contributor['credit-name']['value'])
        .join(', ');

    // bold my name in the author list
    for (let myName of myNames) {
        authors = authors.replace(myName, `<strong style="color: MidnightBlue;">${myName}</strong>`);
    }
    
    const pubYear = workDetails['publication-date']['year']['value'];

    // Create list item for publication
    const pubItem = document.createElement('li');
    const pub_title = formatString(title);
    let publication_text = `${authors} (${pubYear}) <strong>${pub_title}</strong>.`;
    if (journalTitle != null) {
        publication_text = publication_text + ` In <em>${journalTitle}.</em>`;
    }
    publication_text = publication_text + ` ${workUrl}`;
    pubItem.innerHTML = publication_text;
    pubItem.style.marginTop = "10px";
    publicationList.appendChild(pubItem);
    }

    // Update displayed count
    displayedCount += pageSize;

    // Show the "Display More" button if there are more publications to load
    if (displayedCount < publications.length) {
    document.getElementById('load-more-btn').style.display = 'block';
    } else {
    document.getElementById('load-more-btn').style.display = 'none';
    }
}

// Load more publications when "Display More" is clicked
function fetchMorePublications() {
    displayPublications(publications);
}

const fetchButton = document.getElementById('fetch-button');
let isDataFetched = false;

fetchButton.addEventListener('click', () => {
    if (!isDataFetched) {
        fetchPublications();
        isDataFetched = true;
    }
    fetchButton.hidden = true;
});