# SertifyMe Ai Agents

## Overview

SertifyMe AI Agents empower organizations to manage, issue, and verify digital certifications using AI-driven tools. With multi-agent support, advanced model integrations, and document handling, SertifyMe brings automation and intelligence to credential management.

## Features

- Connected to the SertifyMe Smart Contract on Mode
- Included SertifyMe Goat Plugin

## Use Cases

- Digital Certification Management: Automate issuing and verifying credentials.
- Autonomous Verification Agents: Validate certificates across platforms.
- Process Optimization: Streamline document handling and credential tracking.
- AI-powered Support: Enable 24/7 intelligent assistance for queries related to certifications.

## Quick Start

### Prerequisites

- [Python 2.7+](https://www.python.org/downloads/)
- [Node.js 23+](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [pnpm](https://pnpm.io/installation)

> **Note for Windows Users:** [WSL 2](https://learn.microsoft.com/en-us/windows/wsl/install-manual) is required.

### Manually Start

```bash
# Clone the repository
git clone https://github.com/Iqbalfachry19/sertifyme-ai-agents.git

cd sertifyme-ai-agents
pnpm i
pnpm build
pnpm start --characters="./characters/sertifyme.character.json"
```

### Edit the .env file

Copy .env.example to .env and fill in the appropriate values.

```
cp .env.example .env
```
