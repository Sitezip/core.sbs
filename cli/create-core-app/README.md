# create-core-app

Scaffold a new core.js application with zero configuration.

## Usage

### From npm (once published)

```bash
npx @core-js/create-core-app my-app
```

The dev server will automatically start after scaffolding!

### Local Testing (before publishing)

From the root of the core.sbs repository:

```bash
node cli/create-core-app/bin/create-core-app.js my-app
# Dev server starts automatically at http://localhost:3000
```

### Skip Auto-Start

If you don't want the dev server to start automatically:

```bash
npx @core-js/create-core-app my-app --no-server
cd my-app
npx @core-js/dev
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
npx @core-js/create-core-app my-app
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
   Download from: https://github.com/Sitezip/core.sbs/releases
   ```

2. **Generate Components** - Use the component generator
   ```bash
   npx @core-js/gen form --validation
   npx @core-js/gen table --sortable
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
