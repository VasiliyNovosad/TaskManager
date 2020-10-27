require 'sinatra'
require 'sinatra/activerecord'
require './models/project'
require './models/task'
require 'json'

before do
  content_type :json
end

get '/' do
  content_type :html
  send_file './public/index.html'
end

get '/api/projects' do
  Project.all.to_json(include: :tasks)
end

post '/api/projects' do
  p params
  project = Project.new(params)
  if project.save
    project.to_json(include: :tasks)
  else
    halt 422, project.errors.full_messages.to_json
  end
end

put '/api/projects/:id' do
  project = Project.find(params['id'])

  if project
    project.name = params['name'] if params.has_key?('name')

    if project.save
      project.to_json
    else
      halt 422, project.errors.full_messages.to_json
    end
  end
end

delete '/api/projects/:id' do
  project = Project.find(params['id'])

  if project.destroy
    {success: 'ok'}.to_json
  else
    halt 500
  end
end

get '/api/tasks' do
  Task.all.to_json
end

get '/api/tasks/:id' do
  Task.where(id: params['id']).first.to_json
end

post '/api/tasks' do
  task = Task.new(params)

  if task.save
    task.to_json
  else
    halt 422, task.errors.full_messages.to_json
  end
end

put '/api/tasks/:id' do
  task = Task.where(id: params['id']).first

  if task
    task.name = params['name'] if params.has_key?('name')
    task.done = params['done'] if params.has_key?('done')
    task.deadline = params['deadline'] if params.has_key?('deadline')
    task.priority = params['priority'] if params.has_key?('priority')

    if task.save
      task.to_json
    else
      halt 422, task.errors.full_messages.to_json
    end
  end
end

delete '/api/tasks/:id' do
  task = Task.find(params['id'])

  if task.destroy
    {success: "ok"}.to_json
  else
    halt 500
  end
end