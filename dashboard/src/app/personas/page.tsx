"use client"
import React, { useState } from 'react';

const PersonaPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const mockPersonas = [
    {
      persona_name: "Emma Richardson",
      persona_id: 101,
      description: "A public school teacher and mother of two who strongly believes in scientific consensus.",
      articles_read: [
        "Staying up to date with COVID-19 vaccinations is crucial for ongoing protection.",
        "COVID-19 vaccines help the body develop immunity without causing illness."
      ]
    },
    {
      persona_name: "Jason Miller",
      persona_id: 102,
      description: "A self-employed mechanic in rural Alberta who distrusted government mandates.",
      articles_read: [
        "Florida Beach Reopening Photo Totally Fake.",
        "COVID-19 Created with HIV Fragments in Wuhan Lab."
      ]
    },
    // Add other personas similarly...
  ];

  const filteredPersonas = mockPersonas.filter(persona =>
    persona.persona_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    persona.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Persona Characteristics</h1>
      <div className="mb-4">
        <a href="/" className="text-blue-500">Back to Dashboard</a>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Personas..."
          className="border rounded-lg p-2 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredPersonas.map((persona) => (
          <div key={persona.persona_id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold">{persona.persona_name}</h2>
            <p className="mt-2">{persona.description}</p>
            <h3 className="mt-4 font-bold">Articles Read:</h3>
            <ul className="list-disc list-inside">
              {persona.articles_read.map((article, index) => (
                <li key={index}>{article}</li>
              ))}
            </ul>
            <div className="mt-4">
              <a href={`/persona/${persona.persona_id}`} className="text-blue-500">View Full Persona</a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default PersonaPage; 