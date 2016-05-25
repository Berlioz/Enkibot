require 'yaml'

nodes = YAML.load(File.read "data/nodes.yaml")["Manifest"]

nodes.each_with_index do |n, i|
  next_node = nodes[i + 1] || "end"
  previous_nodes = [nodes[i-1]] || []
  output = {}
  output[n] = {"Metadata" => {"next-node" => next_node, "previous-nodes" => previous_nodes}, "Generic" => ["foo"]}
  unless File.exists?("data/nodes/#{n}.yaml")
  	print "Creating #{n}.yaml...\n"
    f = File.new("data/nodes/#{n}.yaml", 'w')
    f.write(output.to_yaml)
  end
end