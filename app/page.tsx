
import { openAiService } from "../services/api/openAi/openAi";
import { ChatCompletionResponseMessage } from 'openai/dist/api';
import { watiService } from '../services/api/wati/wati2';

export default async function Home() {
  const watiContact = await watiService.getContacts()
  console.log('watiContact: ', watiContact.contact_list[0].id);
  const message: ChatCompletionResponseMessage = await openAiService.getAnswerFromGpt('how are you?')
  const { role, content } = message
  return (
    <main>
      <Test />
    </main>
  )
}
