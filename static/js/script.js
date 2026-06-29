document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('fileElem');
    const myForm = document.querySelector('.my-form');
    const previewContainer = document.getElementById('preview-container');
    const imagePreview = document.getElementById('image-preview');
    const removeBtn = document.getElementById('remove-btn');
    
    const resultsSection = document.getElementById('results-section');
    const loader = document.getElementById('loader');
    const resultCard = document.getElementById('result-card');
    
    const predictedClassEl = document.getElementById('predicted-class');
    const confidenceScoreEl = document.getElementById('confidence-score');
    const resetBtn = document.getElementById('reset-btn');
    
    let currentFile = null;

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        dropArea.classList.add('highlight');
    }

    function unhighlight(e) {
        dropArea.classList.remove('highlight');
    }

    // Handle dropped files
    dropArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    // Export handleFiles to global scope for the input onchange event
    window.handleFiles = function(files) {
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                currentFile = file;
                previewFile(file);
                uploadFile(file);
            } else {
                alert('Please upload an image file.');
            }
        }
    };

    function previewFile(file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function() {
            imagePreview.src = reader.result;
            myForm.classList.add('hidden');
            previewContainer.classList.remove('hidden');
        };
    }

    function removeFile() {
        currentFile = null;
        fileInput.value = ''; // Reset input
        imagePreview.src = '';
        previewContainer.classList.add('hidden');
        myForm.classList.remove('hidden');
        resultsSection.classList.add('hidden');
    }

    removeBtn.addEventListener('click', removeFile);
    resetBtn.addEventListener('click', removeFile);

    function uploadFile(file) {
        // Show results section with loader
        resultsSection.classList.remove('hidden');
        loader.classList.remove('hidden');
        resultCard.classList.add('hidden');
        
        const url = '/predict';
        const formData = new FormData();
        formData.append('file', file);

        fetch(url, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            
            // Hide loader and show result
            loader.classList.add('hidden');
            resultCard.classList.remove('hidden');
            
            // Update UI
            predictedClassEl.textContent = data.class;
            confidenceScoreEl.textContent = data.confidence;
            
            // Update color based on confidence if it's parsed as number
            const confValue = parseFloat(data.confidence);
            if (confValue < 50) {
                confidenceScoreEl.style.color = 'var(--error-color)';
            } else {
                confidenceScoreEl.style.color = 'var(--primary-color)';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            loader.classList.add('hidden');
            alert('An error occurred during classification. Please try again.');
            removeFile();
        });
    }
});
