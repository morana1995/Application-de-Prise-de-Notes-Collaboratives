
import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface NoteEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ initialValue, onChange }) => {
  return (
    <div className="w-full">
      <Textarea
        className="min-h-[300px] text-base"
        placeholder="Contenu de votre note..."
        defaultValue={initialValue}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default NoteEditor;
