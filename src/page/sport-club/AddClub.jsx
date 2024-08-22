import React from "react";
import QuillComponent from "../../components/quillJs/QuillComponent";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function AddClub() {
  return (
    <>
      <section className="w-11/12 mx-auto">
        <QuillComponent />
      </section>
    </>
  );
}
