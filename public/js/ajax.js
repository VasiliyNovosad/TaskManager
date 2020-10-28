$(document).ready(function() {
  $('#createProjectButton').on('click', function (e) {
    e.preventDefault();
    const projectName = $('#new-project-name').val();
    console.log({projectName, elem: $('#new-project-name')});
    $.ajax({
      url: '/api/projects',
      data: {name: projectName},
      type: 'POST',
      dataType: 'json',
      success: function(json) {
        console.log('the project was created', json);
        $('#createProject').modal('hide');
        $('#new-project-name').val('');
      },
      error: function(error) {
        console.log('the project was not created', error);
      },
      complete: function(xhr, status) {
        console.log('the request is complete!');
      }
    });
  });

  $('#newProjectForm').on('submit', function (e) {
    e.preventDefault();
    const projectName = $('#new-project-name').val();
    console.log({projectName, elem: $('#new-project-name')});
    $.ajax({
      url: '/api/projects',
      data: {name: projectName},
      type: 'POST',
      dataType: 'json',
      success: function(json) {
        console.log('the project was created', json);
        $('#createProject').modal('hide');
        $('#new-project-name').val('');
      },
      error: function(error) {
        console.log('the project was not created', error);
      },
      complete: function(xhr, status) {
        console.log('the request is complete!');
      }
    });
  });

  const createTaskItem = function(task) {
    let result = `
              <div class="taskItem row" id="task-${task.id}" data-project-id="${task.project_id}" data-id="${task.id}" data-position="${task.priority}">
                <div class="taskDoneCheckbox col-1">
                  <div class="form-check">
                    <input class="form-check-input position-static" type="checkbox" value="1" ${task.done ? 'checked' : ''}>
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
    return result;
  }

  const createProjectItem = function(project) {
    let result = `
    <div class="projectItem" id="project-${project.id}" data-id="${project.id}" data-name="${project.name}">
            <div class="projectName row">
              <div class="col-11"><i class="far fa-calendar-alt"></i>${project.name}</div>
              <div class="col-1 float-right projectToolbar">
                <i class="projectEditButton fas fa-edit"></i>
                |
                <i class="projectDeleteButton fas fa-trash"></i>
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
    return result;
  }

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

    },
    error: function(error) {
      console.log('Projects were not loaded', error);
    },
    complete: function(xhr, status) {
      console.log('the request is complete!');
    }
  });
})