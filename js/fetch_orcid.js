const orcidID = '0000-0003-2672-6291';

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
    const myNames = ['Cuong Nguyen', 'Cuong C. Nguyen', 'Nguyen, Cuong', 'Nguyen, Cuong C.', 'Nguyen, C.', 'Nguyen, C.C.']
    const worksUrl = `https://pub.orcid.org/v3.0/${orcidID}/works`;

    try {
        const response = await fetch(worksUrl, {
            headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();
        const publications = data.group;

        const publicationList = document.getElementById('publication-list');

        for (let pub of publications) {
            const workSummary = pub['work-summary'][0];
            const title = workSummary['title']['title']['value'];
            const putCode = workSummary['put-code'];  // Get the unique identifier for each work
            const journalTitle = workSummary['journal-title']['value'];
            // const paperType = workSummary.type;  // either journal-article, conference-paper, other (arxiv) or book-chapter

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
            pubItem.innerHTML = `${authors} (${pubYear}) <strong>${title}</strong> In <em>${journalTitle}</em>`;
            pubItem.style.marginTop = "10px";
            publicationList.appendChild(pubItem);
        }
    } catch (error) {
        console.error('Error fetching publications:', error);
    }
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