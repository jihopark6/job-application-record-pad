let applicationData = [];


// Extract ID from URL hash
const getIdFromHash = () => window.location.hash.slice(1);


// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    const id = getIdFromHash();
    
    
    switch (id) {
        case 'new':
            console.log('Creating new entry');
            displayLayout("new");
            break;
        default:
            applicationData = fetchData();
            displayLayout("home");
            renderData();
            break;
        
    }

    document.querySelectorAll('nav ul li a').forEach((navLink) => {
        navLink.addEventListener('click', (event) => {
            event.preventDefault();
            const id = navLink.getAttribute('href').slice(1);
            displayLayout(id);
        });
    });

    document.querySelector('#new_entity_form').addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const newEntry = {
            date: formData.get('application_date'),
            company: formData.get('company'),
            contact_info: formData.get('contact_info'),
            job_title: formData.get('job_title'),
            job_posting: formData.get('job_posting'),
            status: formData.get('status'),
            notes: []
        };
        console.log('New entry:', newEntry);
        applicationData.unshift(newEntry);
        localStorage.setItem("applicationData", JSON.stringify(applicationData));
        applicationData = fetchData();
        displayLayout("home");
        return;

    });

    document.getElementById('cancel_button').addEventListener('click', (event) => {
        displayLayout("home");
    });

});




// Display the layout with fetched data
function displayLayout(layout) {
    console.log('Displaying data:', layout);

    document.querySelectorAll('section').forEach((section) => {
        section.style.display = section.id === layout ? 'block' : 'none';
    });
    // Add your code to render the layout here
}


function fetchData() {
    const data = localStorage.getItem("applicationData");
    return data ? JSON.parse(data) : [];
}

function renderData() {
    const homeSection = document.querySelector('#article-list');

    homeSection.innerHTML = '';

    applicationData.forEach((entry) => {
        const article = document.createElement('article');
        article.innerHTML = `
            <div class="company-name">${entry.company}</div>
            <div class="job-title">${entry.job_title}</div>
            <div class="application-date">${entry.date}</div>
        `;
        homeSection.appendChild(article);
    });
}