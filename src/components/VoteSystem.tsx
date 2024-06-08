import { useState, useEffect } from "preact/hooks"

import CombatsInfo from "@/data/combates.json"

type Props = {
    userName: string;
};

type Votes = Array<string>

export function VoteSystem (props: Props) {
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
        const votesJSON = JSON.stringify(votes);
        localStorage.setItem('votes', votesJSON);

        const body = `{
            "content": "${props.userName} ha realizado sus votaciones para la velada. Tu tambien puedes votar en https://lavelada-votaciones.vercel.app/",
            "embeds": [
                {
                    "title": "<------------------- VOTOS ------------------->",
                    "color": 5814783
                },
                {
                    "title": "Apuesta a que gana ${combatInfo[0].boxers[parseInt(votes[0]) - 1].boxerName}",
                    "color": 5814783,
                    "author": {
                        "name": "${combatInfo[0].combatTitle}"
                    },
                    "image": {
                        "url": "${combatInfo[0].boxers[parseInt(votes[0]) - 1].discord_img}"
                    }
                },
                {
                    "title": "Apuesta a que gana ${combatInfo[1].boxers[parseInt(votes[1]) - 1].boxerName}",
                    "color": 5814783,
                    "author": {
                        "name": "${combatInfo[1].combatTitle}"
                    },
                    "image": {
                        "url": "${combatInfo[1].boxers[parseInt(votes[1]) - 1].discord_img}"
                    }
                },
                {
                    "title": "Apuesta a que gana ${combatInfo[2].boxers[parseInt(votes[2]) - 1].boxerName}",
                    "color": 5814783,
                    "author": {
                        "name": "${combatInfo[2].combatTitle}"
                    },
                    "image": {
                        "url": "${combatInfo[2].boxers[parseInt(votes[2]) - 1].discord_img}"
                    }
                },
                {
                    "title": "Apuesta a que gana ${combatInfo[3].boxers[parseInt(votes[3]) - 1].boxerName}",
                    "color": 5814783,
                    "author": {
                        "name": "${combatInfo[3].combatTitle}"
                    },
                    "image": {
                        "url": "${combatInfo[3].boxers[parseInt(votes[3]) - 1].discord_img}"
                    }
                },
                {
                    "title": "Apuesta a que gana ${combatInfo[4].boxers[parseInt(votes[4]) - 1].boxerName}",
                    "color": 5814783,
                    "author": {
                        "name": "${combatInfo[4].combatTitle}"
                    },
                    "image": {
                        "url": "${combatInfo[4].boxers[parseInt(votes[4]) - 1].discord_img}"
                    }
                },
                {
                    "title": "Apuesta a que gana ${combatInfo[5].boxers[parseInt(votes[5]) - 1].boxerName}",
                    "color": 5890060,
                    "author": {
                        "name": "${combatInfo[5].combatTitle}"
                    },
                    "image": {
                        "url": "${combatInfo[5].boxers[parseInt(votes[5]) - 1].discord_img}"    
                    }
                },
                {
                    "title": "<------------------- ${props.userName} ------------------->",
                    "color": 5814783
                }
            ],
            "username": "Ibai Llanos",
            "attachments": []
        }`;

        fetch("https://discord.com/api/webhooks/1249075861546860596/GsjpitHBuCI9Md7O7Y4h5OYTfyVD928gTT6knuzjmeLtFyt0ed8p_Lwj9ynMwE4R_0xs", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: body,
        })

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
                    const isKOH = boxersLenght > 2
                    
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
                                            <li class={`group ${isVoted ? 'bg-gradient-to-t from-primary' : ''} w-full transition text-center sm:w-1/2 xl:w-1/2 overflow-y-clip text-3xl md:w-1/2 relative`}>
                                                <button class="w-full h-full" onClick={() => handleVote({ combatId: combat.id - 1, boxerId: boxer.id })}>
                                                        <img 
                                                            src={combat.boxers[boxerI].image}
                                                            class={`${isVoted ? 'opacity-100 scale-110' : 'opacity-80'} ${!isVoted && combatVote >= 0 ? '' : 'hover:scale-110 hover:opacity-100'} transition-all ease-in-out duration-500 rounded w-full h-full pt-8`}
                                                            style="mask-image: linear-gradient(black 90%, transparent 99%);"
                                                        />
                                                </button>
                                                <span class={`${isKOH ? 'opacity-0' : 'absolute bg-primary md:mx-40 m-4 text-base font-bold uppercase text-secondary bottom-7 left-0 right-0 z-20 opacity-0 group-hover:opacity-100 transition duration-500 ease-in-out pointer-events-none'}`} aria-hidden="true">
                                                    Altura: {boxer.height} cm
                                                </span>
                                                <span class={`${isKOH ? 'opacity-0' : 'absolute bg-primary md:mx-40 m-4 text-base font-bold uppercase text-secondary bottom-0 left-0 right-0 z-20 opacity-0 group-hover:opacity-100 transition duration-500 ease-in-out pointer-events-none'}`} aria-hidden="true">
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
                <div class="send-button flex justify-center">
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