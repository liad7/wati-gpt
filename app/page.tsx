
import { openAiService } from "../services/api/openAi/openAi";
import { ChatCompletionResponseMessage } from 'openai/dist/api';
import { watiService } from '../services/api/wati/wati';
import { Header } from "@/cmps/header/header";

export default async function Home() {
  const watiContact = await watiService.getContacts()
  console.log('watiContact: ', watiContact.contact_list[0].wAid);

  const contactPhones = watiContact.contact_list.reduce((acc: any[], curr: { wAid: any; }) => {
    acc.push(curr.wAid)
    return acc
  }, [])
  console.log('contact_list.length:', watiContact.contact_list.length)
  console.log('contactPhones: ', contactPhones);
  console.log('contactPhones.length:', contactPhones.length)

  const message: ChatCompletionResponseMessage = await openAiService.getAnswerFromGpt('how are you?')
  const { role, content } = message

  return (
    <main>
      <Header />
      <h1>hello</h1>
    </main>
  )
}
