// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    const id = getIdFromHash();
    
    switch (id) {
        case 'new':
            console.log('Creating new entry');
            break;
        default:
            const data = fetchData();
            displayLayout(data);
            break;
        
    }
});

// Extract ID from URL hash
const getIdFromHash = () => window.location.hash.slice(1);

// Display the layout with fetched data
function displayLayout(data) {
    console.log('Displaying data:', data);

    
    // Add your code to render the layout here
}


function fetchData() {
    const data = localStorage.getItem("applicationData");
    return data ? JSON.parse(data) : [];
}