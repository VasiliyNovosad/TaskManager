require 'sinatra'
# require 'sinatra/activerecord'

class App < Sinatra::Base
  get '/' do
    content_type :json
    { message: 'Hello World' }.to_json
  end
end