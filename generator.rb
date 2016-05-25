require 'yaml'
require 'set'

class Generator
  def initialize(jobs)
    @output = ""
    @tags = Set.new()
  	@job_data = YAML.load(File.read('data/jobs.yaml'))
  	jobs.map{|j| j.gsub(" ", "-")}.each do |job|
  	  @tags << job
      next if job == "debug"
      @job_data['Jobs'][job].each do |tag|
        @tags << tag
      end
  	end
  end

  def get_walkthrough(beginning_node='begin')
  	generate!(beginning_node) if @output == ""
    @output
  end

  def generate!(beginning_node='begin')
    handle_node(beginning_node, nil)
  end

  def handle_node(nodename, previous_node)
    node = YAML.load(File.read("data/nodes/#{nodename}.yaml"))
    node_header = node.keys.first
    node_data = node[node_header]

    if previous_node && !node_data['Metadata']['previous-nodes'].include?(previous_node)
      print "WARNING: unexpected node transition #{previous_node} => #{nodename}"
    end

    emit_header(node_header)
    node_data.each do |condition, hints|
      condition = condition.gsub('`', '')
      next if condition == "Metadata"
      if condition == "Generic" || condition_true?(condition, @tags)
        hints.each do |hint|
          if @tags.include?("debug")
            emit_list_element("[#{condition}] #{hint}")
          else
            emit_list_element(hint)
          end
        end
      end
    end
    emit_paragraph_break

    next_node = node_data['Metadata']['next-node']
    handle_node(next_node, nodename) unless next_node == 'end'
  end

  # todo: support and, or with more than 2 elements
  def condition_true?(condition, tags)
    return true if tags.include?("debug")

    token = condition.split.first
    if token == 'NOT'
      return !condition_true?(condition.split[1..-1].join(" "), tags)
    elsif token == 'UNION' || token == 'AND'
      return condition_true?(condition.split[1], tags) && condition_true?(condition.split[2], tags)
    elsif token == 'INTERSECTION' || token == 'OR'
      return condition_true?(condition.split[1], tags) || condition_true?(condition.split[2], tags)
    else
      return tags.include?(condition)
    end
  end

  def emit_header(contents)
    @output << "## #{contents}\n"
  end

  def emit_list_element(contents)
    @output << "* #{contents}\n"
  end

  def emit_paragraph_break()
    @output << "\n"
  end
end
