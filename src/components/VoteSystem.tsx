import { useState, useEffect } from "preact/hooks"

import CombatsInfo from "@/data/combates.json"

type Votes = Array<string>

export function VoteSystem () {
    const combatInfo = CombatsInfo
    
    const [votes, setVotes] = useState<Votes>(Array.from({ length: combatInfo.length }))
    const allVoted = votes.every(combatVote => combatVote != undefined);
    
    const [alreadyVoted, setAlreadyVoted] = useState(false)
    const [storageVotes, setStorageVotes] = useState<Votes>()
    
    useEffect(() => {
        const storageVotesJSON = localStorage.getItem('votes');
        if (storageVotesJSON) {
            const storageVotes = JSON.parse(storageVotesJSON);
            setStorageVotes(storageVotes);
            setAlreadyVoted(true)
        }
    }, [alreadyVoted]);

    const handleVote = (
        { combatId, boxerId }:
        { combatId: number, boxerId: string }
    ) => {
        const combatVote = votes[combatId]
        
        if (combatVote == boxerId) {
            setVotes(prevVote => prevVote.with(combatId, ""))
            return
        }  

        setVotes(prevVotes => prevVotes.with(combatId, boxerId))
    }

    const sendVotes = (
        votes: Votes 
    ) => {
        //TODO Save votes in DB - UserName + BoxerId ordered by combatId (index)
        const votesJSON = JSON.stringify(votes);
        localStorage.setItem('votes', votesJSON);

        setAlreadyVoted(true)
    }

    if (alreadyVoted && storageVotes != undefined) {
        return (
            //TODO - Extract this to a component
            <section class="m-5 text-center text-primary animate-fade-in animate-delay-[0,5s]">
                <p class="uppercase text-3xl">Ya has realizado tus votos</p>
                <div class="flex justify-center items-center mb-5">
                    <div class="grid grid-cols-3 gap-4">
                        {
                            storageVotes.map((votedBoxer, i) => {
                                const boxerIndex = parseInt(votedBoxer)-1
                                return (
                                    <div class="text-center">
                                    <img src={combatInfo[i].boxers[boxerIndex].image_sml} alt={combatInfo[i].boxers[boxerIndex].boxerName} class="w-24 h-24 rounded-full mx-auto mb-2"/>
                                    <p class="text-sm font-medium">{combatInfo[i].boxers[boxerIndex].boxerName}</p>
                                </div>
                                )
                            })
                        }
                    </div>
                </div>
                <button class="transition hover:scale-125 font-medium font-atomic text-6xl uppercase" 
                    onClick={() => {
                        localStorage.removeItem("votes")
                        //TODO - Remove values from DB

                        setAlreadyVoted(false)
                    }}>
                        Volver a votar
                </button>
            </section>
        )
    }
  
    return (
        <section class="animate-fade-in animate-delay-[0,5s]">
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
                                        const combatVote = parseInt(votes[combat.id - 1])
                                        const isVoted = combatVote === parseInt(boxer.id)
                                        return (
                                            <li class={`group ${isVoted ? 'bg-gradient-to-t from-lime-400' : ''} w-full transition text-center sm:w-1/2 xl:w-1/2 overflow-y-clip text-3xl md:w-1/2 relative`}>
                                                <button class="w-full h-full" onClick={() => handleVote({ combatId: combat.id - 1, boxerId: boxer.id })}>
                                                        <img 
                                                            src={combat.boxers[boxerI].image}
                                                            class={`${isVoted ? 'opacity-100 scale-110' : 'opacity-80'} ${!isVoted && combatVote >= 0 ? '' : 'hover:scale-110 hover:opacity-100'} transition-all ease-in-out duration-500 rounded w-full h-full pt-8`}
                                                            style="mask-image: linear-gradient(black 90%, transparent 99%);"
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