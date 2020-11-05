$(document).ready(function() {
  const showError = function(error, errorsBlock = $('#errorsBlock')) {
    const errorItem = `
    <div class="alert alert-danger" role="alert" id="errorMessage">
      ${error.responseJSON.join('\n')}
    </div>
    `;
    errorsBlock.append(errorItem);
    setTimeout(function() { $('#errorMessage').remove() }, 4000);
  }

  const showAddProjectError = function(error) {
    showError(error, $('#errorsAddProjectBlock'));
  }

  const showEditProjectError = function(error) {
    showError(error, $('#errorsEditProjectBlock'));
  }

  const showEditTaskError = function(error) {
    showError(error, $('#errorsEditTaskBlock'));
  }

  const upTaskPriority = function(e) {
    e.preventDefault();

    const taskId = $(e.target).data('id');
    const currentTaskItem = $(`#task-${taskId}`);
    const projectId = currentTaskItem.data('project-id');
    const taskPriority = +currentTaskItem.data('priority');
    if (taskPriority === 1) {
      return;
    }

    const previousTaskItem = $($(`.taskItem[data-project-id="${projectId}"]`).toArray().find(item => $(item).data('priority') === taskPriority - 1));

    previousTaskItem.insertAfter(`#task-${taskId}`);
    $.ajax({
      url: `/api/tasks/${previousTaskItem.data('id')}`,
      data: {priority: taskPriority},
      type: 'PUT',
      dataType: 'json',
      success: function(task) {
        previousTaskItem.data('priority', task.priority);
      },
      error: showError
    });

    $.ajax({
      url: `/api/tasks/${taskId}`,
      data: {priority: taskPriority - 1},
      type: 'PUT',
      dataType: 'json',
      success: function(task) {
        currentTaskItem.data('priority', task.priority);
      },
      error: showError
    });
  }

  const downTaskPriority = function(e) {
    e.preventDefault();

    const taskId = $(e.target).data('id');
    const currentTaskItem = $(`#task-${taskId}`);
    const projectId = currentTaskItem.data('project-id');
    const taskPriority = +currentTaskItem.data('priority');
    if (taskPriority === $(`.taskItem[data-project-id="${projectId}"]`).length) {
      return;
    }

    const nextTaskItem = $($(`.taskItem[data-project-id="${projectId}"]`).toArray().find(item => $(item).data('priority') === taskPriority + 1));

    nextTaskItem.insertBefore(`#task-${taskId}`);
    $.ajax({
      url: `/api/tasks/${nextTaskItem.data('id')}`,
      data: {priority: taskPriority},
      type: 'PUT',
      dataType: 'json',
      success: function(task) {
        nextTaskItem.data('priority', task.priority);
      },
      error: showError
    });

    $.ajax({
      url: `/api/tasks/${taskId}`,
      data: {priority: taskPriority + 1},
      type: 'PUT',
      dataType: 'json',
      success: function(task) {
        currentTaskItem.data('priority', task.priority);
      },
      error: showError
    });
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
    const taskId = $(e.target).data('id');
    const checked = $(e.target).prop('checked');
    $.ajax({
      url: `/api/tasks/${taskId}`,
      data: {done: checked},
      type: 'PUT',
      dataType: 'json',
      success: function() {},
      error: showError
    });
  }

  const updateTask = function(e) {
    e.preventDefault();
    const taskName = $('#task-name').val();
    const taskId = $('#task-id').val();
    const taskDone = $('#task-done').prop('checked');
    const taskDeadlineString = $('#task-deadline').val();
    const [year, month, day] = taskDeadlineString.split('-');
    const taskDeadline = new Date(+year, +month, +day);

    $.ajax({
      url: `/api/tasks/${taskId}`,
      data: {name: taskName, done: taskDone, deadline: taskDeadline},
      type: 'PUT',
      dataType: 'json',
      success: function(task) {
        $('#editTask').modal('hide');
        $('#task-name').val('');
        $('#task-id').val('');
        $('#task-deadline').val('');
        $('#task-done').prop('checked', false);

        $(`#task-${task.id} .taskName`).text(task.name);
        $(`#task-${task.id} .taskDoneCheckbox input`).prop('checked', task.done);
      },
      error: showEditTaskError
    });
  }

  const updateProject = function(e) {
    e.preventDefault();
    const projectName = $('#project-name').val();
    const projectId = $('#project-id').val();
    $.ajax({
      url: `/api/projects/${projectId}`,
      data: {name: projectName},
      type: 'PUT',
      dataType: 'json',
      success: function(project) {
        $('#editProject').modal('hide');
        $('#project-name').val('');
        $('#project-id').val('');

        $(`#project-${project.id} .projectName .col-11`).text(project.name);
      },
      error: showEditProjectError
    });
  }

  const openTaskEditForm = function(e) {
    e.preventDefault();

    const taskId = $(e.target).data('id');

    $.ajax({
      url: `/api/tasks/${taskId}`,
      type: 'GET',
      dataType: 'json',
      success: function(task) {
        console.log({task});
        const modalForm = $('#editTask');
        $('#task-id').val(task.id);
        $('#task-name').val(task.name);

        const formattedDate = new Date(task.deadline);
        const d = formattedDate.getDate();
        const m =  formattedDate.getMonth() + 1;
        const y = formattedDate.getFullYear();

        $('#task-deadline').val(`${y}-${m < 10 ? '0' + String(m) : m}-${d < 10 ? '0' + String(d) : d}`);
        $('#task-done').prop('checked', task.done);
        modalForm.modal('show');
      },
      error: showError
    });
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

    const projectId = $(e.target).data('id');
    $.ajax({
      url: `/api/projects/${projectId}`,
      type: 'GET',
      dataType: 'json',
      success: function(project) {
        const modalForm = $('#editProject');
        $('#project-id').val(project.id);
        $('#project-name').val(project.name);
        modalForm.modal('show');
      },
      error: showError
    });
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
      error: showAddProjectError
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
              <div class="taskItem row" id="task-${task.id}" data-project-id="${task.project_id}" data-id="${task.id}" data-priority="${task.priority}">
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

  $('#updateProjectButton').on('click', updateProject);

  $('#updateTaskButton').on('click', updateTask);

  $.ajax({
    url: '/api/projects',
    type: 'GET',
    dataType: 'json',
    success: function(projects) {
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