#!/usr/bin/env node
// PreToolUse hook: run lint + typecheck before git commit
// Matches: Bash tool where command contains "git commit"
// Reads JSON from stdin: { tool_name, tool_input: { command: "..." } }
// Outputs warnings to stdout (informational — does not block the commit)

const { execSync } = require('child_process');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const command = data.tool_input?.command || '';

    // Only intercept git commit commands
    if (!command.match(/\bgit\s+commit\b/)) return;

    const errors = [];

    // Run ESLint
    try {
      execSync('npx next lint --quiet', {
        encoding: 'utf8',
        timeout: 60000,
        windowsHide: true,
        stdio: ['pipe', 'pipe', 'pipe']
      });
    } catch (e) {
      const output = (e.stdout || '') + (e.stderr || '');
      if (output.trim()) {
        errors.push('[PRE-COMMIT] ESLint issues:\n' + output.trim());
      }
    }

    // Run TypeScript check
    try {
      execSync('npx tsc --noEmit', {
        encoding: 'utf8',
        timeout: 120000,
        windowsHide: true,
        stdio: ['pipe', 'pipe', 'pipe']
      });
    } catch (e) {
      const output = (e.stdout || '') + (e.stderr || '');
      if (output.trim()) {
        errors.push('[PRE-COMMIT] TypeScript errors:\n' + output.trim());
      }
    }

    if (errors.length > 0) {
      process.stdout.write(
        errors.join('\n\n') +
        '\n\n[PRE-COMMIT] Fix these issues before committing.'
      );
    }
  } catch (e) {
    // Silent fail — never break Claude's workflow
  }
});
