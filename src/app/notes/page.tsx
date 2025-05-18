"use client";

import React, { useState } from "react";
import { EllipsisVerticalIcon, PencilIcon, ShareIcon, TrashIcon, XMarkIcon   } 
from '@heroicons/react/24/outline'


const categories = [
  { name: "Personal", count: 12, color: "violet" },
  { name: "Work", count: 8, color: "orange" },
  { name: "Projects", count: 5, color: "blue" },
  { name: "Ideas", count: 3, color: "green" },
];

type Note = {
  id: number;
  title: string;
  category: string;
  content: string;
  updatedAt: string;
  favorite: boolean;
  shared: boolean;
  public: boolean;
  collaborators: string[];
};

const initialNotes: Note[] = [
  {
    id: 1,
    title: "Welcome to NoteSphere!",
    category: "Personal",
    content:
      "This is a collaborative note-taking app where you can create, organize, and share your notes with others.",
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
    content:
      "- Team status updates\n- Project timeline review\n- Budget adjustments\n- Next steps and action items",
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
    content:
      "1. Mobile app for plant care\n2. Recipe organizer with AI suggestions\n3. Budget tracker with visualizations",
    updatedAt: "12 days ago",
    favorite: false,
    shared: false,
    public: true,
    collaborators: [],
  },
];

export default function AllNotesPage() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Form state for new note
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState(categories[0].name);
  const [newContent, setNewContent] = useState("");
  const [newIsPublic, setNewIsPublic] = useState(false);

  // Add new note handler
  function handleAddNote() {
    if (!newTitle.trim() || !newContent.trim()) {
      alert("Please fill in title and content");
      return;
    }
    const newNote: Note = {
      id: Date.now(),
      title: newTitle,
      category: newCategory,
      content: newContent,
      updatedAt: "Just now",
      favorite: false,
      shared: false,
      public: newIsPublic,
      collaborators: [],
    };
    setNotes([newNote, ...notes]);
    // Reset form
    setNewTitle("");
    setNewCategory(categories[0].name);
    setNewContent("");
    setNewIsPublic(false);
    setModalOpen(false);
  }

  // Delete note handler
  function handleDelete(id: number) {
    setNotes(notes.filter((note) => note.id !== id));
    setMenuOpenId(null);
  }

  return (
    <>
      <div className="flex h-screen bg-white">
        {/* Sidebar */}
        <aside className="w-64 bg-violet-50 p-6 flex flex-col justify-between border-r">
          <div>
            <div className="flex items-center mb-8">
              <span className="text-violet-600 text-2xl font-bold">
                NoteNexus
              </span>
            </div>
            <button
              className="w-full bg-violet-400 hover:bg-violet-500 text-white rounded-lg py-2 font-semibold mb-6 transition"
              onClick={() => setModalOpen(true)}
            >
              + New Note
            </button>
            <nav className="flex flex-col gap-2 mb-8">
              <a
                className="flex items-center gap-2 text-violet-700 font-medium bg-violet-100 rounded px-3 py-2"
                href="#"
              >
                All Notes
              </a>
              <a
                className="flex items-center gap-2 text-gray-600 rounded px-3 py-2 hover:bg-violet-100"
                href="#"
              >
                Favorites
              </a>
              <a
                className="flex items-center gap-2 text-gray-600 rounded px-3 py-2 hover:bg-violet-100"
                href="#"
              >
                Shared with me
              </a>
            </nav>
            <div>
              <h4 className="text-gray-500 uppercase text-xs mb-2">
                Categories
              </h4>
              <ul>
                {categories.map((cat) => (
                  <li key={cat.name} className="flex items-center mb-1">
                    <span
                      className={`w-2 h-2 rounded-full mr-2 bg-${cat.color}-400`}
                    />
                    <span className="text-gray-700">
                      {cat.name} ({cat.count})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-6">
            <span className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-violet-700 font-bold">
              DU
            </span>
            <div>
              <div className="text-xs font-semibold text-gray-700">
                Demo User
              </div>
              <div className="text-xs text-gray-400">demo@example.com</div>
            </div>
            <button className="ml-auto text-gray-400 hover:text-violet-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7"
                />
              </svg>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <header className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
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
                  <span
                    className={`w-2 h-2 rounded-full ${
                      note.category === "Personal"
                        ? "bg-violet-400"
                        : note.category === "Work"
                        ? "bg-orange-400"
                        : note.category === "Projects"
                        ? "bg-blue-400"
                        : "bg-green-400"
                    }`}
                  />
                  <span className="text-xs text-gray-500">{note.category}</span>
                  <span className="ml-2">
                    {note.public ? (
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 4a8 8 0 100 16 8 8 0 000-16z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17a5 5 0 005-5V9a5 5 0 00-10 0v3a5 5 0 005 5z" />
                      </svg>
                    )}
                  </span>
                  {note.favorite && (
                    <svg
                      className="ml-auto w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.967c.3.921-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.176 0l-3.388 2.46c-.784.57-1.838-.197-1.539-1.118l1.287-3.967a1 1 0 00-.364-1.118l-3.388-2.46c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" />
                    </svg>
                  )}
                </div>
                <h2 className="font-semibold text-lg mb-1">{note.title}</h2>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {note.content}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs text-gray-400">{note.updatedAt}</span>
                  <div className="flex -space-x-2">
                    {note.collaborators.map((initials) => (
                      <span key={initials} className="bg-violet-200 text-violet-700 text-xs rounded-full px-2 py-1"
                      >
                        {initials}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions menu */}
                <div className="absolute bottom-4 right-4">
                  <button
                    className="p-1 rounded-full hover:bg-violet-100"
                    onClick={() =>
                      setMenuOpenId(menuOpenId === note.id ? null : note.id)
                    }
                    aria-label="Open actions menu"
                  >
                    <EllipsisVerticalIcon  className="w-6 h-6 text-gray-400" />
                  </button>
                  {menuOpenId === note.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
                      <button
                        className="flex items-center w-full px-4 py-2 hover:bg-violet-50 text-violet-600"
                        onClick={() => {
                          alert(`Edit note ${note.title}`);
                          setMenuOpenId(null);
                        }}
                      >
                        <PencilIcon className="w-5 h-5 mr-2" />
                      </button>
                      <button
                        className="flex items-center w-full px-4 py-2 hover:bg-violet-50 text-blue-600"
                        onClick={() => {
                          alert(`Share note ${note.title}`);
                          setMenuOpenId(null);
                        }}
                      >
                        <ShareIcon className="w-5 h-5 mr-2" />
                      </button>
                      <button
                        className="flex items-center w-full px-4 py-2 hover:bg-violet-50 text-red-600"
                        onClick={() => handleDelete(note.id)}
                      >
                        <TrashIcon className="w-5 h-5 mr-2" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </section>
        </main>
      </div>

      {/* New Note Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-lg relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-violet-700"
              onClick={() => setModalOpen(false)}
              aria-label="Close modal"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-violet-700 mb-4">New Note</h2>
            <input
              type="text"
              placeholder="Note Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-3"
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-3"
            >
              {categories.map((cat) => (
                <option key={cat.name}>{cat.name}</option>
              ))}
            </select>
            <textarea
              placeholder="Start typing your note here..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-3 min-h-[120px]"
            />
            <div className="flex items-center mb-4 gap-3">
              <label className="flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={newIsPublic}
                  onChange={() => setNewIsPublic(!newIsPublic)}
                  className="hidden"
                />
                <div
                  className={`w-11 h-6 rounded-full ${
                    newIsPublic ? "bg-violet-600" : "bg-gray-300"
                  } relative transition-colors`}
                >
                  <span
                    className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                      newIsPublic ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
                <span className="ml-3 text-gray-700">
                  {newIsPublic ? "Public" : "Private"}
                </span>
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-violet-500 text-white px-4 py-2 rounded-lg"
                onClick={handleAddNote}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}




















