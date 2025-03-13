// This script adds the authentication script to all admin pages
const fs = require('fs');
const path = require('path');

// List of admin pages to update
const adminPages = [
    'news.html',
    'partner.html',
    'dr-photo.html',
    'dr-vedio.html',
    'summit.html',
    'linkedin-admin.html'
];

// Authentication script to add before the closing body tag
const authScript = `
    <!-- Authentication Script -->
    <script src="auth.js"></script>
`;

// Process each admin page
adminPages.forEach(page => {
    const filePath = path.join(__dirname, page);
    
    // Read the file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading ${page}:`, err);
            return;
        }
        
        // Check if auth.js is already included
        if (data.includes('auth.js')) {
            console.log(`${page} already includes auth.js`);
            return;
        }
        
        // Insert the auth script before the closing body tag
        const updatedContent = data.replace('</body>', `${authScript}\n</body>`);
        
        // Write the updated content back to the file
        fs.writeFile(filePath, updatedContent, 'utf8', err => {
            if (err) {
                console.error(`Error writing to ${page}:`, err);
                return;
            }
            console.log(`Successfully updated ${page}`);
        });
    });
});

console.log('Script started. Updating admin pages...');
