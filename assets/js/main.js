let applicationData = [];
let memoData = new Map();
let memoLastId = 0;
let currentEditIndex = null;


// Extract ID from URL hash
const getIdFromHash = () => window.location.hash.slice(1);

function insertMemo(applicationIdx, content) {
    const memoId = ++memoLastId;
    memoData.set(memoId, content);
    applicationData[applicationIdx].notes.push(memoId);
    localStorage.setItem("memoData", JSON.stringify(Array.from(memoData.entries())));
    localStorage.setItem("memoLastId", memoLastId.toString());
    localStorage.setItem("applicationData", JSON.stringify(applicationData));
}

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
        case 'memo':
            applicationData = fetchData();
            renderAppSelectBox();
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
            if(id == 'memo') {
                renderAppSelectBox();
                //renderData();
            } else if(id == 'new') {
                currentEditIndex = null;
                initForm();
            } else {
                renderData();
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
        
        displayLayout("home");
        applicationData = fetchData();
        renderData();
        return;

    });

    document.querySelector('#new_memo_form').addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);    
        const applicationIdx = formData.get('job_application');
        const content = formData.get('memo_content');
        insertMemo(applicationIdx, content);
        alert('Memo added successfully!');
        document.querySelector('#memo_content').value = '';
        displayLayout("home");
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

    renderMemoData(currentEditIndex);

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
    memoLastId = parseInt(localStorage.getItem("memoLastId")) || 0;
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

function renderMemoData(entryId) {

    const memoListSection = document.querySelector('#application_memo_list');
    memoListSection.innerHTML = '';

    if(entryId === null) {
        return;
    }

    memoData = fetchMemoData();

console.log(applicationData[entryId].notes);
    console.log(memoData);
    applicationData[entryId].notes.forEach((memoId) => {
        const memoContent = memoData.get(memoId);
        const memoItem = document.createElement('div');
        memoItem.classList.add('memo-item');
        memoItem.textContent = memoContent;
        memoListSection.appendChild(memoItem);
    });
}

function renderAppSelectBox() {
    document.querySelector('#job_application').innerHTML = '';
    applicationData.forEach((entry, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${entry.company} - ${entry.job_title}`;
        document.querySelector('#job_application').appendChild(option);
    });
}


function loadMemoData() {
}