@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Oswald:wght@500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 7%;
    --foreground: 0 0% 95%;

    --card: 0 0% 10%;
    --card-foreground: 0 0% 95%;

    --popover: 0 0% 12%;
    --popover-foreground: 0 0% 95%;

    --primary: 0 100% 27%;
    --primary-foreground: 0 0% 100%;

    --secondary: 25 100% 50%;
    --secondary-foreground: 0 0% 100%;

    --muted: 0 0% 16%;
    --muted-foreground: 0 0% 60%;

    --accent: 25 100% 50%;
    --accent-foreground: 0 0% 100%;

    --destructive: 0 84% 50%;
    --destructive-foreground: 0 0% 100%;

    --border: 0 0% 20%;
    --input: 0 0% 18%;
    --ring: 25 100% 50%;

    --radius: 0.5rem;

    --sidebar-background: 0 0% 8%;
    --sidebar-foreground: 0 0% 85%;
    --sidebar-primary: 0 100% 27%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 0 0% 14%;
    --sidebar-accent-foreground: 0 0% 95%;
    --sidebar-border: 0 0% 16%;
    --sidebar-ring: 25 100% 50%;

    --status-ok: 142 71% 45%;
    --status-warning: 45 93% 47%;
    --status-critical: 0 84% 50%;

    --font-display: 'Oswald', sans-serif;
    --font-body: 'Inter', sans-serif;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-family: var(--font-body);
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display);
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }
}

@layer components {
  .status-ok {
    background-color: hsl(var(--status-ok));
    color: white;
  }
  .status-warning {
    background-color: hsl(var(--status-warning));
    color: black;
  }
  .status-critical {
    background-color: hsl(var(--status-critical));
    color: white;
  }
  .status-ok-text {
    color: hsl(var(--status-ok));
  }
  .status-warning-text {
    color: hsl(var(--status-warning));
  }
  .status-critical-text {
    color: hsl(var(--status-critical));
  }
  .fire-gradient {
    background: linear-gradient(135deg, hsl(0 100% 27%), hsl(25 100% 50%));
  }
  .fire-glow {
    box-shadow: 0 0 20px hsl(25 100% 50% / 0.3);
  }
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: hsl(0 0% 10%);
}
::-webkit-scrollbar-thumb {
  background: hsl(0 0% 25%);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: hsl(0 0% 35%);
}
