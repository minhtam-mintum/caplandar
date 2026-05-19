## Naming Conventions

- Component props interfaces MUST be named using the pattern `I<ComponentName>Props`.
- The interface name must start with the prefix `I`, followed by the exact component name in PascalCase, followed by the suffix `Props`.
- Always use `interface` (not `type`) for component props.
- Place the interface definition directly above the component, in the same file (unless explicitly shared).

### Examples
- Component `Button` → `IButtonProps`
- Component `UserCard` → `IUserCardProps`
- Component `LoginForm` → `ILoginFormProps`

### Correct
\`\`\`tsx
interface IButtonProps {
  label: string;
  onClick: () => void;
}

const Button = ({ label, onClick }: IButtonProps) => { ... };
\`\`\`

### Incorrect
\`\`\`tsx
type ButtonProps = { ... };      // ❌ uses `type` and missing `I` prefix
interface ButtonPropsType { ... } // ❌ wrong pattern
interface IButton { ... }         // ❌ missing `Props` suffix
\`\`\`