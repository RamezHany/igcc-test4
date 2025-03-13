/**
 * Config Manager - Shared functionality for managing config.json
 * This file contains common functions used across the configuration pages
 */

// GitHub repository information
const REPO_OWNER = 'RamezHany';
const REPO_NAME = 'IGCCe-tr';
const CONFIG_PATH = 'config.json';
const API_BASE_URL = 'https://api.github.com';
const RAW_CONTENT_BASE_URL = 'https://raw.githubusercontent.com/RamezHany/IGCCe-tr/main';

// Default GitHub token - this is used if no token is provided by the user
const DEFAULT_GITHUB_TOKEN = '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'; // Replace with a valid token

/**
 * Get GitHub token from localStorage or use the default token
 * @returns {string} The GitHub token
 */
function getGitHubToken() {
    return localStorage.getItem('githubToken') || DEFAULT_GITHUB_TOKEN;
}

/**
 * Save GitHub token to localStorage
 * @param {string} token - The GitHub token to save
 * @returns {boolean} True if token was saved, false otherwise
 */
function saveGitHubToken(token) {
    if (!token || token.trim() === '') {
        return false;
    }
    
    localStorage.setItem('githubToken', token.trim());
    return true;
}

/**
 * Fetch the current config.json from GitHub
 * @returns {Promise<Object>} Object containing config data and SHA
 */
async function fetchConfigFromGitHub() {
    try {
        const token = getGitHubToken();
        const headers = {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        };
        
        const response = await fetch(`${API_BASE_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${CONFIG_PATH}`, {
            headers: headers
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch config: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        return {
            configData: JSON.parse(atob(data.content)),
            configSha: data.sha
        };
    } catch (error) {
        console.error('Error fetching config:', error);
        throw error;
    }
}

/**
 * Update config.json on GitHub
 * @param {Object} configData - The updated config data
 * @param {string} configSha - The current SHA of the config file
 * @param {string} [token] - GitHub token (optional, will use default if not provided)
 * @param {string} commitMessage - Commit message for the update
 * @returns {Promise<Object>} Updated config data and SHA
 */
async function updateConfigOnGitHub(configData, configSha, token, commitMessage) {
    // Use provided token or default
    const authToken = token || getGitHubToken();
    
    try {
        console.log('Updating config.json with data:', JSON.stringify(configData));
        
        // Ensure we have a proper base64 encoded content
        const contentStr = JSON.stringify(configData, null, 2);
        console.log('Stringified content:', contentStr);
        
        const content = btoa(contentStr);
        console.log('Base64 encoded content (first 50 chars):', content.substring(0, 50));
        
        const response = await fetch(`${API_BASE_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${CONFIG_PATH}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${authToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: commitMessage || 'Update config.json',
                content: content,
                sha: configSha
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('GitHub API error response:', errorData);
            throw new Error(`Failed to update config.json: ${JSON.stringify(errorData)}`);
        }
        
        const data = await response.json();
        console.log('GitHub API success response:', data);
        
        return {
            configData: configData,
            configSha: data.content.sha
        };
    } catch (error) {
        console.error('Error updating config.json:', error);
        throw error;
    }
}

/**
 * Upload a file to GitHub
 * @param {string} base64Content - Base64 encoded content of the file
 * @param {string} path - Path where to store the file in the repo
 * @param {string} [token] - GitHub token (optional, will use default if not provided)
 * @param {string} commitMessage - Commit message for the upload
 * @returns {Promise<string>} Path to the uploaded file
 */
async function uploadFileToGitHub(base64Content, path, token, commitMessage) {
    // Use provided token or default
    const authToken = token || getGitHubToken();
    
    try {
        const response = await fetch(`${API_BASE_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${authToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: commitMessage || `Upload file: ${path}`,
                content: base64Content
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to upload file: ${JSON.stringify(errorData)}`);
        }
        
        const data = await response.json();
        // Return the full URL to the raw content without double slashes
        return `${RAW_CONTENT_BASE_URL}/${path.replace(/^\//, '')}`;
    } catch (error) {
        console.error('Error uploading file to GitHub:', error);
        throw error;
    }
}

/**
 * Read a file as base64
 * @param {File} file - The file to read
 * @returns {Promise<string>} Base64 encoded content of the file
 */
function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            // Extract base64 data from the result
            const base64Data = reader.result.split(',')[1];
            resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Generate a unique filename with timestamp
 * @param {string} originalName - Original filename
 * @param {string} prefix - Prefix to add to the filename
 * @returns {string} Unique filename
 */
function generateUniqueFilename(originalName, prefix = 'file') {
    const timestamp = new Date().getTime();
    const fileExtension = originalName.split('.').pop();
    return `${prefix}_${timestamp}.${fileExtension}`;
}

/**
 * Validate if a file is an image
 * @param {File} file - The file to validate
 * @returns {boolean} True if file is an image, false otherwise
 */
function isImageFile(file) {
    return file && file.type.match('image.*');
}

/**
 * Validate if a string is a valid Vimeo embed URL
 * @param {string} url - The URL to validate
 * @returns {boolean} True if URL is a valid Vimeo embed URL, false otherwise
 */
function isValidVimeoEmbedUrl(url) {
    return url && 
           url.trim() !== '' && 
           url.includes('player.vimeo.com/video/');
}
