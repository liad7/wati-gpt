import Image from 'next/image'
import styles from './page.module.css'
import { openAiService } from "../services/api/openAi/openAi";

export default function Home() {
  const message = openAiService.getAnswerFromGpt('how are you?')
  return (
    <main>
      <h1>{message}</h1>
    </main>
  )
}
