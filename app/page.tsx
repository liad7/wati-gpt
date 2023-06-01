
// import { openAiService } from "../services/api/openAi/openAi";
// import { ChatCompletionResponseMessage } from 'openai/dist/api';
// import { watiService } from '../services/api/wati/wati';
import { Header } from "@/cmps/header/header";
import { googleTranslateAPIService } from "../services/api/googleTranslateAPI/googleTranslateAPI"

export default async function Home() {
  // const watiContact = await watiService.getContacts()

  // const contactPhones = watiContact.contact_list.reduce((acc: any[], curr: { wAid: any; }) => {
  //   acc.push(curr.wAid)
  //   return acc
  // }, [])

  // const message: ChatCompletionResponseMessage = await openAiService.getAnswerFromGpt('how are you?')
  // const  {role, content}  = message
  googleTranslateAPIService.detectLanguage('Длина исходного кода API').then(res => googleTranslateAPIService.translateText('Длина исходного кода API', res).then(console.log))
  // googleTranslateAPIService.detectLanguage('אחשלי היקר מה איתך נשמה').then(res=>googleTranslateAPIService.translateText('אחשלי היקר מה איתך נשמה',res).then(console.log))

  return (
    <main className="main-container">
      <Header />
      <h1>hello i did a change</h1>
    </main>
  )
}
