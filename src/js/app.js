// ====== DOM Elements ======
const taskBox = document.querySelector('#caja-tarea')
const searchInput = document.querySelector('#search')
const buscador = document.querySelector('#buscador')
const taskContain = document.querySelector('.contenedor-tareas')
const completedContain = document.querySelector('.contenedor-completadas')
const btnAgregar = document.querySelector('.boton-agregar')
const btnToggle = document.getElementById('toggle')
const deleteTasks = document.getElementById('delete-all')

// ====== Variables ======
let taskInstance
let taskContent = []
let iteradorTaskContent = 0
let contadorTag = 0

// ====== Events ======
addEventListener('DOMContentLoaded', startApp)
taskBox.addEventListener('keypress', pressEnter)
document.addEventListener('keypress', focusEvent)
btnAgregar.addEventListener('click', createTask)
taskContain.addEventListener('click', modifytaskBox)
completedContain.addEventListener('click', modifytaskBox)
btnToggle.addEventListener('click', changeTask)
deleteTasks.addEventListener('click', deleteAllTask)

// Toggle to the slash search
searchInput.addEventListener('focus', () => {
    buscador.classList.add('click')
})
searchInput.addEventListener('blur', () => {
    buscador.classList.remove('click')
})

// ====== Functions ======
// DOM Loaded, charge data from localStorage
function startApp() {
    // chargeData is empty
    if (!chargeData()) {
        return
    }

    console.table(chargeData())
    // Print HTML
    chargeData().forEach((element) => {
        let {
            text,
            tag,
            check,
            id
        } = element

        // instantiate the element text
        taskContent[iteradorTaskContent] = new Task(text, tag, check, id)

        taskContent[iteradorTaskContent].createHTML()
        iteradorTaskContent++
    })

    // Message Any task
    hideMessage('.any-completed', completedContain)
    hideMessage('.any-task', taskContain)

}

// Press enter textarea
function pressEnter(e) {
    if (e.which === 13 || e.keyCode === 13 || e.key === "Enter") {
        e.preventDefault()
        // Get data tetarea and instance in clas Task
        createTask()
    }
}

// Get data textarea and instance in clas Task
function createTask() {
    // Validation Empty field
    if (taskBox.value.trim() == "") {
        taskBox.value = ""
        return
    }
    // instantiate the element text
    taskContent[iteradorTaskContent] = new Task(taskBox.value.trim())

    taskContent[iteradorTaskContent].createHTML()
    iteradorTaskContent++

    // Empty textarea
    taskBox.value = ""

    saveData()

    // Hide message any task
    hideMessage('.any-task', taskContain)
}

// Focus and Blur in elemento this case Enter and Slash
function focusEvent(e) {
    // Focus en slash
    if (e.which === 47 || e.keyCode === 47 || e.key === "/") {
        e.preventDefault()
        if (buscador.classList.contains('click')) {
            searchInput.blur()
        } else {
            searchInput.focus()
        }

    }
    // Focus en Enter
    if (e.which === 13 || e.keyCode === 13 || e.key === 'Enter') {
        e.preventDefault()
        taskBox.focus()
    }
}

// Moify each task box
function modifytaskBox(e) {
    // Only elements we want
    if (!e.target.classList.contains("contenedor-tareas")) {
        // ID card-task
        const idTask = e.target.parentElement.id
        // ID element pressed
        const idElement = e.target.id
        // Function for update html and array taskContent
        updateHTML(idTask, idElement)
    }
}

// Update HTML and Array taskContent
function updateHTML(idTask, idElement) {
    taskContent.forEach(element => {
        // Look at the element by idTask
        if (element.id == idTask) {
            // This element chooces which function is executed
            switch (idElement) {
                case "icon-close":
                    deleteTask(idTask)
                    break;
                case "card-task":
                    updateTask(idTask)
                    break;
                case "tag":
                    modifyTag(idTask)
                    break;
                case "boton-check":
                    taskCompleted(idTask)
                    break;
                default:
                    break;
            }
        }
    });

    saveData()
}

// Delete task in HTML and Array
function deleteTask(id) {
    // Update the array by idTask
    const newTaskContent = taskContent.filter(element => element.id != id)
    taskContent = [...newTaskContent]

    // Update localStorage
    saveData()

    // Update in the HTML
    document.getElementById(id).remove()

    // Message Any task
    hideMessage('.any-task', taskContain)
    hideMessage('.any-completed', completedContain)
}

// Uptade task in HTML and Array part 1/2
function updateTask(id) {
    taskContent.forEach(element => {
        // textarea of wich is editing 
        const elementTextareaEditing = document.getElementById(id).children[1]

        if (element.id == id) {
            // Uptadate in a new function for use addEventLister
            updateTextarea(elementTextareaEditing, id)
        }
    })
}

// Update textareaediting part 2/2
function updateTextarea(element, id) {
    // Obtain the value of each input
    element.addEventListener('input', e => {
        // Obtain the taskContent's index and modify its text
        taskContent.forEach((element, idArray) => {
            if (element.id == id) {
                taskContent[idArray].modifyText = e.target.value
            }
        })
    })

}

// Modify tag
function modifyTag(id) {
    taskContent.forEach((element, idArray) => {
        // Interator tag
        let c
        // textarea of wich is editing 
        const elementTagEditing = document.getElementById(id).firstElementChild

        // Increment tag
        if (element.id == id) {
            // tag value pass to c
            c = taskContent[idArray].getTag
            // Increment up to 2
            if (c == 2) {
                c = 0
            } else {
                c++
            }
            // Modify tag
            taskContent[idArray].modifyTag = c
        }
        // modify HTML
        switch (c) {
            case 0:
                elementTagEditing.classList.remove("red")
                elementTagEditing.classList.add("green")
                elementTagEditing.textContent = "Deseable"
                break;
            case 1:
                elementTagEditing.classList.remove("green")
                elementTagEditing.classList.add("oranje")
                elementTagEditing.textContent = "Importante"
                break;
            case 2:
                elementTagEditing.classList.remove("oranje")
                elementTagEditing.classList.add("red")
                elementTagEditing.textContent = "Urgente"
                break;
        }
    })
}

// taskCompleted
function taskCompleted(idTask) {
    // Task unchecked
    if (!document.getElementById(idTask).lastElementChild.classList.contains('checked')) {

        // Update in the HTML
        document.getElementById(idTask).remove()
        // Delete all its childs in HTML
        while (document.querySelector('.contenedor-completadas').firstElementChild) {
            document.querySelector('.contenedor-completadas').removeChild(document.querySelector('.contenedor-completadas').firstElementChild)
        }

        // Modify element in array
        taskContent.forEach((element, idArray) => {

            if (element.id == idTask) {
                taskContent[idArray].modifyCheck = 'checked'
                // taskContent[idArray].createHTML()
            }

            taskContent[idArray].createHTML()

        })
        // Message Any completed
        hideMessage('.any-task', taskContain)

        // Task Checked
    } else {

        // Update in the HTML
        document.getElementById(idTask).remove()

        // Delete all its childs in HTML
        while (document.querySelector('.contenedor-tareas').firstElementChild) {
            document.querySelector('.contenedor-tareas').removeChild(document.querySelector('.contenedor-tareas').firstElementChild)
        }

        // Modify element in array
        taskContent.forEach((element, idArray) => {
            if (element.id == idTask) {
                taskContent[idArray].modifyCheck = ''
                // taskContent[idArray].createHTML()
            }

            taskContent[idArray].createHTML()

        })
        // Message Any task
        hideMessage('.any-completed', completedContain)
    }

}

// Delete all tasks
function deleteAllTask() {
    // Select contain tasks active
    let activeBox = ''
    let check = ''
    if (document.querySelector('.contenedor-tareas').classList.contains('hidde')) {
        activeBox = document.querySelector('.contenedor-completadas')
        check = 'checked'
    } else {
        activeBox = document.querySelector('.contenedor-tareas')
        check = ''
    }

    // Delete all its childs in HTML
    while (activeBox.firstElementChild) {
        activeBox.removeChild(activeBox.firstElementChild)
    }

    // Delete in array
    taskContent = taskContent.filter(element => element.check != check)


}

// Local Storage
function saveData() {
    localStorage.setItem('taskContent', JSON.stringify(taskContent))
}

function chargeData() {
    let object = JSON.parse(localStorage.getItem('taskContent'))


    // object  ? console.log('something') : console.log('empty')
    return object
}

// Menssage anyTask
function hideMessage(p, contain) {
    // Create HTML message
    const paragraph = document.createElement('p')
    paragraph.classList.add(p)

    // Asign text and class
    if (p == '.any-task') {
        paragraph.textContent = 'No existen tareas pendientes...'
        paragraph.classList.add('any-task')

    } else {
        paragraph.textContent = 'No tienes tareas completadas...'
        paragraph.classList.add('any-completed')
    }

    // Check if the content tasks is empty
    if (contain.firstElementChild.classList.contains(p)) {
        contain.removeChild(contain.firstElementChild)
    } else {
        contain.appendChild(paragraph)
    }

}

// Change bar complete to be completed
function changeTask() {
    const tasks = document.querySelector('.tareas')
    const completed = document.querySelector('.completadas')

    const containTasks = document.querySelector('.contenedor-tareas')
    const containCompleted = document.querySelector('.contenedor-completadas')

    tasks.classList.toggle('toggle-active')
    completed.classList.toggle('toggle-active')

    containTasks.classList.toggle('hidde')
    containCompleted.classList.toggle('hidde')

}

// ====== Classes ======

// Clase Task
class Task {
    constructor(text, tag = 0, check = "", id = new Date().getTime()) {
        this.text = text
        this.tag = tag
        this.check = check
        this.id = id
    }

    set modifyText(newtext) {
        this.text = newtext
    }

    set modifyCheck(newcheck) {
        this.check = newcheck
    }

    set modifyTag(newtag) {
        this.tag = newtag
    }

    get getTag() {
        return this.tag
    }

    createHTML() {
        // Estructure of each task
        const divContainer = document.createElement("div")
        divContainer.classList.add("container-task")
        divContainer.id = this.id

        const textArea = document.createElement("textarea")
        textArea.classList.add("card-task")
        textArea.id = "card-task"
        textArea.textContent = this.text

        const buttonTag = document.createElement("button")
        buttonTag.classList.add("tag")
        buttonTag.id = "tag"

        // asign tag 
        switch (this.tag) {
            case 0:
                buttonTag.classList.remove("red")
                buttonTag.classList.add("green")
                buttonTag.textContent = "Deseable"
                break;
            case 1:
                buttonTag.classList.remove("green")
                buttonTag.classList.add("oranje")
                buttonTag.textContent = "Importante"
                break;
            case 2:
                buttonTag.classList.remove("oranje")
                buttonTag.classList.add("red")
                buttonTag.textContent = "Urgente"
                break;
        }

        const iClose = document.createElement("i")
        iClose.className = "icon-close icon"
        iClose.setAttribute("id", "icon-close")

        const divCheck = document.createElement("div")
        divCheck.className = "boton-check icon " + this.check
        divCheck.setAttribute("id", "boton-check")

        const iCheck = document.createElement("i")
        iCheck.classList = "icon-check"
        iCheck.id = "icon-check"

        // Insertar elementos
        divCheck.appendChild(iCheck)

        divContainer.appendChild(buttonTag)
        divContainer.appendChild(textArea)
        divContainer.appendChild(iClose)
        // divContainer.appendChild(iEdit)
        divContainer.appendChild(divCheck)

        if (this.check == "checked") {
            completedContain.appendChild(divContainer)
            textArea.disabled = true
            buttonTag.disabled = true
        } else {
            taskContain.appendChild(divContainer)
            textArea.disabled = false
            buttonTag.disabled = false
        }
    }

}