# Enkibot
An adaptive Final Fantasy V walkthrough/checklist generator designed to be used for a Four Job Fiesta, which only displays information needed for your particular run. Compiled, usable version is available at https://enkibot-prime.herokuapp.com/.

## Architecture
The YAML files in /data/nodes define a very simple, mostly-linear state-machine. Each node contains hints for a certain part of FFV, some of which should be displayed only if the user has certain classes or combinations of classes. When building a walkthrough, the generator starts from the first node in the game (Wing Raptor) and recursively expands nodes until it meets an 'end' node (Neo Exdeath).

## Use
```
load 'generator.rb'
generator = Generator.new(['Knight', 'Red-Mage', 'Ranger', 'Chemist'])
print generator.get_walkthrough
```

## Contributing
Please help fill-out/fact-check the .yaml files which define the nodes. I don't actually know everything about FFV, so the more eyes the better.

## Node definitions
```
cat data/nodes/regole.yaml
```
```yaml
Regole Village:
  Metadata:
    branching-node: ["Beastmaster", "w2_shield_dragons"]   # optionally define a node to expand if a certain condition is met
    next-node: moogle-forest                               # define a node to expand if no branching-nodes are triggered
    previous-nodes: ["bridgeamesh"]                        # warn if we arrived at this node from outside this list
  Generic:
    - "This string will be printed no matter what classes you have available."
    - "Multiple strings can be printed for the same condition."
  Summoner:
    - "Now that you have the Fire-Powered Ship, make sure to head to Istory and pick up Ramuh."
  Heavyscammer:
    - "Jobs can be given tags, which can be used in conditions just like job names."
    - "More than one job can be given the same tag."
    - "This boss is not Heavy, which means that it is vulnerable to instant death and petrify effects, among others."
  INTERSECTION Blue-Mage Summoner:
    - "You can create conditions that are satisfied if one or more of the given conditions are fulfilled."
    - "You can buy the Air Knife here, which boosts wind magic like the Aero line of spells and Syldra."
  UNION Dancer Thief:
    - "You can create conditions that are satisfied if all of the given conditions are fulfilled."
    - "Make sure that you steal a Lamia's Tiara! You won't have a chance to after beating Archeoavis."
  NOT Blue-Mage Time-Mage:
    - "You can create conditions that are satisfied if none of the subsequent conditions are fulfilled."
    - "Even without a source of Float, you can always get it from a confused Gaelicat on North Mountain."
```
