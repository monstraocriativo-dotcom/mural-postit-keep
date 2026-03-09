import { ClerkProvider, SignedIn, SignedOut, SignIn, UserButton } from '@clerk/clerk-react';
import Board from './components/Board';

// Importa a chave do .env que o usuário cadastrará manualmente depois.
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  if (!PUBLISHABLE_KEY) {
    return <div className="p-4 text-red-500 font-bold">Variável VITE_CLERK_PUBLISHABLE_KEY não encontrada no .env. Cadastre para continuar.</div>;
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <div className="w-screen h-screen">
        <header className="absolute top-4 right-4 z-[9999]">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </header>

        <SignedOut>
          <div className="flex w-full h-full items-center justify-center bg-gray-50">
            <SignIn />
          </div>
        </SignedOut>

        <SignedIn>
          <Board />
        </SignedIn>
      </div>
    </ClerkProvider>
  );
}

export default App;
