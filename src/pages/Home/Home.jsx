// filepath: /c:/Users/Administrator.LT-0004/Documents/practices/show/Pdf-to-Anki/Development/frontend/src/pages/Home/Home.jsx
import React from "react";
import Header from "../../components/Header/Header";
import Question from "../../components/Question/Question";
import { TextExtractedProvider } from "../../context/TextExtractedContext"; // Ensure this path is correct
import Landing from "../landing/landing";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
} from "@clerk/clerk-react";

function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <SignedIn>
        <SignOutButton />
        <TextExtractedProvider>
          <Header />
          <Question />
        </TextExtractedProvider>
      </SignedIn>
      <SignedOut>
        <Landing />
      </SignedOut>
    </div>
  );
}

export default Home;
