require 'sinatra'
require './generator'
require 'yaml'

set :views, "views"
# i'm a monster
$jobs = YAML.load(File.read 'data/jobs.yaml')['Jobs']

get '/' do
  @jobs = $jobs.keys
  erb :enkibot	
end

post '/hints/' do
  response["Content-Type"]="text/plain"

  selected_jobs = []
  [params['job1'], params['job2'], params['job3'], params['job4']].each do |job|
    if job[0] == '_'
      print $jobs
      $jobs.each do |jobname, keys|
        selected_jobs << jobname if keys.include?(job[1..-1])
      end
    else
      selected_jobs << job
    end
  end

  return Generator.new(selected_jobs).get_walkthrough
end