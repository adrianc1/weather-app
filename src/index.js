import app from './app.js';
import ui from './ui.js';
import './style.css';

// function to handle event listeners 
(function handleEvents() {
    const taskbtn = document.getElementById('submit');
    const projectBtn = document.getElementById('submit-project');
    const createTask = document.getElementById('create');
    const createProject = document.getElementById('create-pjt');
    const show = document.getElementById('show');
    const trash = document.getElementById('trash');
    const content = document.getElementById('content');

    // add new project 
    projectBtn.addEventListener( 'click', app.newProject  )

    // add item to the list
    taskbtn.addEventListener( 'click', app.addItem );

    // create new object list 
    createTask.addEventListener( 'click', app.createNewListItem );

    // create new folder
    createProject.addEventListener( 'click', app.createSubFolderFunction );

    show.addEventListener( 'click', app.showList )

    content.addEventListener('click', (event) => {
        console.log(event.target);
        if (event.target.classList.contains('fa-trash')) {
            const taskElement = event.target.closest('ul');
            let selectedID = taskElement.id; 
            taskElement.remove();

            // remove deleted item from list array in master folder 
            app.masterFolder.forEach(f => {
                f.list = f.list.filter( item => item.id !== selectedID )
            })
        }
    });

})();

window.addEventListener('load', app.createSubFolderFunction);
