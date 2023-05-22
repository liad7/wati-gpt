
import { openAiService } from "../services/api/openAi/openAi";
import { ChatCompletionResponseMessage } from 'openai/dist/api';

export default async function Home() {
  const message: ChatCompletionResponseMessage = await openAiService.getAnswerFromGpt('how are you?')
  const { role, content } = message
  console.log('content: ', content);
  console.log('role: ', role);

  return (
    <main>

    </main>
  )
}
