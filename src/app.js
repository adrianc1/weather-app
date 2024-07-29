import { addTaskToUI, generateNav, modalControl } from "./ui";

// item object factory
function objFactory() {
    return {
        id: app.generateNewId(),
        title: null , 
        description: null,
        priority: null,
        dueDate: null,
    };
};

// subfolder factory 
function createSubFolder() {
    return {
        folderName: null,
        id: app.generateNewId(),
        list: []
    }
}

// main app logic

const app = (() => {
    const title = document.getElementById('task-title');
    const description = document.getElementById('task-description');
    const myprojects = document.getElementById('my-projects');
    let currFolder = null;    
    let sub = null;
    let masterFolderStored = JSON.parse(localStorage.getItem("Master Folder"));
    let masterFolder = (masterFolderStored !== null ) ? masterFolderStored : [];

 
// display folder titles in the nav
    masterFolder.forEach(f => {
        const h3El = document.createElement('h3');
        h3El.setAttribute('class', 'subproject' );
        let fname = f.folderName;
        h3El.innerHTML = fname;
        h3El.setAttribute('id', f.id);

        f.list.forEach(g => {
            addTaskToUI( f, g )
        })
        
        myprojects.appendChild(h3El);

        h3El.addEventListener( 'click', (e) => {
            e.preventDefault();
            let con = document.getElementById('content');
            con.innerHTML = ''
            masterFolder.forEach((folder) => {
                if (e.target.id === folder.id){
                    folder.list.forEach((i) => {
                        addTaskToUI( folder, i );
                    })
                    app.setCurrentFolder(folder.id)
                }
            })
        })
    })


// display the items from each list 


    // create sub folder

    function createSubFolderFunction(e) {
        if (e && e.preventDefault) {
            e.preventDefault();
        }

        document.getElementById('modal-container').style.display = 'flex';
        document.getElementById('task-form').style.display = 'none';
        document.getElementById('folder-form').style.display = 'flex';
        sub = createSubFolder(); 
        return sub;
    }

    // create new todolist item object
    function createNewListItem() {
        const newItemObj = objFactory();
        // Assuming objFactory creates a new task object

        // Add the new item to the current folder
        if (currFolder) {
            clearValues(title, description);
            modalControl(); // Assuming this hides the modal
        }

        document.getElementById('folder-form').style.display = 'none';
        document.getElementById('modal-container').style.display = 'flex';
        document.getElementById('task-form').style.display = 'flex'

        // let currFolderJSON = JSON.stringify(masterFolder)
        // localStorage.setItem('Master Folder', currFolderJSON);

        return { newItemObj } 
    }
    
    function addItem() {

        if (!currFolder) {
            // Handle case where no folder is selected
            currFolder = sub
            return;
        }

        // Create a new task object
        const newItemObj = objFactory(); // Assuming this function creates a new task object
        setValues(newItemObj);

        // Add the new task to the current folder
        currFolder.list.push(newItemObj);

        // Clear input values and update UI
        clearValues(title, description);
        addTaskToUI(currFolder, newItemObj);
        modalControl(); // Assuming this function handles modal closing

        let currFolderJSON = JSON.stringify(masterFolder)
        localStorage.setItem('Master Folder', currFolderJSON);

        console.log(masterFolder)
        
    }

    // CREATE NEW PROJECT 
    function newProject(e) {
        const content = document.getElementById('content');
        const projectTitle = document.getElementById('project-title');
        e.preventDefault();

        content.innerHTML = ""
        sub.folderName = projectTitle.value;
        masterFolder.push( sub );
        document.getElementById('folder-form').style.display = 'none';
        document.getElementById('modal-container').style.display = 'none';
        projectTitle.value = ''
        generateNav();
    }

    // set the list item values from input 
    function setValues( newItemObj ) {
        const dueDateValue = document.getElementById('date').value
        newItemObj.title = title.value;
        newItemObj.description = description.value;
        newItemObj.priority = radioBtnSelection();
        newItemObj.dueDate = dueDateValue;


        // find selected radio button 
        function radioBtnSelection() {
            const radios = document.getElementsByName('priority');
            for (const radio of radios) {
                if (radio.checked) {
                    return radio.value;
                }
            }
        }
    }

    function setCurrentFolder(id) {
        for ( let i = 0; i < masterFolder.length; i ++) {
                if( masterFolder[i].id === id ) {
                    currFolder = masterFolder[i]
                }
    }

    }
    // clear input values 
    function clearValues(title, description) {
            title.value = '';
            description.value = '';

            (function clearRadioBtn() {
                const radios = document.getElementsByName('priority');
                for (const radio of radios) {
                    radio.checked = false;
                }
            })();
    }

    // create new id for each todolist object
    function generateNewId() {
       const id = Math.random().toString(16).slice(9)
       return id;
    }

    function removeItem(e) {
        if (!e.target.classList.contains('fa-solid')) {
            return
          }
          const removeBtn = e.target;
          removeBtn.closest('ul').remove();
    };


    return { 
        createNewListItem,
        addItem,
        generateNewId,
        createSubFolderFunction,
        newProject,
        masterFolder,
        setCurrentFolder,
        removeItem,
    }
})();

export default app;