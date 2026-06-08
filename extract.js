const fs = require('fs');
const lines = fs.readFileSync('C:/Users/rahul/.gemini/antigravity/brain/e2e68101-f3bc-4b61-b5a3-e47625901936/.system_generated/logs/transcript.jsonl', 'utf-8').split('\n');
for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].includes('"type":"USER_INPUT"') && lines[i].includes('Final Audit Report')) {
    const data = JSON.parse(lines[i]);
    fs.writeFileSync('C:/Users/rahul/OneDrive/Desktop/antigravity/finance-platform/last_user_input.txt', data.content);
    break;
  }
}
