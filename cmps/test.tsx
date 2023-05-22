'use client'

import { watiService } from "@/services/api/wati/wati"
import { useEffect, useState } from "react"

export function Test() {
    // const [stations, setStations] = useState<[]>([])

    useEffect(() => {
        loadChat()
    }, [])

    const loadChat = async () => {
        const chatDetails = await watiService.getChatHistoryByNumber('972546665218')
        console.log('chatDetails:', chatDetails);
    }

    return (
        <section>

        </section>
    )
}