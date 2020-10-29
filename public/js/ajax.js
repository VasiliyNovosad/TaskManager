$(document).ready(function() {
  const showError = function(error) {
    console.log(error);
  }

  const upTaskPriority = function(e) {
    e.preventDefault();
    console.log(e);
  }

  const downTaskPriority = function(e) {
    e.preventDefault();
    console.log(e);
  }

  const deleteTask = function(e) {
    e.preventDefault();

    const taskId = $(e.target).data('id');
    const taskName = $(`#task-${taskId} .taskName`).text();
    if (confirm(`Do you really want to delete task "${taskName}"`)) {
      $.ajax({
        url: `/api/tasks/${taskId}`,
        type: 'DELETE',
        dataType: 'json',
        success: function() {
          $(`#task-${taskId}`).remove();
        },
        error: showError
      });
    }
  }

  const toggleTaskDone = function(e) {
    e.preventDefault();
    console.log(e);
  }

  const openTaskEditForm = function(e) {
    e.preventDefault();
    console.log(e);
  }

  const deleteProject = function(e) {
    e.preventDefault();

    const projectId = $(e.target).data('id');
    const projectName = $(`#project-${projectId} .projectName .col-11`).text();
    if (confirm(`Do you really want to delete project "${projectName}"`)) {
      $.ajax({
        url: `/api/projects/${projectId}`,
        type: 'DELETE',
        dataType: 'json',
        success: function() {
          $(`#project-${projectId}`).remove();
        },
        error: showError
      });
    }
  }

  const openProjectEditForm = function(e) {
    e.preventDefault();
    console.log(e);
  }

  const addProject = function (e) {
    e.preventDefault();
    const projectName = $('#new-project-name').val();
    $.ajax({
      url: '/api/projects',
      data: {name: projectName},
      type: 'POST',
      dataType: 'json',
      success: function(project) {
        $('#createProject').modal('hide');
        $('#new-project-name').val('');

        const projectsBlock = $('#projectsBlock');
        projectsBlock.append(createProjectItem(project));

        $(`#project-${project.id} .addTaskButton`).on('click', addTask);
        $(`#project-${project.id} .projectEditButton`).on('click', openProjectEditForm);
        $(`#project-${project.id} .projectDeleteButton`).on('click', deleteProject);
      },
      error: showError
    });
  }

  const addTask = function(e) {
    e.preventDefault();
    const projectId = $(e.target).data('id');
    const taskName = $(`#new-task-name-${projectId}`).val();
    const taskPriority = $(`#project-${projectId} .taskItem`).length + 1;

    $.ajax({
      url: '/api/tasks',
      data: {project_id: projectId, name: taskName, priority: taskPriority, done: false},
      type: 'POST',
      dataType: 'json',
      success: function(task) {
        $(`#new-task-name-${projectId}`).val('');

        const tasksBlock = $(`#project-${projectId} .tasksBlock`);
        tasksBlock.append(createTaskItem(task));

        $(`#task-${task.id} .taskUpButton`).on('click', upTaskPriority);
        $(`#task-${task.id} .taskDownButton`).on('click', downTaskPriority);
        $(`#task-${task.id} .taskEditButton`).on('click', openTaskEditForm);
        $(`#task-${task.id} .taskDeleteButton`).on('click', deleteTask);
        $(`#task-${task.id} .taskDoneCheckbox`).on('click', toggleTaskDone);
      },
      error: showError
    });
  }

  const createTaskItem = function(task) {
    return `
              <div class="taskItem row" id="task-${task.id}" data-project-id="${task.project_id}" data-id="${task.id}" data-position="${task.priority}">
                <div class="taskDoneCheckbox col-1">
                  <div class="form-check">
                    <input class="form-check-input position-static" type="checkbox" data-id="${task.id}" ${task.done ? 'checked' : ''}>
                  </div>
                </div>
                <div class="taskName col-9">${task.name}</div>
                <div class="col-2 taskToolbar">
                  <i class="taskTool taskUpButton fas fa-angle-up" data-id="${task.id}"></i> |
                  <i class="taskTool taskDownButton fas fa-angle-down" data-id="${task.id}"></i> |
                  <i class="taskTool taskEditButton fas fa-edit" data-id="${task.id}"></i> |
                  <i class="taskTool taskDeleteButton fas fa-trash" data-id="${task.id}"></i>
                </div>
              </div>
    `;
  }

  const createProjectItem = function(project) {
    return `
          <div class="projectItem" id="project-${project.id}" data-id="${project.id}" data-name="${project.name}">
            <div class="projectName row">
              <div class="col-11"><i class="far fa-calendar-alt"></i>${project.name}</div>
              <div class="col-1 float-right projectToolbar">
                <i class="projectEditButton fas fa-edit" data-id="${project.id}"></i>
                |
                <i class="projectDeleteButton fas fa-trash" data-id="${project.id}"></i>
              </div>
            </div>
            <div class="newTaskBlock row">
              <i class="taskAddIcon fas fa-plus"></i>
              <input type="text" name="new-task-name" class="newTaskNameInput form-control" placeholder="Start typing here to create a task..." id="new-task-name-${project.id}">
              <div class="addTaskButton btn btn-success" data-id="${project.id}">Add Task</div>
            </div>
            <div class="tasksBlock">
              ${project.tasks.map(task => createTaskItem(task)).join('\n')}
            </div>
          </div>
    `;
  }

  $('#createProjectButton').on('click', addProject);

  $('#newProjectForm').on('submit', addProject);

  $.ajax({
    url: '/api/projects',
    type: 'GET',
    dataType: 'json',
    success: function(projects) {
      console.log('Projects list: ', projects);
      const projectsBlock = $('#projectsBlock');
      projects.forEach(project => {
        projectsBlock.append(createProjectItem(project));
      });

      $('.taskUpButton').on('click', upTaskPriority);
      $('.taskDownButton').on('click', downTaskPriority);
      $('.taskEditButton').on('click', openTaskEditForm);
      $('.taskDeleteButton').on('click', deleteTask);
      $('.taskDoneCheckbox').on('click', toggleTaskDone);

      $('.addTaskButton').on('click', addTask);
      $('.projectEditButton').on('click', openProjectEditForm);
      $('.projectDeleteButton').on('click', deleteProject);

    },
    error: showError
  });
})