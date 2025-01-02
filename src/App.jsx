import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

import Home from "./pages/Home/Home";
import Landing from "./pages/landing/landing";
function App() {
  return (
    <div>
      <Home />
    </div>
  );
}

export default App;
