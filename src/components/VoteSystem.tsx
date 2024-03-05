import { useEffect, useState } from "preact/hooks"

import CombatsInfo from "@/data/combates.json"

interface CombatInfo {
    id: string,
    combatName: string,
    boxers: Boxer[]
}

interface Boxer {
    id: string,
    boxerName: string,
    image: string,
}

export function VoteSystem () {
    const [combatInfo, setCombatInfo] = useState<CombatInfo[]>(CombatsInfo)

    return (
        <ul class="gap-8">
            {
                combatInfo?.map((combat) => {
                    return (
                        <Card children={combat}/>
                    );
                })
            }
        </ul>
    )
}

function Card({ children }: { children: CombatInfo }) {
    return (
        <>
            <section class="animate-fade-in animate-delay-[1s]">
                <div class="flex justify-center">
                    <h2 class="text-center pt-3 font-bold text-primary border-b-2 border-primary">
                        {children.combatName}
                    </h2>
                </div>
                <ul class="flex flex-auto border-primary border-b-2">
                    {
                        children?.boxers?.map((boxer, i) => {
                            return (
                                <li class="w-full sm:w-1/2 xl:w-1/2 overflow-hidden">
                                    <a href="#" id={boxer.id}>
                                        <img src={children.boxers[i].image} class="w-full h-full pt-8 rounded hover:scale-110 transition-all ease-in-out duration-400 opacity-90 hover:opacity-100"/>
                                    </a>
                                </li>
                            )
                        })
                    }
                </ul>
            </section>
        </>
    )
}