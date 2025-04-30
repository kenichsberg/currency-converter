import Form from '@/app/form'

export default function Home() {
  return (
    <div className="flex items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-teal-800">
      <main className="flex row-start-2 items-center sm:items-start w-full">
        <div className="bg-white px-10 py-20 w-full rounded-3xl">
          <Form></Form>
        </div>
      </main>
    </div>
  )
}
