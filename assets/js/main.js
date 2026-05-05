

let applicationData = [];
let memoData = new Map();
let memoLastId = 0;
let currentEditIndex = null;


// Extract ID from URL hash
const getIdFromHash = () => window.location.hash.slice(1);

function insertMemo(applicationIdx, content) {
    const memoId = ++memoLastId;
    const date = new Date().toISOString();
    const memoContent = `${date}: ${content}`;
    memoData.set(memoId, {date, content});
    applicationData[applicationIdx].notes.push(memoId);
    localStorage.setItem("memoData", JSON.stringify(Array.from(memoData.entries())));
    localStorage.setItem("memoLastId", memoLastId.toString());
    localStorage.setItem("applicationData", JSON.stringify(applicationData));
}


function initForm(entry) {

    const companyInput = document.querySelector('#company');
    let companyDatalist = document.querySelector('#company_suggestions');

    if (!companyDatalist) {
        companyDatalist = document.createElement('datalist');
        companyDatalist.id = 'company_suggestions';
        companyInput.setAttribute('list', companyDatalist.id);
        companyInput.insertAdjacentElement('afterend', companyDatalist);
    }

    if (!companyInput.dataset.autocompleteInitialized) {
        companyInput.dataset.autocompleteInitialized = '1';
        let debounceTimer;

        companyInput.addEventListener('input', async () => {
            const keyword = companyInput.value.trim();
            companyDatalist.innerHTML = '';

            if (!keyword || keyword.length < 2) {
                return;
            }

            // Gives a very short delay while user is typing to avoid too many API calls.
            clearTimeout(debounceTimer); 
            debounceTimer = setTimeout(async () => {
                try {
                    const response = await fetch(`https://example-api.jhp.app/company.php?search=${encodeURIComponent(keyword)}`);
                    if (!response.ok) {
                        return;
                    }

                    const suggestions = await response.json();
                    if (suggestions.code != 200 || !Array.isArray(suggestions.data)) {
                        return;
                    }

                    suggestions.data.slice(0, 10).forEach((item) => {
                        const value = item.name.trim();
                        if (value) {
                            const option = document.createElement('option');
                            option.value = value;
                            companyDatalist.appendChild(option);
                        }
                    });
                } catch (error) {
                    console.error('Company autocomplete failed:', error);
                }
            }, 250);
        });
    }

    if(typeof entry === 'undefined') {
        document.querySelector('#company').value = '';
        document.querySelector('#job_title').value = '';
        document.querySelector('#application_date').value = '';
        document.querySelector('#contact_info').value = '';
        document.querySelector('#job_posting').value = '';
        document.querySelector('#status').value = '';

        document.querySelector('#status').value = '';
        document.querySelector('#delete_application_button').style.display = 'none';
        return;
    }

    document.querySelector('#company').value = entry.company;
    document.querySelector('#job_title').value = entry.job_title;
    document.querySelector('#application_date').value = entry.date;
    document.querySelector('#contact_info').value = entry.contact_info;
    document.querySelector('#job_posting').value = entry.job_posting;
    document.querySelector('#status').value = entry.status;
    document.querySelector('#delete_application_button').style.display = 'inline-block';

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

function renderData(filteredData) {
    const homeSection = document.querySelector('#article-list');

    homeSection.innerHTML = '';

    if(typeof filteredData == 'undefined') {
        filteredData = applicationData;
    }

    console.log('Rendering data:', filteredData);
    filteredData.forEach((entry) => {
        const article = document.createElement('article');
        article.innerHTML = `
            <div class="company-name">${entry.company}</div>
            <div class="job-title">${entry.job_title}</div>
            <div class="application-date">${entry.date}</div>
            <div class="application-status status-${entry.status}">${entry.status}</div>
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
        memoItem.id = `memo-${memoId}`;
        memoItem.innerHTML =  `<span class="memo-date">${memoContent.date}</span><br />${memoContent.content}`;

        const deleteLink = document.createElement('a');
        deleteLink.href = '#';
        deleteLink.textContent = 'Delete';
        deleteLink.addEventListener('click', (e) => {
            e.preventDefault();
            if(confirm('Are you sure you want to delete this memo?')) {
                memoData.delete(memoId);
                localStorage.setItem("memoData", JSON.stringify(Array.from(memoData.entries())));
                const memoIndex = applicationData[entryId].notes.indexOf(memoId);
                applicationData[entryId].notes.splice(memoIndex, 1);
                localStorage.setItem("applicationData", JSON.stringify(applicationData));
                document.querySelector(`#memo-${memoId}`).remove();
            }
        });

        memoItem.appendChild(deleteLink);
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

const moduleList = [
    'dom',
    'event'
];
const loadedModules = { size: 0 };

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    const id = getIdFromHash();
    
    moduleList.forEach((moduleName) => {
        
        import(`./${moduleName}.js`).then((module) => {
            
            module.default.init();
            loadedModules[moduleName] = module.default;
            loadedModules.size++;

            console.log(`Module [${moduleName}] loaded successfully.`);
        }).catch((error) => {
            console.error('Failed to load event module:', error);
        }).then(() => {
            if(loadedModules.size === moduleList.length) {
                
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
                        loadedModules.dom.renderApplicationList(applicationData);
                        break;
                    
                }
            }
        });
    });

    

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
                loadedModules.dom.renderApplicationList(applicationData);
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
            newEntry.notes = applicationData[currentEditIndex].notes || [];
            applicationData[currentEditIndex] = newEntry;
        }
        localStorage.setItem("applicationData", JSON.stringify(applicationData));
        
        displayLayout("home");
        applicationData = fetchData();
        loadedModules.dom.renderApplicationList(applicationData);
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

    document.getElementById('delete_application_button').addEventListener('click', (event) => {
        if(currentEditIndex !== null) {
            if(confirm('Are you sure you want to delete this application?')) {

                if(applicationData[currentEditIndex].notes) {
                    applicationData[currentEditIndex].notes.forEach((memoId) => {
                        memoData.delete(memoId);
                    });
                    localStorage.setItem("memoData", JSON.stringify(Array.from(memoData.entries())));
                }

                applicationData.splice(currentEditIndex, 1);
                localStorage.setItem("applicationData", JSON.stringify(applicationData));
                displayLayout("home");
                loadedModules.dom.renderApplicationList(applicationData);
            }
        }
    });

    document.querySelector('#search_input').addEventListener('input', (event) => {
        const query = event.target.value.toLowerCase();
        const filteredData = applicationData.filter((entry) => {
            return entry.company.toLowerCase().includes(query) || entry.job_title.toLowerCase().includes(query);
        });
        loadedModules.dom.renderApplicationList(filteredData);
    });
});