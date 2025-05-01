import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import personasData from '../../../../data/personas.json'

interface Params {
  params: { id: string }
}

export default function PersonaDetailPage({ params }: Params) {
  const personaId = parseInt(params.id, 10)
  const persona = personasData.find(p => p.persona_id === personaId)

  if (!persona) {
    return (
      <main className="container mx-auto p-8">
        <p className="text-red-500">Persona not found.</p>
        <Link href="/personas" className="text-blue-500 hover:underline">
          ← Back to Personas
        </Link>
      </main>
    )
  }

  // pick the right avatar from /public/images
  const avatarSrc =
    persona.demographics.gender.toLowerCase() === "female"
      ? "/images/female-avatar.png"
      : "/images/male-avatar.png"

  return (
    <main className="container mx-auto py-8 px-4 space-y-8">
      <Link href="/personas" className="text-blue-500 hover:underline">
        ← Back to Personas
      </Link>

      {/* Hero Card */}
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
        <Image
          src={avatarSrc}
          alt={`${persona.name} avatar`}
          width={128}
          height={128}
          className="rounded-full mb-4 object-cover"
        />
        <h1 className="text-2xl font-bold">{persona.name}</h1>
        <p className="text-gray-500 text-center">{persona.description}</p>
      </div>

      {/* grouped cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Demographics */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Demographics</h2>
          <dl className="space-y-2">
            <div>
              <dt className="font-medium">Age</dt>
              <dd>{persona.demographics.age}</dd>
            </div>
            <div>
              <dt className="font-medium">Gender</dt>
              <dd>{persona.demographics.gender}</dd>
            </div>
            <div>
              <dt className="font-medium">Location</dt>
              <dd>{persona.demographics.location}</dd>
            </div>
            <div>
              <dt className="font-medium">Occupation</dt>
              <dd>{persona.demographics.occupation}</dd>
            </div>
            <div>
              <dt className="font-medium">Education</dt>
              <dd>{persona.demographics.education}</dd>
            </div>
          </dl>
        </section>

        {/* Beliefs & Attitudes */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Beliefs & Attitudes
          </h2>
          <p>
            <span className="font-medium">
              {persona.beliefs_and_attitudes.initial_stance}
            </span>
            {": "}
            {persona.beliefs_and_attitudes.stance_description}
          </p>
          <p className="mt-2">
            <span className="font-medium">Key Motivator:</span>{" "}
            {persona.beliefs_and_attitudes.key_motivator}
          </p>
        </section>

        {/* Concerns */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Concerns</h2>
          <ul className="list-disc list-inside space-y-1">
            {persona.beliefs_and_attitudes.concerns.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </section>

        {/* Personality */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Personality</h2>
          <p>
            <span className="font-medium">
              {persona.personality.archetype}
            </span>
            {": "}
            {persona.personality.notes}
          </p>
        </section>

        
      </div>
    </main>
  )
} 