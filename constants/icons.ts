import { SFSymbols7_0 } from "sf-symbols-typescript";

// contracts/[id].tsx: Icons array for the options
    export const contractDetailsIcons: SFSymbols7_0[] = 
        ['ellipsis', 'square.and.pencil', 'arrow.2.circlepath', 'flag.slash']


// [ContractPill].tsx: Icons for pill types
    export const logIcons = {
        submitted: 'checkmark.circle',
        notSubmitted: 'xmark.circle'
    } satisfies Record< string, SFSymbols7_0>

    export const verificationIcons = {
        pending: 'hourglass',
        approved: 'checkmark.seal',
        rejected: 'xmark.seal',
    } satisfies Record< string, SFSymbols7_0>

// [FilterMenu].tsx: Icons for each filter
    // Also uses contractDetailsIcons
    export const sortByIcons: SFSymbols7_0[] = ['line.3.horizontal.decrease', 'arrow.down.to.line', 'arrow.up.to.line', 'clock.badge.exclamationmark']
    export const statusIcons: SFSymbols7_0[] = ['circle.dashed', 'checkmark.circle', 'archivebox']
    export const difficultyIcons: SFSymbols7_0[] = ['chart.bar.fill', 'tortoise']
    export const contractIcons: SFSymbols7_0[] = ['doc.text']
    export const dateIcons: SFSymbols7_0[] = ['calendar']
    export const statusLogIcons: SFSymbols7_0[] = ['circle.dashed', 'hourglass', 'checkmark.seal', 'xmark.seal']
