class QueuedFile {
    constructor (file) {
        this.file = file;
        this.preview = document.createElement('img');
        this.dom = document.createElement('template');
        this.dom.innerHTML = `
        <div class="queued-file">
            <img class="queued-file-thumbnail"></img>
            <p class="queued-file-title">
                ${file.name}
            </p>
        </div>
        `;
        this.imgDOM = this.dom.content.querySelector('img');
        let reader = new FileReader();
        reader.readAsDataURL(this.file);
        reader.onloadend = () => {
            this.imgDOM.src = reader.result;
        }
    }
}

let dropArea = document.getElementById('drop-area');

['dragenter', 'dragover', 'dragleave', 'drop',].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults (event) {
    event.preventDefault();
    event.stopPropagation();
}

['dragenter', 'dragover',].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop',].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
});

function highlight (event) {
    dropArea.classList.add('highlight');
}

function unhighlight (event) {
    dropArea.classList.remove('highlight');
}

dropArea.addEventListener('drop', handleDrop, false);

function handleDrop (event) {
    let files = event.dataTransfer.files;
    handleFiles(files);
}

function handleFiles (files) {
    //([...files]).forEach(uploadFile);
    fileQueue = [...fileQueue, ...files];
    fileQueueDOM.innerHTML = "";
    for (file of fileQueue) {
        fileQueueDOM.appendChild((new QueuedFile(file)).dom.content);
    }
}

function generatePreview (file, imageDOM) {
    let reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onloadend = () => {
        imageDOM.src = reader.result;
    }
}

function uploadFile (file) {
    const url = 'api.php';
    let formData = new FormData();
    formData.append('file', file);

    fetch(url, {
        method: 'POST',
        body: formData,
    })
    .then(() => {})
    .catch((error) => {console.log(error)})
}

let fileQueue = [];
let fileQueueDOM = document.getElementById('file-queue');

document.addEventListener('paste', (event) => {
    console.log(event);
    // check the github link you bookmarked from xPaw's 'theLounge' file upload example
});
