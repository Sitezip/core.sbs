# core.js Snippet Definitions

This document defines all the snippets for the core.js framework VSCode extension.

## Core.js Pockets

### `cpk` - Basic Pocket
```html
<div class="core-pocket" data-core-templates="${1:templateName}"></div>
```

### `cpkd` - Pocket with Data Source
```html
<div class="core-pocket" 
     data-core-templates="${1:templateName}" 
     data-core-source-${1:templateName}="${2:https://api.example.com/data}">
</div>
```

### `cpkt` - Pocket with Template (Full)
```html
<div class="core-pocket" 
     data-core-templates="${1:templateName}"
     data-core-source-${1:templateName}="${2:/api/endpoint}">
</div>
```

### `cpkid` - Pocket with ID
```html
<div id="${1:pocketId}" class="core-pocket" 
     data-core-templates="${2:templateName}">
</div>
```

### `cpknr` - Pocket (No Routing)
```html
<div class="core-pocket" 
     data-core-templates="${1:templateName}" 
     data-core-routing="false">
</div>
```

## Core.js Templates

### `ctpl` - Basic Template
```html
<template name="${1:templateName}">
    ${2:<div>$3</div>}
</template>
```

### `ctpld` - Template with Data Reference
```html
<template name="${1:templateName}">
    <div>
        <h2>{{data:${1:templateName}:${2:title}}}</h2>
        <p>{{data:${1:templateName}:${3:description}}}</p>
        $0
    </div>
</template>
```

### `ctplc` - Template with Clone
```html
<template name="${1:templateName}">
    <div>
        <h2>{{data:${1:templateName}:${2:title}}}</h2>
        <div class="core-clone" data-core-data="${1:templateName}:${3:items}">
            <p>{{rec:${4:name}}}</p>
        </div>
    </div>
</template>
```

### `ctplf` - Full Template (with multiple sections)
```html
<template name="${1:templateName}">
    <div class="${2:container}">
        <header>
            <h1>{{data:${1:templateName}:${3:title}}}</h1>
        </header>
        <main>
            <div class="core-clone" data-core-data="${1:templateName}:${4:items}">
                <div class="${5:item}">
                    <h3>{{rec:${6:name}}}</h3>
                    <p>{{rec:${7:description}}}</p>
                </div>
            </div>
        </main>
        $0
    </div>
</template>
```

## Core.js Clones

### `ccl` - Basic Clone
```html
<div class="core-clone" data-core-data="${1:dataRef}:${2:arrayField}">
    ${3:<p>{{rec:$4}}</p>}
</div>
```

### `cclr` - Clone with Record References
```html
<div class="core-clone" data-core-data="${1:dataRef}:${2:items}">
    <div class="${3:item-card}">
        <h3>{{rec:${4:title}}}</h3>
        <p>{{rec:${5:description}}}</p>
        <span>{{rec:${6:date}:date:m/d/Y}}</span>
    </div>
</div>
```

### `cclnest` - Nested Clone (Recursive)
```html
<div class="core-clone" data-core-data="${1:dataRef}:${2:items}">
    <div>
        <h4>{{rec:${3:name}}}</h4>
        {{rec:${4:children}:core_pk_cloner:${5:childTemplate}}}
    </div>
</div>
```

### `cclaug` - Clone with Augmented Data
```html
<div class="core-clone" data-core-data="${1:dataRef}:${2:items}">
    <div class="${3:item}">
        <span class="index">{{aug:index}}</span>
        <span class="total">{{aug:count}}</span>
        <h3>{{rec:${4:title}}}</h3>
        $0
    </div>
</div>
```

## Template Directives

### `cdata` - Data Reference
```html
{{data:${1:dataRef}:${2:field}}}
```

### `crec` - Record Reference
```html
{{rec:${1:fieldName}}}
```

### `caug` - Augmented Data
```html
{{aug:${1|index,count,first,last|}}}
```

### `cattr` - Attribute Injection
```html
{{rec:${1:fieldName}:core_pk_attr:${2:src}}}
```

### `ccloner` - Recursive Cloner
```html
{{rec:${1:childrenField}:core_pk_cloner:${2:templateName}}}
```

### `cformat` - Formatted Data
```html
{{data:${1:dataRef}:${2:field}:${3|date,money,upper,lower,title,nohtml|}}}
```

### `crecformat` - Formatted Record
```html
{{rec:${1:field}:${2|date,money,upper,lower,title,nohtml|}}}
```

### `cdateformat` - Date Formatting
```html
{{rec:${1:dateField}:date:${2:m/d/Y}}}
```

### `cmoneyformat` - Money Formatting
```html
{{rec:${1:priceField}:money:${2:$}}}
```

## Core.js Lifecycle Hooks

### `cudinit` - User Defined Init Hook
```javascript
core.ud.init = () => {
    ${1:// Initialization code}
    $0
};
```

### `cudsoc` - Start of Call Hook
```javascript
core.ud.soc = () => {
    ${1:// Runs before rendering lifecycle}
    $0
};
```

### `cudeoc` - End of Call Hook
```javascript
core.ud.eoc = () => {
    ${1:// Runs after rendering complete}
    $0
};
```

### `cudpre` - Preflight Hook
```javascript
core.ud.preflight = (dataRef, dataSrc, type) => {
    ${1:// Modify fetch settings before request}
    return {
        ${2:// Return modified settings}
    };
};
```

### `cudpost` - Postflight Hook
```javascript
core.ud.postflight = (dataRef, dataObj, type) => {
    ${1:// Process data after fetch}
    return ${2:dataObj};
};
```

### `cudprepaint` - Prepaint Hook
```javascript
core.ud.prepaint = (dataRef, dataObj, type) => {
    ${1:// Before rendering template/clone}
    $0
};
```

### `cudpostpaint` - Postpaint Hook
```javascript
core.ud.postpaint = (dataRef, dataObj, type) => {
    ${1:// After rendering}
    $0
};
```

## Core.js API Calls

### `cbeget` - Get Data
```javascript
core.be.getData('${1:dataRef}', '${2:/api/endpoint}');
```

### `cbegetset` - Get Data with Settings
```javascript
core.be.getData('${1:dataRef}', '${2:/api/endpoint}', {
    method: '${3:GET}',
    ${4:// Additional settings}
});
```

### `cbetpl` - Get Template
```javascript
core.be.getTemplate('${1:templateName}', '${2:/templates/template.html}');
```

### `cbepost` - POST Data
```javascript
core.be.getData('${1:dataRef}', '${2:/api/endpoint}', {
    method: 'POST',
    data: {
        ${3:key}: ${4:value}
    }
});
```

### `cpkinit` - Initialize Pockets
```javascript
core.pk.init();
```

### `ccrset` - Set Data in Registry
```javascript
core.cr.setData('${1:dataRef}', ${2:dataObject});
```

### `ccrget` - Get Data from Registry
```javascript
const ${1:data} = core.cr.getData('${2:dataRef}');
```

### `ccrgettpl` - Get Template from Registry
```javascript
const ${1:template} = core.cr.getTemplate('${2:templateName}');
```

## Helper Functions

### `chfdig` - Dig Data (Deep Object Access)
```javascript
core.hf.digData(${1:object}, '${2:path.to.property}')
```

### `chfdate` - Date Formatting
```javascript
core.hf.date(${1:dateString}, '${2:m/d/Y}')
```

### `chfhydrate` - Hydrate by Class
```javascript
core.hf.hydrateByClass();
```

### `chfformat` - Format by Class
```javascript
core.hf.formatByClass();
```

### `chfparse` - Parse JSON
```javascript
const ${1:data} = core.hf.parseJSON('${2:jsonString}');
```

## Validation & Scrubbing

### `csvscrub` - Scrub Array
```javascript
const result = core.sv.scrub([
    { name: '${1:fieldName}', value: ${2:value}, req: ${3:true} }
]);
```

### `csvformat` - Format Value
```javascript
const ${1:formatted} = core.sv.format(${2:value}, '${3|date,money,upper,lower,title,nohtml|}');
```

## Anchor Tags (Silent Calls)

### `caget` - Anchor Get Data
```html
<a href="#" target="core_be_getData" 
   data-core-data="${1:dataRef}" 
   data-core-source="${2:/api/endpoint}">
    ${3:Load Data}
</a>
```

### `catpl` - Anchor Get Template
```html
<a href="#" target="core_be_getTemplate" 
   data-core-data="${1:templateName}" 
   data-core-source="${2:/templates/template.html}">
    ${3:Load Template}
</a>
```

### `capk` - Anchor Reinit Pockets
```html
<a href="#" target="core_pk_init">${1:Refresh}</a>
```

## Complete Examples

### `cexample` - Complete Pocket + Template Example
```html
<!-- Pocket -->
<div class="core-pocket" 
     data-core-templates="${1:users}" 
     data-core-source-${1:users}="${2:https://api.example.com/users}">
</div>

<!-- Template -->
<template name="${1:users}">
    <div class="${3:user-list}">
        <h2>{{data:${1:users}:${4:title}}}</h2>
        <div class="core-clone" data-core-data="${1:users}:${5:items}">
            <div class="${6:user-card}">
                <h3>{{rec:${7:name}}}</h3>
                <p>{{rec:${8:email}}}</p>
            </div>
        </div>
    </div>
</template>
```

### `cform` - Form with Validation
```html
<form id="${1:myForm}">
    <input type="text" name="${2:username}" required>
    <input type="email" name="${3:email}" required>
    <button type="submit">${4:Submit}</button>
</form>

<script>
document.getElementById('${1:myForm}').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const result = core.sv.scrub([
        { name: '${2:username}', value: formData.get('${2:username}'), req: true },
        { name: '${3:email}', value: formData.get('${3:email}'), req: true, email: true }
    ]);
    
    if (result.success) {
        await core.be.getData('${5:response}', '${6:/api/submit}', {
            method: 'POST',
            data: result.data
        });
    }
});
</script>
```

## Notes

- All snippets use tab stops (`$1`, `$2`, etc.) for cursor positioning
- `$0` indicates the final cursor position
- Placeholders like `${1:templateName}` provide default values
- Choice placeholders like `${1|option1,option2|}` provide dropdown selections
- Multi-cursor editing is supported for repeated placeholder values
