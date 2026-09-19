# mock-webiste-for-potential-clients-

## Magic UI MCP

This repo ships a project-scoped MCP config (`.mcp.json`) for the
[Magic UI](https://magicui.design) MCP server, which gives an AI-assisted
editor direct access to the Magic UI component catalog.

Claude Code picks it up automatically from `.mcp.json` — approve the server
when prompted on the next session start (`/mcp` shows its status).

For other editors, install it with the Magic UI CLI:

```bash
npx @magicuidesign/cli@latest install cursor    # or: windsurf | claude | cline | roo-cline
```

Then restart the editor. Once connected you can ask for components directly,
e.g. "add a blur fade text animation" or "add a vertical marquee of logos".
