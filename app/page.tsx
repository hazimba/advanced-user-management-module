import ModeToggle from "@/components/mode-toggle";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-zinc-50 px-2 font-sans dark:bg-black">
      <main className="flex flex-col  justify-center max-w-7xl w-full px-6 shadow-xl pb-16 pt-8 text-center bg-white dark:bg-black rounded-lg">
        {/* <ModeToggle toggle /> */}
        <h1 className="text-2xl pt-8 md:text-4xl md:pr-24 align-left text-left font-semibold leading-tight tracking-tight text-black dark:text-zinc-50 mb-6">
          Frontend Developer Assessment — User Management Module
        </h1>

        <p className="max-w-2xl text-justify text-zinc-400 dark:text-zinc-400 mb-4">
          Build an advanced User Management Module with full CRUD functionality,
          optimistic updates, concurrent mutation handling, and undo
          capabilities using React, TypeScript, Tailwind CSS, Shadcn UI, and
          TanStack React Query.
        </p>

        <Link
          className="flex h-12 w-[180px] items-center justify-center gap-2 text-black hover:text-blue-600 dark:text-white transition-colors"
          href="/users"
          rel="noopener noreferrer"
        >
          Go User Page <ArrowRight />
        </Link>
      </main>
    </div>
  );
}
