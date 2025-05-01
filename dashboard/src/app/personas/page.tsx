"use client"
import React, { useState } from 'react';
import personasData from '../../../data/personas.json'; // Importing the mocked data

const PersonaPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPersonas = personasData.filter(persona =>
    persona.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Reduced gap for tighter layout */}
        {filteredPersonas.map((persona) => (
          <div key={persona.persona_id} className="bg-white p-4 rounded-lg shadow-md max-w-xs mx-auto"> {/* Reduced width */}
            <img 
              src={persona.demographics.gender === "Female" ? "/images/female-avatar.png" : "/images/male-avatar.png"} 
              alt={`${persona.name}'s avatar`} 
              className="w-24 h-24 rounded-full mb-4"
            />
            <h2 className="text-xl font-semibold">{persona.name}</h2>
            <p className="mt-2 text-center">{persona.description}</p>
            <div className="mt-4 w-full">
              <h3 className="font-bold">Articles Read:</h3>
              <p className="text-gray-600">{persona.articles_read ? persona.articles_read.slice(0, 2).join(', ') : 'No articles available'}</p> {/* Truncated articles */}
            </div>
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