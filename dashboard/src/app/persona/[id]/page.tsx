import React from "react"
import Link from "next/link"
import Image from "next/image"
import personasData from "../../../../data/personas.json"
import femaleImage from "../../../../public/female avatar.png"
import maleImage from "../../../../public/male avatar.png"

interface Params {
  params: { id: string }
}

export default function PersonaDetailPage({ params }: Params) {
  const personaId = parseInt(params.id, 10)
  const persona = personasData.find((p) => p.persona_id === personaId)

  if (!persona) {
    return (
      <main className="container mx-auto p-8">
        <p className="text-red-500">Persona not found.</p>
        <div className="mt-4">
          <Link href="/personas" className="text-blue-600 hover:underline">
            ← Back to Personas
          </Link>
        </div>
      </main>
    )
  }

  const avatarSrc =
    persona.demographics.gender === "Female" ? femaleImage : maleImage

  return (
    <main className="container mx-auto py-8 px-4 space-y-8">
      {/* NAV */}
      <nav className="flex space-x-4 mb-4">
        <Link
          href="/personas"
          className="px-3 py-1 rounded-md bg-blue-50 text-gray-800 hover:bg-blue-100 transition"
        >
          ← Personas
        </Link>
        <Link
          href="/"
          className="px-3 py-1 rounded-md bg-blue-50 text-gray-800 hover:bg-gray-100 transition"
        >
          Dashboard
        </Link>
      </nav>

      {/* HERO CARD */}
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center transform transition duration-200 hover:shadow-lg hover:scale-105">
        <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
          <Image
            src={avatarSrc}
            alt={`${persona.name} avatar`}
            fill
            className="object-cover"
            priority
          />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{persona.name}</h1>
        <p className="mt-2 text-gray-500 text-center max-w-prose">
          {persona.description}
        </p>
      </div>

      {/* Side-by-side cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Demographics */}
        <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200 transform transition duration-200 hover:shadow-lg hover:scale-105">
          <h2 className="text-xl font-semibold mb-4">Demographics</h2>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
            <dt className="text-gray-600">Age</dt>
            <dd className="text-gray-900">{persona.demographics.age}</dd>
            <dt className="text-gray-600">Gender</dt>
            <dd className="text-gray-900">{persona.demographics.gender}</dd>
            <dt className="text-gray-600">Location</dt>
            <dd className="text-gray-900">{persona.demographics.location}</dd>
            <dt className="text-gray-600">Occupation</dt>
            <dd className="text-gray-900">{persona.demographics.occupation}</dd>
            <dt className="text-gray-600">Education</dt>
            <dd className="text-gray-900">{persona.demographics.education}</dd>
          </dl>
        </section>

        {/* Beliefs & Concerns */}
        <div className="space-y-6">
          <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200 transform transition duration-200 hover:shadow-lg hover:scale-105">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Beliefs & Attitudes
            </h2>
            <p className="text-gray-900">
              <span className="font-medium">
                {persona.beliefs_and_attitudes.initial_stance}
              </span>
              : {persona.beliefs_and_attitudes.stance_description}
            </p>
            <p className="mt-2 text-gray-900">
              <span className="font-medium">Key Motivator</span>:{" "}
              {persona.beliefs_and_attitudes.key_motivator}
            </p>
          </section>
          <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200 transform transition duration-200 hover:shadow-lg hover:scale-105">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Concerns
            </h2>
            <ul className="list-disc list-inside space-y-1 text-gray-900">
              {persona.beliefs_and_attitudes.concerns.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* PERSONALITY (FULL WIDTH) */}
      <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200 transform transition duration-200 hover:shadow-lg hover:scale-105">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Personality
        </h2>
        <p className="text-gray-900">
          <span className="font-medium">{persona.personality.archetype}</span>:{" "}
          {persona.personality.notes}
        </p>
      </section>
    </main>
  )
}