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
    height: string,
    weight: string,
}

type Votes = Array<Array<string>>

export function VoteSystem () {
    const [combatInfo] = useState<CombatInfo[]>(CombatsInfo)
    const [votes, setVotes] = useState<Votes>(Array.from({ length: combatInfo.length }, () => []))
    const allVoted = votes.every(combatVote => combatVote.length > 0);

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

    const sendVotes = (
        votes: Votes 
    ) => {
        const votesJSON = JSON.stringify(votes);
        
        localStorage.setItem('votes', votesJSON);
    }

    /* TODO - Check the Votes in the storage
    const checkStgVotes = () => {
        const stgVotesJSON = localStorage.getItem('votes') || "";

        const stgVotes = JSON.parse(stgVotesJSON);

        console.log(stgVotes)

        return stgVotes
    }
    console.log(checkStgVotes())*/
  
    return (
        <section class="animate-fade-in animate-delay-[1s]">
            {
                combatInfo?.map((combat, i) => {
                    const boxersLenght = combat.boxers.length
                    
                    let combatTitle = combat.combatTitle
                    if(boxersLenght == 2) {
                        combatTitle = `${combat.boxers[0].boxerName}
                        VS
                        ${combat.boxers[1].boxerName}`
                    }

                    return (
                        <div>
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
                                            <li class={`group ${isVoted ? 'bg-gradient-to-t from-lime-400' : ''} w-full transition text-center sm:w-1/2 xl:w-1/2 overflow-hidden relative text-3xl md:w-1/2`}>
                                                <button class="w-full h-full" onClick={() => handleVote({ combatId: combat.id - 1, boxerName: boxer.boxerName })}>
                                                        <img 
                                                            src={combat.boxers[boxerI].image} 
                                                            class={`${isVoted ? 'opacity-100 scale-110' : 'opacity-70'} ${!isVoted && combatVote.length > 0 ? 'opacity-20' : 'hover:scale-110 hover:opacity-100'} transition-all ease-in-out duration-500 rounded w-full h-full pt-8`}
                                                        />
                                                </button>
                                                <span class="absolute bg-primary md:mx-40 m-4 text-base font-bold uppercase text-secondary bottom-7 left-0 right-0 z-20 opacity-0 group-hover:opacity-100 transition duration-500 ease-in-out pointer-events-none" aria-hidden="true">
                                                    Altura: {boxer.height} cm
                                                </span>
                                                <span class="absolute bg-primary md:mx-40 m-4 text-base font-bold uppercase text-secondary bottom-0 left-0 right-0 z-20 opacity-0 group-hover:opacity-100 transition duration-500 ease-in-out pointer-events-none" aria-hidden="true">
                                                    Peso: {boxer.weight} kg
                                                </span>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    );
                })
            }
            {
                <div class="send-button flex justify-center border-primary border-b-2">
                    <button onClick={() => sendVotes(votes)} 
                        class={`${allVoted ? 'transition hover:scale-125' : 'opacity-50 cursor-not-allowed'} text-center font-medium text-primary font-atomic text-6xl uppercase m-10`} 
                        disabled={!allVoted}>
                            Enviar
                    </button>
                </div>
            }
        </section>
    )
}