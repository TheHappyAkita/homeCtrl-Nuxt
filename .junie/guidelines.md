# Common Coding Rules
## General Code Generation
1. Avoid generation of unused imports
2. Avoid generation of unused variables
3. Avoid generation of unused functions
4. When editing existing source code, do minimal possible changes until refactoring is requested / approved

## Unit Test Generation
1. When asked for unit tests generation, aim to generate tests for testing the functionality and not only the structure and signatures
2. When generating unit tests, the tests need to use the public points. Don't add additional exposes just for testing
3. When generating unit tests, don't mock any internal class, method, etc. which is included in the file which the tests target, rather use the available stuff and only mock external dependencies
4. When generating unit tests, and testing error paths, use the "assertThrows" functionality of the related test frameworks if possible
5. When generating unit tests, don't generate comments like "// Mock Example" if in code it's clearly visible that "Example" is mocked
6. Always test the real implementation and not something mocked
7. Do not add additional exposes just for testing

## Typescript
1. no implicit any, use type declarations wherever possible
2. use single-quotes for string literals
3. use const instead of let for constants

# Junie Code Generation Guidelines for AkitaCtrl

## Project Context
AkitaCtrl is a Progressive Web Application (PWA) built with Nuxt.js 4 and Vue.js 3 for home automation and network monitoring. Generate code that follows these established conventions and patterns.

## TypeScript Code Generation

### Function Conventions
- Always use explicit TypeScript typing for parameters and return values
- Include JSDoc comments for complex functions
- Use union types for optional parameters (e.g., `string | undefined`)
- Follow the existing pattern for utility functions in `app/utils/`

Example pattern from existing codebase:
```typescript
export function isOffline(data: (string | undefined)): boolean {
    if (!data) {
        return true;
    }
    // Implementation with clear conditional checks
    return false;
}
```

### Type Definitions
- Create interfaces for complex data structures
- Use PascalCase for interface names
- Define optional properties with `?` operator
- Place type definitions at the top of files or in separate `.d.ts` files

## Vue.js Component Generation

### Component Structure
- Use Single File Components (.vue) with three sections: `<template>`, `<script>`, `<style>`
- Always use `<script lang="ts" setup>` for new components
- Use Composition API exclusively
- Follow PascalCase naming convention (e.g., `OuterDevState.vue`, `AppServer.vue`)

### Component Template
```vue
<template>
  <div class="component-name">
    <!-- Component content -->
  </div>
</template>

<script lang="ts" setup>
// Props interface
interface Props {
  title: string;
  isActive?: boolean;
}

// Props with defaults
const props = withDefaults(defineProps<Props>(), {
  isActive: false
});

// Component logic here
</script>

<style scoped>
@import '@/assets/ComponentName.css';

.component-name {
  /* Component-specific styles */
}
</style>
```

### Component Naming Conventions
- Use descriptive, purpose-indicating names
- Prefix with `Outer` for layout/container components
- Prefix with `App` for application-level components
- Use `kebab-case` for CSS classes
- Match CSS file names to component names

## CSS Generation

### Styling Patterns
- Always use `<style scoped>` in components
- Import component-specific CSS files: `@import '@/assets/ComponentName.css';`
- Use CSS variables from `app/assets/variables.css`
- Follow mobile-first responsive design principles
- Use flexbox/grid for layouts

### CSS Class Naming
- Use `kebab-case` for all CSS classes
- Make class names descriptive and component-specific
- Avoid generic names like `.container` or `.wrapper`

## Network Detection Patterns

### Error Handling
When generating network-related code, use the established patterns from `app/utils/detectors.ts`:
- Always handle offline states using detection utilities
- Check for multiple error conditions (timeouts, connection refused, etc.)
- Provide graceful degradation for offline scenarios
- Include user feedback for network states

Example pattern:
```typescript
if (data.indexOf("No route to host") > -1
    || data.indexOf("Unreachable") > -1
    || data.indexOf("0 received") > -1
    || data.indexOf("100% packet loss") > -1
    || data.indexOf("Connection refused") > -1
    || data.indexOf("Connection timed out") > -1) {
    return true;
}
```

## File Organization

### Directory Structure
- Place utility functions in `app/utils/`
- Place components in `app/components/`
- Place component-specific styles in `app/assets/`
- Use descriptive file names that match their purpose

### Import Conventions
- Use relative imports within the same directory level
- Use `@/` alias for absolute imports from app root
- Import types and interfaces at the top of files
- Group imports: Vue/Nuxt imports first, then local imports

## PWA Considerations

When generating PWA-related code:
- Ensure components work in fullscreen/standalone mode
- Consider portrait orientation lock
- Handle offline scenarios gracefully
- Optimize for mobile-first experience
- Consider touch interactions and accessibility

## Code Quality Standards

### Best Practices
- Write self-documenting code with clear variable names
- Handle edge cases (null, undefined, empty strings)
- Use TypeScript's strict mode features
- Implement proper error boundaries
- Follow the single responsibility principle

### Performance
- Use lazy loading for large components
- Minimize bundle size with tree-shaking
- Optimize images and assets
- Consider component lifecycle and memory management

## Testing Patterns

When generating test code:
- Test component props and emits
- Mock network states using detector utilities
- Test edge cases and error conditions
- Ensure TypeScript types are correctly implemented
- Test offline/online scenarios

## Example Code Generation

### Utility Function
```typescript
/**
 * Checks if the server response indicates an error state
 * @param response - Server response data
 * @returns boolean indicating error state
 */
export function hasServerError(response: string | undefined): boolean {
    if (!response) {
        return true;
    }
    
    return response.indexOf("Error") > -1
        || response.indexOf("Failed") > -1
        || response.indexOf("Exception") > -1;
}
```

### Vue Component
```vue
<template>
  <div class="server-status">
    <h2>{{ title }}</h2>
    <div class="status-indicator" :class="{ 'offline': isOffline }">
      {{ statusText }}
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  title: string;
  serverData?: string;
}

const props = defineProps<Props>();

const isOffline = computed(() => {
  return isOffline(props.serverData);
});

const statusText = computed(() => {
  return isOffline.value ? 'Offline' : 'Online';
});
</script>

<style scoped>
@import '@/assets/ServerStatus.css';

.server-status {
  padding: 1rem;
  border-radius: 8px;
}

.status-indicator {
  padding: 0.5rem;
  border-radius: 4px;
  background-color: var(--success-color);
}

.status-indicator.offline {
  background-color: var(--error-color);
}
</style>
```

---

*These guidelines ensure generated code maintains consistency with the existing AkitaCtrl codebase and follows established patterns and conventions.*