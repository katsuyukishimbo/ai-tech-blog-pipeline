import fs from 'fs';
import YAML from 'yaml';
import { OpenAI } from 'openai';
import { execSync } from 'child_process';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
(async () => {
  const draftFiles = fs.readdirSync('content/draft');
  for (const file of draftFiles) {
    const outline = fs.readFileSync(`content/draft/${file}`, 'utf8');
    const sys =
      'You are a senior tech blogger. Output YAML keys: title, summary, tags, heroPrompt, videoPrompt, bodyMD';
    const { choices } = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: sys },
        { role: 'user', content: outline },
      ],
    });
    const res = YAML.parse(choices[0].message.content!);
    const slug = res.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    fs.writeFileSync(
      `content/posts/${slug}.mdx`,
      `---\ntitle: ${res.title}\nsummary: ${res.summary}\ntags: [${res.tags.join(',')}]\n---\n\n${res.bodyMD}`,
    );
    execSync(
      `curl -H "Authorization: Bearer $FLUX_API_KEY" -d '{"prompt":"${res.heroPrompt}","size":"1024"}' https://api.fluxpro.ai/v1/generate -o public/assets/${slug}-hero.png`,
    );
    execSync(`kling-cli --prompt "${res.videoPrompt}" -o public/assets/${slug}-teaser.mp4`);
  }
})();
