# create-core-app

Scaffold a new core.js application with zero configuration.

## Installation

Install via npm:

```bash
npm install -g @core.sbs/create-core-app
```

## Usage

### Quick Start

After installation:

```bash
create-core-app my-app
```

The CLI will guide you through setup options:
- **Development server** - Install and start core-dev for hot reloading
- **Component generator** - Install core-gen for scaffolding components  
- **Routing** - Enable SPA routing in your app

## Usage

### Interactive Prompts

The CLI will ask about optional tools:

```bash
create-core-app my-app
? Would you like to install the development server? (Y/n)
? Would you like to install the component generator? (Y/n)  
? Would you like to enable routing? (Y/n)
```

### Skip Auto-Start

If you don't want the dev server to start automatically:

```bash
create-core-app my-app --no-server
cd my-app
core-dev
```

Or link it globally for testing:

```bash
cd cli/create-core-app
npm link
cd ../..
create-core-app my-app
```

## What You Get

- Beautiful welcome page with live demos
- Interactive examples showing:
  - Reactivity (counter demo)
  - Data fetching (API integration)
  - Routing (SPA navigation)
  - Live framework stats
- Pre-configured core.js setup
- Starter styles
- Getting started guide

## Templates

### Default Template

```bash
create-core-app my-app
```

Creates a welcome page with interactive demos and getting started guide.

### Coming Soon

- Dashboard template
- Blog template
- E-commerce template

## Features

- ✅ Zero build step - just open index.html
- ✅ No dependencies to install
- ✅ Works offline after first load
- ✅ Beautiful welcome page
- ✅ Live framework metrics
- ✅ Interactive demos
- ✅ Mobile responsive

## Next Steps

After creating your app:

1. **Install VS Code Extension** - Get 56 code snippets
   ```
   Search for "core.js" in VS Code extensions tab and install
   ```

2. **Generate Components** - Use the component generator
   ```bash
   core-gen form --validation
   core-gen table --sortable
   ```

3. **Read the Docs** - Learn more about core.js
   ```
   https://github.com/Sitezip/core.sbs
   ```

## No Build Step Required

Unlike other frameworks, core.js apps don't need:
- ❌ npm install
- ❌ webpack/vite/rollup
- ❌ babel/typescript compilation
- ❌ build scripts

Just include the CDN script and start coding!

## License

MIT
