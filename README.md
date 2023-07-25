# FoundryVTT PF2e Perception

### This module will add the ability to set conditional covers and visibility between tokens on a scene

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/K3K6M2V13)

Bullet points:

-   the GM can use a new icon (eye) in the token HUD to open the Perception menu for that token, in that menu, you can manually select the conditional covers and visibilities this token has against the other tokens in the scene

-   hovering over a token will display the conditional covers and visibilities other tokens in the scene have gainst this one

-   the module will hide tokens that are conditionally undetected from the currently selected tokens for the GM

-   the module will hide tokens that are conditionally undetected from any owned token in the scene for the players

-   the module will hide unnoticed combatants from the combat tracker for players using the same logic as above

-   the module allows players to target conditionally undetected tokens from the combat tracker

-   the module can automatically check if a token is in bright light, dim light or in darkness

-   the module can automatically check for standard covers (2 methods to test it are offered)

-   the module can automatically check for covers generated by other tokens, it only applies on attacks that have the reach or ranged trait and spells and only if there a minimum distance of 1 square between the attacker and the target

-   you can completely ignore any conditional cover by checking the `Ignore Conditional Covers` in the attack modifiers window (the one that automatically appear on all attacks or when holding shift), the option only appears if there is a cover to ignore

-   the module automatically applies conditional covers modifiers on attacks

-   the module automatically applies conditional flat-footed modifier on attack when a token is hidden/undetected from another token

-   the module automatically roll a flat-check roll before an attack on a token that is concealed/hidden from the attacker and will cancel the attack when failed

-   the module handles attacking a conditionally undetected token by rolling a blind flat-check and attack roll

-   the module override the `Take Cover` system action, when used with targets, conditional covers will be applied instead of using the system effect

-   the module override the `Hide` system action to be able to apply conditional hidden, the module will automatically roll against the other token's perception DC ; you can target tokens to narrow down which should be affected

-   the module override the `Seek` system action, it will offer the ability to create a template that will automatically be used to target undetected/hidden token and roll against their stealth DC

-   the module add the `Point Out` action, which can be found with the other system actions `game.pf2e.actions.get('point-out')`, if you have a target when using it, the module will modify the target's conditional visibility against the allies of the actor that initiated the action

-   there is a lot of functions exposed in `game.modules.get('pf2e-perception')` that can be used, some even have a debug mode to display the computation like `getCreatureCover`, `hasStandardCover` or `inBrightLight`

# Roll Options

you can use custom rollOptions to adjust cover and visibility during attacks, this can be done either by adding system `RollOption` to feats/features/effect/etc. or passing them directly in the attack options argument. here is an example of how to implement the `Blind-Fight` feat, just add those 3 REs to the feat itself:

```json
{"key":"RollOption","domain":"all","option":"self:pf2perception:visibility:noff-self:all"}
{"key":"RollOption","domain":"all","option":"self:pf2perception:concealed:dc:0"}
{"key":"RollOption","domain":"all","option":"self:pf2perception:hidden:dc:5"}
```

when the changes are supposed to be made when the token the rollOption exists on is targeted instead of being the attacker, you need to add a `-self` to the option (e.g. `cover:cancel-self:all`, `hidden:dc-self:0`)

all rollOptions must be prefixed with `self:pf2perception:`

you can replace `x` by `all` for the rollOption to trigger on all cover|visibility values

-   `cover|visibility:cancel:x` to completely cancel the cover|visibility if it is equal to `x`
-   `cover|visibility:set:x` to force a cover|visibility state equal to `x`, here `x` cannot be `all` but accept `none` for cover and `observed` for visibitlity
-   `cover|visibility:reduce:x` to reduce the cover|visibility by one tier if it is equal to `x`
-   `visibility:noff:x` do not add the flat-footed condition when the visibility is equal to `x`
-   `cover:ignore:xxx` to ignore a certain token (replace `xxx` by the token id) when testing for creature cover
-   `lesser|standard|greater|greater-prone:ac:0` to force a certain AC value for a cover
-   `concealed|hidden:dc:0` to force a certain DC value for a visibility

the priority of rollOptions is: `cancel` > `set` > `reduce` > ...

# Wiki

take a look at the [wiki](https://github.com/reonZ/pf2e-perception/wiki/Roll-Options) to find some pre-built rollOptions and macros to use with the module

# CHANGELOG

You can see the changelog [HERE](./CHANGELOG.md)
