require 'rubygems'
require 'bundler'

Bundler.require

require './enkibot'

run Sinatra::Application
