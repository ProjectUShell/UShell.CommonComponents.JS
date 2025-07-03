# React Coding & Project Structure Guidelines

## 1. Folder Structure (Atomic Design Pattern)

Organize your components by atomic design:

```
src/
  components/
    atoms/
      Button/
        Button.tsx
        Button.test.tsx
      Input/
    molecules/
      InputWithLabel/
    organisms/
      Table/
      Header/
    templates/
      DashboardTemplate/
    pages/
      DashboardPage/
      UserProfilePage/
  hooks/
  utils/
  contexts/
  services/
  assets/
  styles/
  App.tsx
  index.tsx
```

- **atoms/**: Smallest, reusable UI elements (Button, Input, Icon, etc.)
- **molecules/**: Groups of atoms (InputWithLabel, Card, etc.)
- **organisms/**: Complex UI sections (Header, Table, Form, etc.)
- **templates/**: Page layouts with placeholder content
- **pages/**: Complete screens/routes

## 2. File Naming

- **PascalCase** for component files and folders: `Button.tsx`, `UserProfilePage.tsx`
- **camelCase** for hooks and utility files: `useFetch.ts`, `formatDate.ts`
- Test files: `ComponentName.test.tsx`

## 3. Component Naming & Structure

- Use **PascalCase** for React components.
- Each component in its own folder if it has related files (tests, stories, etc.).
- Export the component as default.
- Keep components small and focused.

## 4. Styling

- **Prefer Tailwind CSS utility classes** for styling.
- If necessary, use the `style` prop for dynamic or inline styles.
- Avoid separate CSS/SCSS files unless absolutely required for complex cases.
- Do not use CSS Modules or BEM unless you have a specific need that Tailwind cannot address.

**Example (Tailwind):**

```tsx
<button className='bg-blue-500 text-white px-4 py-2 rounded'>Click</button>
```

**Example (Inline style):**

```tsx
<button style={{ backgroundColor: 'red' }}>Click</button>
```

## 5. Where to Place TSX Files

- **UI components**: `src/components/atoms/`, `molecules/`, `organisms/`, etc.
- **Pages**: `src/components/pages/`
- **Templates**: `src/components/templates/`
- **Hooks**: `src/hooks/`
- **Context Providers**: `src/contexts/`
- **Utilities**: `src/utils/`
- **API/Services**: `src/services/`

## 6. General Coding Guidelines

- Use **functional components** and **React hooks**.
- Use **TypeScript** for type safety.
- Keep business logic out of UI components (use hooks/services).
- Write **unit tests** for all components and utilities.
- Use **ESLint** and **Prettier** for code consistency.
- Use **absolute imports** (with a `jsconfig.json` or `tsconfig.json` paths).
- Keep files short (ideally <200 lines per file).
- Prefer composition over inheritance.

## 7. Atomic Structure Example

```
components/
  atoms/
    Button/
      Button.tsx
      Button.test.tsx
    Icon/
  molecules/
    SearchBar/
      SearchBar.tsx
      SearchBar.test.tsx
  organisms/
    Header/
    Table/
  templates/
    MainLayout/
  pages/
    HomePage/
    UserPage/
```

## 8. Component Size & Responsibility

- **Single Responsibility Principle:** Each component should do one thing well. If it grows too large or complex, split it into smaller components.
- **Component Size:** As a rule of thumb, keep components under 200 lines. If a component is getting bigger, consider breaking it up.
- **UI vs. Logic:** Keep UI components (“dumb”/presentational) separate from logic (“smart”/container) components. Move business logic to hooks or context.

## 9. Hooks Usage & Ordering

- **Order:** Always call hooks at the top level of your component, before any early returns or logic.
- **Custom Hooks:** Extract repeated logic into custom hooks (e.g., `useFetch`, `useForm`).
- **Avoid Side Effects in Render:** Only use hooks like `useEffect` for side effects, not inside render or event handlers.

**Recommended order inside a component:**

1. `useState`
2. `useReducer`
3. `useContext`
4. `useRef`
5. `useMemo`
6. `useCallback`
7. `useEffect`
8. Custom hooks (grouped with above as appropriate)

## 10. File & Folder Structure

- **One Component per File:** Each component (and custom hook) should be in its own file.
- **Related Files Together:** Keep component and tests together (e.g., `Button.tsx`, `Button.test.tsx`).

## 11. Naming Conventions

- **Components:** PascalCase (`MyComponent`)
- **Hooks:** camelCase, start with `use` (`useMyHook`)
- **Files/Folders:** Match component/hook name

## 12. Other Best Practices

- **Prop Drilling:** Avoid deep prop drilling; use context or state management if needed.
- **Type Safety:** Use TypeScript for all components and hooks.
- **Pure Components:** Make components pure where possible (no side effects, same output for same props).
- **Memoization:** Use `React.memo`, `useMemo`, and `useCallback` to optimize performance, but only when necessary.
- **Testing:** Write unit tests for components and hooks.
- **Accessibility:** Use semantic HTML and ARIA attributes.

## 13. References

- [Atomic Design by Brad Frost](https://bradfrost.com/blog/post/atomic-web-design/)
- [React Large Scale Folder Structure](https://reactjs.org/docs/faq-structure.html)
- [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react)
- [Atomic Design Pattern in React](https://medium.com/@janelle.wg/atomic-design-pattern-how-to-structure-your-react-application-2bb4d9ca5f97)
- [Kent C. Dodds: How to Write React Components](https://kentcdodds.com/blog/how-to-write-a-react-component)

---

## Summary Table

| Guideline        | Best Practice Example                                 |
| ---------------- | ----------------------------------------------------- |
| Component Size   | <200 lines, single responsibility                     |
| Hooks Order      | All hooks at top, before logic                        |
| File Structure   | One component/hook per file, keep related files close |
| Naming           | PascalCase for components, camelCase for hooks        |
| Logic Separation | Move logic to hooks/context, keep UI clean            |
| Testing          | Write tests for all logic and UI                      |
| Styling          | Prefer Tailwind CSS, use inline styles if needed      |

---

**In short:**  
Keep components small and focused, use hooks for logic, order hooks at the top, follow naming conventions, keep related files together, and prefer Tailwind CSS or inline styles for styling. This leads to readable, maintainable, and scalable
