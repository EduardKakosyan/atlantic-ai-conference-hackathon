import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import personasData from "@/lib/data/personas.json"

export default function AboutCard({
  id
 }: {
    id: string 
 }) {

  const personaId = parseInt(id, 10)
  const persona = personasData.find(p => p.persona_id === personaId)

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Conversation Comparison</CardTitle>
          <CardDescription>A conversation comparison tool for the AI profile of {`${persona?.name}`}</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground/90 leading-normal prose"> 
          <p className="mb-3">Compare the before and after exposing to news about COVID-19 vaccines of the AI profile of {`${persona?.name}`}</p>
          
        </CardContent>
      </Card>
    </div>
  )
}