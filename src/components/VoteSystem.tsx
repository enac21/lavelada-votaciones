import { useState } from "preact/hooks"

import CombatsInfo from "@/data/combates.json"

interface CombatInfo {
    id: number,
    title: string,
    combatTitle: string,
    boxers: Boxer[]
}

interface Boxer {
    id: string,
    boxerName: string,
    image: string,
}

type Votes = Array<Array<string>>

export function VoteSystem () {
    const [combatInfo] = useState<CombatInfo[]>(CombatsInfo)
    const [votes, setVotes] = useState<Votes>(Array.from({ length: combatInfo.length }, () => []))

    const handleVote = (
        { combatId, boxerName }:
        { combatId: number, boxerName: string }
    ) => {
        const combatVote = votes[combatId]
        
        if (combatVote.includes(boxerName)) {
            const newVote = combatVote.filter((vote) => vote != boxerName )
            setVotes(prevVote => prevVote.with(combatId, newVote))
            return
        }

        if (combatVote.length >= 1) return

        const newVote = [...combatVote, boxerName]
        setVotes(prevVotes => prevVotes.with(combatId, newVote))
    }

    return (
        combatInfo?.map((combat) => {
            const boxersLenght = combat.boxers.length
            
            let combatTitle = combat.combatTitle
            if(boxersLenght == 2) {
                combatTitle = `${combat.boxers[0].boxerName} 
                VS 
                ${combat.boxers[1].boxerName}`
            }

            return (
                <section class="animate-fade-in animate-delay-[1s]">
                    <div class="flex justify-center">
                        <h2 class="text-center font-medium text-primary font-atomic text-6xl uppercase border-primary mt-10 whitespace-pre-line">
                            {combatTitle}
                        </h2>
                    </div>
                    <ul class="flex flex-auto border-primary border-b-2">
                        {
                            combat?.boxers?.map((boxer, boxerI) => {
                                const combatVote = votes[combat.id - 1]
                                const isVoted = combatVote?.includes(boxer.boxerName)
                                return (
                                    <li class={
                                        `${isVoted ? 'bg-gradient-to-t from-lime-400' : ''} 
                                        w-full transition text-center sm:w-1/2 xl:w-1/2 overflow-hidden`}>
                                        <button 
                                            class="w-full h-full"
                                            onClick={() => handleVote({ combatId: combat.id - 1, boxerName: boxer.boxerName })}>
                                                <img 
                                                    src={combat.boxers[boxerI].image} 
                                                    alt={boxer.boxerName}
                                                    class={`${isVoted ? 'opacity-100 scale-110' : 'opacity-70'} ${!isVoted && combatVote.length > 0 ? 'opacity-20' : 'hover:scale-110 hover:opacity-100'} transition-all ease-in-out duration-500 rounded w-full h-full pt-8`}/>
                                        </button>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </section>
            );
        })
        
        //TODO - Vote resume with boxer img in a circle
        //TODO - Button to send all the votes
    )
}