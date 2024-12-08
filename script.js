

const addButton = document.querySelector(".addbtn");
const taskInput = document.querySelector(".inputname");
const timeInput = document.querySelector(".inputtime");
const daySelect = document.querySelector(".selectday");
const osnova = document.querySelector(".osnova");


const loadTasks = () => {
    const cookies = document.cookie.split("; ").find(row => row.startsWith("tasks="));
    if (!cookies) return;


    const tasks = JSON.parse(decodeURIComponent(cookies.split("=")[1]));
    tasks.forEach(task => addTaskToDOM(task.day, task.text, task.time));
};
const saveTasks = () => {
    const tasks = [];
    document.querySelectorAll(".task").forEach(taskDiv => {
        tasks.push({
            day: taskDiv.dataset.day,
            text: taskDiv.querySelector(".task-text").textContent,
            time: taskDiv.querySelector(".task-time").textContent
        });
    });
    document.cookie = `tasks=${encodeURIComponent(JSON.stringify(tasks))}; path=/; max-age=${60 * 60 * 24 * 365}`;
};


const addTaskToDOM = (day, text, time) => {
    let dayDetails = [...document.querySelectorAll("details")].find(
        detail => detail.querySelector("summary").textContent.trim() === day
    );


    if (!dayDetails) {
        dayDetails = document.createElement("details");
        dayDetails.innerHTML = `
            <summary>${day}</summary>
            <div class="dayinside"></div>
        `;
        osnova.appendChild(dayDetails);
    }
    const taskHTML = `
        <div class="task" data-day="${day}">
            <p class="task-text">${text} (<span class="task-time">${time}</span>)</p>
            <div>
                <button class="editbtn">Edit</button>
                <button class="deletebtn">Delete</button>
            </div>
        </div>
    `;


    dayDetails.querySelector(".dayinside").insertAdjacentHTML("beforeend", taskHTML);


    const taskDiv = dayDetails.querySelector(".task:last-child");


    taskDiv.querySelector(".editbtn").addEventListener("click", () => {
        const newText = prompt("Редагуйте текст завдання:", text);
        const newTime = prompt("Редагуйте час завдання (у форматі xx:xx):", time);


        if (newText && newTime) {
            taskDiv.querySelector(".task-text").textContent = `${newText} (${newTime})`;
            taskDiv.querySelector(".task-time").textContent = newTime;
            saveTasks();
        } else {
            alert("Редагування скасовано. Перевірте правильність введених даних.");
        }
    });


    taskDiv.querySelector(".deletebtn").addEventListener("click", () => {
        taskDiv.remove();
        saveTasks();
    });
};


addButton.addEventListener("click", () => {
    const text = taskInput.value.trim();
    const time = timeInput.value.trim();
    const day = daySelect.options[daySelect.selectedIndex].text;


    if (!text || !time) {
        alert("Будь ласка, введіть текст завдання та час.");
        return;
    }


    addTaskToDOM(day, text, time);
    saveTasks();
    taskInput.value = "";
    timeInput.value = "";
});



loadTasks();






