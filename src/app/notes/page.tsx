// src/app/notes/page.tsx
import React from "react";

const categories = [
  { name: "Personal", count: 12, color: "violet" },
  { name: "Work", count: 8, color: "orange" },
  { name: "Projects", count: 5, color: "blue" },
  { name: "Ideas", count: 3, color: "green" },
];

const notes = [
  {
    id: 1,
    title: "Welcome to NoteSphere!",
    category: "Personal",
    content: "This is a collaborative note-taking app...",
    updatedAt: "11 days ago",
    favorite: true,
    shared: false,
    public: false,
    collaborators: [],
  },
  {
    id: 2,
    title: "Meeting Notes - April 2025",
    category: "Work",
    content: "- Team status updates\n- Project timeline review...",
    updatedAt: "12 days ago",
    favorite: true,
    shared: true,
    public: false,
    collaborators: ["AB", "CD"],
  },
  {
    id: 3,
    title: "Project Ideas",
    category: "Ideas",
    content: "1. Mobile app for plant care\n2. Recipe organizer...",
    updatedAt: "12 days ago",
    favorite: false,
    shared: false,
    public: true,
    collaborators: [],
  },
];

export default function AllNotesPage() {
  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-64 bg-violet-50 p-6 flex flex-col">
        <div className="flex items-center mb-8">
          <span className="text-violet-600 text-2xl font-bold">NoteNexus</span>
        </div>
        <button className="bg-violet-400 hover:bg-violet-500 text-white rounded-lg py-2 font-semibold mb-6">
          + New Note
        </button>
        <nav className="flex flex-col gap-2 mb-8">
          <a className="text-violet-700 font-medium" href="#">All Notes</a>
          <a className="text-gray-600" href="#">Favorites</a>
          <a className="text-gray-600" href="#">Shared with me</a>
        </nav>
        <div>
          <h4 className="text-gray-500 uppercase text-xs mb-2">Categories</h4>
          <ul>
            {categories.map((cat) => (
              <li key={cat.name} className="flex items-center mb-1">
                <span className={`w-2 h-2 rounded-full mr-2 bg-${cat.color}-400`} />
                <span className="text-gray-700">{cat.name} ({cat.count})</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-violet-700">My Notes</h1>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search notes..."
              className="border rounded-lg px-3 py-2"
            />
            <select className="border rounded-lg px-2 py-2">
              <option>All Categories</option>
              {categories.map((cat) => (
                <option key={cat.name}>{cat.name}</option>
              ))}
            </select>
            <select className="border rounded-lg px-2 py-2">
              <option>Newest First</option>
              <option>Oldest First</option>
            </select>
          </div>
        </header>

        {/* Notes Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-white border rounded-xl shadow p-5 flex flex-col relative"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full bg-violet-400`} />
                <span className="text-xs text-gray-500">{note.category}</span>
                {note.public && (
                  <span className="ml-2 text-green-500 text-xs">Public</span>
                )}
                {!note.public && (
                  <span className="ml-2 text-gray-400 text-xs">Private</span>
                )}
                {note.favorite && (
                  <span className="ml-auto text-yellow-400">★</span>
                )}
              </div>
              <h2 className="font-semibold text-lg mb-1">{note.title}</h2>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{note.content}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs text-gray-400">{note.updatedAt}</span>
                <div className="flex -space-x-2">
                  {note.collaborators.map((initials) => (
                    <span
                      key={initials}
                      className="bg-violet-200 text-violet-700 text-xs rounded-full px-2 py-1"
                    >
                      {initials}
                    </span>
                  ))}
                </div>
              </div>
              {/* Actions */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="text-violet-500 hover:underline text-xs">Edit</button>
                <button className="text-blue-500 hover:underline text-xs">Share</button>
                <button className="text-red-400 hover:underline text-xs">Delete</button>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
