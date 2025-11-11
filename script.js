document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const emptyImage = document.querySelector('.empty-image');
    const todosContainer = document.querySelector('.todos-container');
    const progressBar = document.getElementById('progress');
    const progressNumbers = document.getElementById('numbers');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const toggleEmptyState = () => {
        emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
        todosContainer.style.width = taskList.children.length > 0 ? '100%' : '50%';
    };

    const updateProgress = () => {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;

        const progressPercent = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
        progressBar.style.width = `${progressPercent}%`;
        progressNumbers.textContent = `${completedTasks} / ${totalTasks}`;

        if (totalTasks > 0 && completedTasks === totalTasks) {
            Confetti();
        }
    };

    const renderTasks = () => {
        taskList.innerHTML = '';
        tasks.forEach(task => addTask(task.text, task.completed, false));
    };

    const addTask = (text, completed = false, save = true) => {
        const taskText = text || taskInput.value.trim();
        if (!taskText) return;

        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''}>
            <span>${taskText}</span>
            <div class="task-buttons">
                <button class="solid_pen">🖋️</button>
                <button class="solid_delete">🗑️</button>
            </div>
        `;

        const checkbox = li.querySelector('.checkbox');
        const editBtn = li.querySelector('.solid_pen');
        const deleteBtn = li.querySelector('.solid_delete');

        if (completed) {
            li.classList.add('completed');
            editBtn.disabled = true;
            editBtn.style.opacity = '0.5';
            editBtn.style.pointerEvents = 'none';
        }

        checkbox.addEventListener('change', () => {
            const isChecked = checkbox.checked;
            li.classList.toggle('completed', isChecked);
            editBtn.disabled = isChecked;
            editBtn.style.opacity = isChecked ? '0.5' : '1';
            editBtn.style.pointerEvents = isChecked ? 'none' : 'auto';

            const index = Array.from(taskList.children).indexOf(li);
            tasks[index].completed = isChecked;
            saveTasks();
            updateProgress();
        });

        editBtn.addEventListener('click', () => {
            if (!checkbox.checked) {
                taskInput.value = li.querySelector('span').textContent;
                const index = Array.from(taskList.children).indexOf(li);
                tasks.splice(index, 1);
                li.remove();
                toggleEmptyState();
                saveTasks();
                updateProgress();
            }
        });

        deleteBtn.addEventListener('click', () => {
            const index = Array.from(taskList.children).indexOf(li);
            tasks.splice(index, 1);
            li.remove();
            toggleEmptyState();
            saveTasks();
            updateProgress();
        });

        taskList.appendChild(li);
        if (!text) {
            tasks.push({ text: taskText, completed });
            saveTasks();
        }
        taskInput.value = '';
        toggleEmptyState();
        updateProgress();
    };

    addTaskBtn.addEventListener('click', () => addTask());
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTask();
        }
    });

    renderTasks();
    toggleEmptyState();
    updateProgress();

    const Confetti = () => {
        const count = 200,
            defaults = {
                origin: { y: 0.7 },
            };

        function fire(particleRatio, opts) {
            confetti(
                Object.assign({}, defaults, opts, {
                    particleCount: Math.floor(count * particleRatio),
                })
            );
        }

        fire(0.25, {
            spread: 26,
            startVelocity: 55,
        });

        fire(0.2, {
            spread: 60,
        });

        fire(0.35, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8,
        });

        fire(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2,
        });

        fire(0.1, {
            spread: 120,
            startVelocity: 45,
        });
    }
});
