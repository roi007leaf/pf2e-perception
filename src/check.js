import { getActorToken, getCoverEffect, isProne } from './actor.js'
import { COVERS, COVER_UUID, VISIBILITY_VALUES, attackCheckRoll, validCheckRoll } from './constants.js'
import { createCoverSource, findChoiceSetRule } from './effect.js'
import { MODULE_ID, getFlag, getSetting, localize } from './module.js'
import { getOption, optionsToObject, updateFromOptions } from './options.js'
import { validateTokens } from './scene.js'
import { getTokenTemplateTokens } from './template.js'
import { getVisibility } from './token.js'

export async function checkRoll(wrapped, ...args) {
    const context = args[1]
    if (!context) return wrapped(...args)

    if (Array.isArray(context.options)) context.options = new Set(context.options)

    const { actor, createMessage = 'true', type, token, target, isReroll } = context
    const originToken = token ?? getActorToken(actor)
    const targetToken = target?.token
    const isAttackRoll = attackCheckRoll.includes(type)
    const flatCheck = getSetting('flat-check')

    if (
        isReroll ||
        !createMessage ||
        !originToken ||
        !validCheckRoll.includes(type) ||
        (isAttackRoll && (!targetToken || flatCheck === 'none'))
    )
        return wrapped(...args)

    if (isAttackRoll && targetToken.actor) {
        const options = optionsToObject(context.options)
        const visibility = updateFromOptions(getVisibility(targetToken, originToken), options, 'visibility')

        if (!visibility) return wrapped(...args)
        if (visibility === 'concealed' && originToken.actor?.hasLowLightVision) return wrapped(...args)
        if (visibility === 'hidden' && originToken.actor?.hasDarkvision) return wrapped(...args)

        const optionDC = getOption(options, visibility === 'concealed' ? 'concealed' : 'hidden', 'dc')?.[0]
        if (optionDC == 0) return wrapped(...args)

        const dc = optionDC ?? (visibility === 'concealed' ? 5 : 11)
        const roll = await new Roll('1d20').evaluate({ async: true })
        const total = roll.total
        const isSuccess = total >= dc
        const isUndetected = VISIBILITY_VALUES[visibility] >= VISIBILITY_VALUES.undetected

        new originToken.actor.perception.constructor(originToken.actor, {
            slug: 'visibility-check',
            label: `${game.i18n.localize('PF2E.FlatCheck')}: ${game.i18n.localize(`PF2E.condition.${visibility}.name`)}`,
            check: { type: 'flat-check' },
        }).roll({
            dc,
            target: targetToken.actor,
            rollMode: isUndetected ? (game.user.isGM ? 'gmroll' : 'blindroll') : 'roll',
        })

        if (isUndetected) {
            context.options.add('secret')
            context.pf2ePerception = {
                isSuccess: isSuccess,
                visibility: visibility,
            }
        }

        if (flatCheck !== 'roll' && !isUndetected && !isSuccess) return
    } else if (context.options.has('action:hide')) {
        setProperty(context, 'pf2ePerception.selected', game.user.targets.ids)
        // } else if (context.options.has('action:sneak')) {
        //     context.selected = game.user.targets.ids
    } else if (context.options.has('action:seek')) {
        const highlighted = getTokenTemplateTokens(originToken)
        if (highlighted === undefined) return wrapped(...args)

        const tokens = highlighted ?? Array.from(game.user.targets)
        const selected = validateTokens(originToken, tokens)
            .filter(t => !t.document.hidden)
            .map(t => t.id)

        setProperty(context, 'pf2ePerception.selected', selected)
    }

    return wrapped(...args)
}

export function renderCheckModifiersDialog(dialog, html) {
    const { createMessage = 'true', type, token, target, isReroll, options, dc } = dialog.context
    const originToken = token
    const targetToken = target?.token
    const targetActor = target?.actor

    if (isReroll || !createMessage || !originToken || !targetToken || !targetActor || !attackCheckRoll.includes(type)) return

    const coverEffect = getCoverEffect(targetActor)
    const currentCover = coverEffect
        ? findChoiceSetRule(coverEffect)?.selection.level ?? getFlag(coverEffect, 'level')
        : undefined
    let coverOverride = dialog[MODULE_ID]?.coverOverride ?? currentCover

    let template = '<div class="roll-mode-panel">'
    template += `<div class="label">${localize('dice-checks.cover.label')}</div>`
    template += `<select name="overrideCover"><option value="">${localize('dice-checks.cover.none')}</option>`

    const covers = isProne(targetActor) ? COVERS.slice(1) : COVERS.slice(1, -1)

    covers.forEach(slug => {
        const selected = slug === coverOverride ? 'selected' : ''
        const label = localize(`cover.${slug}`)
        template += `<option value="${slug}" ${selected}>${label}</option>`
    })

    template += '</select></div>'

    // visibility override here

    template += '<hr>'

    html.find('.roll-mode-panel').before(template)

    html.find('select[name=overrideCover]').on('change', event => {
        const value = event.currentTarget.value || undefined
        setProperty(dialog, `${MODULE_ID}.coverOverride`, value)
        coverOverride = value
    })

    html.find('button.roll')[0].addEventListener(
        'click',
        event => {
            event.preventDefault()
            event.stopPropagation()
            event.stopImmediatePropagation()

            let modified = false
            const items = deepClone(targetActor._source.items)

            if (coverOverride !== currentCover) {
                modified = true

                const coverIndex = items.findIndex(i => getProperty(i, 'flags.core.sourceId') === COVER_UUID)
                if (coverIndex !== -1) items.splice(coverIndex, 1)

                if (coverOverride) {
                    const source = createCoverSource(coverOverride)
                    items.push(source)
                }
            }

            if (modified) {
                target.actor = targetActor.clone({ items }, { keepId: true })

                if (dc?.slug) {
                    const statistic = target.actor.getStatistic(dc.slug)?.dc
                    if (statistic) {
                        dc.value = statistic.value
                        dc.statistic = statistic
                    }
                }
            }

            dialog.resolve(true)
            dialog.isResolved = true
            dialog.close()
        },
        true
    )

    dialog.setPosition()
}
