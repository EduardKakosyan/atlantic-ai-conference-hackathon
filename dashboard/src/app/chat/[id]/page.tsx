import Chat from "@/components/chat";
import personasData from "../../../../data/personas.json"

export default async function Home({
    params,
  }: {
    params: Promise<{ id: string }>
  }){
    const { id } = await params
    const personaId = parseInt(id, 10)
  const persona = personasData.find(p => p.persona_id === personaId)
  return (
    <div className="relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden pb-10 flex-col">
      <Chat id={id}/>
    </div>
  );
}