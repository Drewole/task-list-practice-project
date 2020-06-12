// Define UI Vars
const form = document.querySelector('#task-form');
const taskList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');
const filter = document.querySelector('#filter');
const taskInput = document.querySelector('#task');

/////Load all event listeners
/* When you assign a function to a variable, you have to assign it before you can use the variable to access the function.

If you declare the function with regular syntax like below, instead of assigning it to a variable, it is defined when code is parsed. */
loadEventListeners();
getLocalStorageTasks();

function loadEventListeners() {
	// Add task input event
	form.addEventListener('submit', addTask);
	// Add delete item event
	document.body.addEventListener('click', deleteItem);
	// Filter tasks event listener
	filter.addEventListener('keyup', filterTasks);
}

function getLocalStorageTasks() {
	//Get and parse local storage and assign it localTasks
	let localTasks = JSON.parse(localStorage.getItem('tasks'));

	//IF there is nothing there, just get out
	if (localTasks === null) {
		return;
	}
	//Loop through tasks and add them to the DOM
	localTasks.forEach(function(task) {
		//Create li element
		const li = document.createElement('li');
		//Add class
		li.className = 'collection-item';
		//create text node and append to li
		li.appendChild(document.createTextNode(task));

		//create new link element
		const link = document.createElement('a');
		//Add Class
		link.className = 'delete-item secondary-content';
		//Add class icon
		link.innerHTML = '<i class="fa fa-remove"></i>';
		//Append the link to the li
		li.appendChild(link);

		//Append the li to the ul
		taskList.appendChild(li);
	});
}

function addTask(e) {
	//Check if anything is in the input and if its empty alert
	if (taskInput.value === '') {
		alert('Add a task');
	}
	//Create li element
	const li = document.createElement('li');
	//Add class
	li.className = 'collection-item';
	//create text node and append to li
	li.appendChild(document.createTextNode(taskInput.value));
	console.log(taskInput.value);
	//create new link element
	const link = document.createElement('a');
	//Add Class
	link.className = 'delete-item secondary-content';
	//Add class icon
	link.innerHTML = '<i class="fa fa-remove"></i>';
	//Append the link to the li
	li.appendChild(link);

	//Append the li to the ul
	taskList.appendChild(li);

	//Store task in local storage
	storeTaskInLocalStorage(taskInput.value);

	//Clear input now that we have added the value to the list
	taskInput.value = '';

	e.preventDefault();
}

function storeTaskInLocalStorage(task) {
	let tasks;

	//Check to see if there are items in local storage under the key tasks
	if (localStorage.getItem('tasks') === null) {
		//If there isn't, create the array.
		tasks = [];
	} else {
		//If there is, get it, parse it back to an array from a string
		tasks = JSON.parse(localStorage.getItem('tasks'));
	}
	//Add the task to the array
	tasks.push(task);
	//Add the task to local storage
	localStorage.setItem('tasks', JSON.stringify(tasks));
}
//Remove task from Local Storage
function removeTaskFromLocalStorage(taskItem) {
	let tasks;

	//There shouldn't be any items showing on load to click/delete but just incase, return
	if (localStorage.getItem('tasks') === null) {
		return;
	}
	//Get data with key 'tasks' from local storage and parse them into an array thats stored in tasks
	tasks = JSON.parse(localStorage.getItem('tasks'));
	//Lets loop through them and pass the task and the index
	tasks.forEach(function(task, index) {
		//If the text matches one of the entries
		if (taskItem.textContent === task) {
			//remove that item based on the index and removing one item
			tasks.splice(index, 1);
		}
	});
	//Reset the local storage 'tasks' item with the remaining values.
	localStorage.setItem('tasks', JSON.stringify(tasks));
}

//Deletes items when clicking the x or clearing all tasks with button
function deleteItem(e) {
	if (e.target.parentElement.classList.contains('delete-item')) {
		const inputValue = e.target.parentElement.parentElement.textContent;
		console.log(`"${inputValue}" was deleted`);
		e.target.parentElement.parentElement.remove();

		//Remove from Local Storage
		removeTaskFromLocalStorage(e.target.parentElement.parentElement);
	} else if (e.target.classList.contains('clear-tasks')) {
		if (confirm('Are you sure you want to delete all tasks?')) {
			//taskList.innerHTML = '';
			//The below is faster
			while (taskList.firstChild) {
				// While there still is a first child in the element, remove the last child
				taskList.removeChild(taskList.lastChild);
			}
			//Clear local storage of everything.
			localStorage.clear();
		}
	}
}
//Lets filter the tasks
function filterTasks(e) {
	const text = e.target.value.toLowerCase(); //Get the input value of the filter and turn it to lowercase
	document.querySelectorAll('.collection-item').forEach(function(task) {
		// We then look at all of the .collection-items on the page and see if the string matches any of the text, after we convert it to lowercase again.
		const item = task.firstChild.textContent;
		if (item.toLowerCase().indexOf(text) != -1) {
			task.style.display = 'block';
		} else {
			task.style.display = 'none';
		}
	});
}
