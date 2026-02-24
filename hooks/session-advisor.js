#!/usr/bin/env node
// SessionStart hook: assess codebase state and recommend skills
// Checks: uncommitted changes, outdated deps, recent file modification patterns
// Outputs actionable recommendations to Claude

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  const recommendations = [];

  // --- Check for uncommitted changes ---
  try {
    const status = execSync('git status --porcelain', {
      encoding: 'utf8',
      timeout: 5000,
      windowsHide: true,
      stdio: ['pipe', 'pipe', 'pipe']
    }).trim();

    if (status) {
      const lines = status.split('\n').filter(Boolean);
      const modified = lines.filter(l => l.startsWith(' M') || l.startsWith('M ')).length;
      const untracked = lines.filter(l => l.startsWith('??')).length;
      const staged = lines.filter(l => l.match(/^[MADRC] /)).length;

      if (modified + staged > 0) {
        recommendations.push(
          `[ADVISOR] ${modified + staged} uncommitted changes detected.`,
          `  - Run /review-changes to audit before committing`,
          `  - Run /ship-it before deploying`
        );
      }

      // Check if any payment/auth files are modified
      const criticalFiles = lines.filter(l =>
        l.includes('pricing') || l.includes('payment') || l.includes('linq') ||
        l.includes('auth') || l.includes('middleware') || l.includes('bookings/route')
      );
      if (criticalFiles.length > 0) {
        recommendations.push(
          `  - CRITICAL files modified: ${criticalFiles.map(l => l.trim().split(' ').pop()).join(', ')}`,
          `  - Run /pricing-verify and /security-audit before deploying`
        );
      }
    }
  } catch {}

  // --- Reset edit state for new session ---
  const stateFile = path.join(__dirname, '.edit-state.json');
  try {
    fs.writeFileSync(stateFile, JSON.stringify({ editedFiles: [], editCount: 0, categories: {} }));
  } catch {}

  // --- Clean up Puppeteer MCP screenshots ---
  try {
    const projectRoot = path.resolve(__dirname, '..', '..');
    const files = fs.readdirSync(projectRoot).filter(f => f.startsWith('tmp-') && f.endsWith('.png'));
    if (files.length > 0) {
      files.forEach(f => fs.unlinkSync(path.join(projectRoot, f)));
      recommendations.push(`[ADVISOR] Cleaned up ${files.length} Puppeteer screenshot(s).`);
    }
  } catch {}

  // --- Check if npm audit has critical issues (quick check) ---
  try {
    const auditResult = execSync('npm audit --json 2>/dev/null', {
      encoding: 'utf8',
      timeout: 15000,
      windowsHide: true,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    const audit = JSON.parse(auditResult);
    const critical = audit.metadata?.vulnerabilities?.critical || 0;
    const high = audit.metadata?.vulnerabilities?.high || 0;
    if (critical > 0 || high > 0) {
      recommendations.push(
        `[ADVISOR] npm audit: ${critical} critical, ${high} high vulnerabilities.`,
        `  - Run /dep-audit for details and fixes`
      );
    }
  } catch {}

  if (recommendations.length > 0) {
    process.stdout.write(recommendations.join('\n') + '\n');
  }
} catch (e) {
  // Silent fail
}
