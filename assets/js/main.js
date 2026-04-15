let applicationData = [];
let memoData = new Map();
let memoLastId = 0;
let currentEditIndex = null;


// Extract ID from URL hash
const getIdFromHash = () => window.location.hash.slice(1);


// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    const id = getIdFromHash();
    
    displayLayout(id);
    
    switch (id) {
        case 'new':
            console.log('Creating new entry');
            currentEditIndex = null;
            initForm();
            break;
        default:
            applicationData = fetchData();
            renderData();
            break;
        
    }

    

    document.querySelectorAll('nav ul li a').forEach((navLink) => {
        navLink.addEventListener('click', (event) => {
            event.preventDefault();
            const id = navLink.getAttribute('href').slice(1);
            console.log('Navigating to: [' + id + ']');
            
            displayLayout(id);
            if(id == '' || id == 'home') {
                
                renderData();
            } else if(id == 'new') {
                currentEditIndex = null;
                initForm();
            }
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

        if(currentEditIndex == null) {
            applicationData.unshift(newEntry);
        } else {
            applicationData[currentEditIndex] = newEntry;
        }
        localStorage.setItem("applicationData", JSON.stringify(applicationData));
        applicationData = fetchData();
        displayLayout("home");
        return;

    });

    document.getElementById('cancel_button').addEventListener('click', (event) => {
        displayLayout("home");
    });

});


function initForm(entry) {

    if(typeof entry === 'undefined') {
        document.querySelector('#company').value = '';
        document.querySelector('#job_title').value = '';
        document.querySelector('#application_date').value = '';
        document.querySelector('#contact_info').value = '';
        document.querySelector('#job_posting').value = '';
        document.querySelector('#status').value = '';

        document.querySelector('#status').value = '';
        return;
    }

    document.querySelector('#company').value = entry.company;
    document.querySelector('#job_title').value = entry.job_title;
    document.querySelector('#application_date').value = entry.date;
    document.querySelector('#contact_info').value = entry.contact_info;
    document.querySelector('#job_posting').value = entry.job_posting;
    document.querySelector('#status').value = entry.status;
}

// Display the layout with fetched data
function displayLayout(layout) {
    console.log('Displaying data:', layout);
    if(layout == '') {
        layout = 'home';
    }

    document.querySelectorAll('section').forEach((section) => {
        section.style.display = section.id === layout ? 'block' : 'none';
    });
    // Add your code to render the layout here
}


function fetchData() {
    const data = localStorage.getItem("applicationData");
    return data ? JSON.parse(data) : [];
}

function fetchMemoData() {
    const data = localStorage.getItem("memoData");
    return new Map(data ? JSON.parse(data) : []);
}

function renderData() {
    const homeSection = document.querySelector('#article-list');

    homeSection.innerHTML = '';
    console.log('Rendering data:', applicationData);
    applicationData.forEach((entry) => {
        const article = document.createElement('article');
        article.innerHTML = `
            <div class="company-name">${entry.company}</div>
            <div class="job-title">${entry.job_title}</div>
            <div class="application-date">${entry.date}</div>
        `;

        article.addEventListener('click', () => {
            displayLayout("new");
            currentEditIndex = applicationData.indexOf(entry);

             // Populate edit form with entry data
            initForm(entry);
        });
        homeSection.appendChild(article);
    });
}