import app from './app';

export function generateNav() {

    const h3El = document.createElement('h3');

    const myprojects = document.getElementById('my-projects');
    h3El.setAttribute('class', 'subproject' );

    // code for getting title of each task
    app.masterFolder.forEach((sub) => {
        h3El.innerHTML = sub.folderName;
        h3El.setAttribute('id', sub.id)
    })
    myprojects.appendChild(h3El);

    h3El.addEventListener( 'click', (e) => {
        e.preventDefault();
        let con = document.getElementById('content');
        con.innerHTML = ''
        app.masterFolder.forEach((folder) => {
            if (e.target.id === folder.id){
                folder.list.forEach((i) => {
                    addTaskToUI( folder, i );
                })
                app.setCurrentFolder(folder.id)
            }
        })
    })
};

export function addTaskToUI(sub, task) {
    const content = document.getElementById('content');

    const subTitle = document.getElementById('current-project-title');

    subTitle.innerHTML = sub.folderName;

    const html = `<ul class="task-ul" id=${task.id}>
            <input type="radio">
            
            <li class="task-li">
                <div class="item-title">${task.title}</div>
                <div class="item-desc">${task.description}</div>
                <div class="item-priority">${task.priority}</div>
                <div class="item-due-date">${task.dueDate}</div>
            </li>
            <i class="fa-solid fa-trash" id="trash"></i>

        </ul>`
    content.innerHTML += html

};


export function modalControl() {
    const modalContainer = document.getElementById('modal-container')
    const taskForm = document.getElementById('task-form');
    const folderForm = document.getElementById('folder-form');

    if ( modalContainer.style.display == 'none' ) {
        modalContainer.style.display = 'flex'
    } else if (modalContainer.style.display = 'flex') {
        modalContainer.style.display = 'none'
    }

}