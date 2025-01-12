# 0.11.2

-   fixed flat-check not working with system version `5.2.3`
-   fixed automated creature cover testing against target token itself

# 0.11.1

-   fixed flat-footed being applied when hidden attacker was targeting a token with darkvision
-   fixed issue with extra large creature hidden in scene messing up with the automated creature cover test always returning standard cover

# 0.11.0

-   added NPC `Rule Based Vision` support, you need to enable the vision on the NPC tokens for it to take action
-   added `Force NPC Vision` setting which will force the `Vision Enabled` option on newly created NPC tokens, this can be set on a per-scene basis
-   added a warning if the `PF2e Rules-Based NPC Vision` module is active, both modules will conflict with each other
-   moved custom context flags into a single namespace
-   fixed issue with the rollOption `set` when using `none` and `observed`

# 0.10.0

-   added `cover|visibility:set:x` rollOption to force a cover|visibility state equal to `x`, here `x` cannot be `all` but accept `none` for cover and `observed` for visibitlity
-   added a button in attack chat cards which allows the GM to un-hide the token that initiated the attack
-   added support for NPC senses using the senses shown in `Special Senses` field ; also, and even though the system doesn't support it and gives a warning, NPCs can use the `Sense` Rule Element to add temporary vision senses (e.g. using a darkvision spell effect or similar)
-   messages are now parsed during the `ready` hook on first load and after a refresh of the browser tab
-   the module will no longer roll a flat-check for hidden targets when the attacker has darkvision
-   changed the rollOption `visibility:noflat:x` to be `visibility:noff:x`, the former could be confused with "no flat-check" instead of "no flat-footed" (i confused myself with it...)

# 0.9.0

-   did a complete refactor of the rollOptions, you can find a summary of how they work here: https://github.com/reonZ/pf2e-perception#roll-options

# 0.8.0

-   added support for custom rollOptions, those can be added via the system `RollOption` or directly provided in the attack options arguments, here is an example on how to implement the `Blind-Fight` feat, just add those 3 REs in the feat itself:
-   removed automated support for the `Blind-Fight` feat
-   you can now manually override a cover in the modifiers window (the one you need to hold shift to show or not show during a check roll)

# 0.7.2

-   fixed an issue brought by `11.306`

# 0.7.1

-   fixed issue with automated light exposure always considering tokens `hidden` in scenes that had vision/exposure disabled or not in the dark

# 0.7.0

-   replaced `Automate Concealment` setting with `Automate Light Exposure`
-   the system now check if a token is in bright light, dim light or darkness when it comes to automatically checking its visibility state
-   added `Perception Menu Permission` setting which allow you to select which minimum permission a user must have to be able to interact with the perception menu (keep in mind that the menu is a major spoiler if given access to players)
-   added `Conditional Icons` settings menu where you can set custom path to icon images that will be displayed on token hover
-   added `Flat Check` setting allowing you to disabled module flat checks, roll flat checks before attacks or canceling the attacks entirely on failure
-   the `Hide` and `Seek` actions now properly use the degree of success provided by natural 20/1
-   you can now also validate the `Seek` action even without having used a template (you can also manually target)
-   automated creature cover will no longer care for the type of attack (reach, ranged, etc.), it will still require a minimum of 1 square of distance between attacker and target
-   when a player hover over a token, they will not be shown visibility tokens above `concealed` if the other token isn't owned by a player, this prevent players from knowing if they are indeed hidden/undetected from another token
-   fixed validation buttons not showing up on chat message roll cards when using `Dorako UI` module
-   fixed issue with orphan tokens
-   fixed target-less point-out error
-   fixed greater cover giving the wrong bonus value

# 0.6.1

-   fixed a bug during automated concealment check preventing attacks

# 0.6.0

-   non-listed first release
