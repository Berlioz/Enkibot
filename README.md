# Enkibot
An adaptive Final Fantasy V walkthrough/checklist generator designed to be used for a Four Job Fiesta, which only displays information needed for your particular run.

## Architecture
The YAML files in /data/nodes define a very simple, mostly-linear state-machine. Each node contains hints for a certain part of FFV, some of which should be displayed only if the user has certain classes or combinations of classes. When building a walkthrough, the generator starts from the first node in the game (Wing Raptor) and recursively expands nodes until it meets an 'end' node (Neo Exdeath).

## Use (Website)

[A version of Enkibot is available online](http://tukkek.github.io/Enkibot). Note that the live version Enkibot may or may not be up-to-date with any particular GitHub repository.

## Use (local server)
Using a local version of Enkibot should be as simple as starting a basic webserver from the project's base directory. If you have Ruby or Python installed, for example, one of these should work out-of-the-box:

* `ruby -run -e httpd -- . -p 8000`
* `python3 -m http.server`

After that is done, simply open `http://localhost:8000` from any modern web browser and you're good to go!

## Use (Ruby API)
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
    map: mapfile.jpg # map image relevant to this node
    coordinates: [[0,0],[0,0]] # any set of pixel coordinates to highlight on the map (useful for world maps)
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
## Inline links

Enkibot will recognize and "linkify" valid URLs in the text of any hints (like `cavesofnarshe.com`) but also in particular special links in the format `enki.bot/node`, which will be automatically transformed into internal navigation (for example: writing `enki.bot/omega` will lead to the `omega` node when clicked). The Introduction node (`begin.yaml`) contains examples of both types of links - external and internal.

This internal link mechanism is also designed to allow actual links (from other websites, mostly or even shared pages/copy-pasted addresses from inside Enkibot) to be fully functional. If you try clicking [this link](http://tukkek.github.io/Enkibot/#chocobo_forest), it should land you directly at *Chocobo Forest*, hopefully!

Oh and through this all your browser's history features (ie. arrows) are fully supported, which is nice, kupo!
