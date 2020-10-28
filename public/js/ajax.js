$(document).ready(function() {
  $.ajax({
    url: '/api/projects',
    type: 'GET',
    dataType: 'json',
    success: function(json) {
      console.log('Projects list: ', json);
    },
    error: function(error) {
      console.log('Projects were not loaded', error);
    },
    complete: function(xhr, status) {
      console.log('the request is complete!');
    }
  });

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
})