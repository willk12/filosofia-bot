

import ChatTerminal from "./ChatTerminal";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Suspense fallback={<div>Carregando...</div>}>
      <ChatTerminal />
    </Suspense>
    </div>
  );
}
