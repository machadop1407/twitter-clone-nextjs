import MainLayout from "@/components/main-layout";

export default function Loading() {
  return (
    <MainLayout>
      <main className="flex-1 overflow-y-auto min-h-screen flex items-center justify-center">
        <div className="max-w-2xl mx-auto flex items-center justify-center h-full">
          <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </main>
    </MainLayout>
  );
}
