const domModule = {
    init() {
        console.log('DOM Manager initialized');
    },


    renderApplicationList(filteredData) {
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


    
};

export { domModule as default };