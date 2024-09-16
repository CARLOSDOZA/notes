import { useState, useRef, useEffect } from 'react';
import { NoteItem } from '../types';
import NoteButtonsComponent from './NoteButtonsComponent';

type NoteItemComponentProps = {
  note: NoteItem;
  isLast: boolean;
};

export default function NoteItemComponent({ note, isLast }: NoteItemComponentProps) {
  const borderBottomClass = isLast ? '' : 'border-b border-dashed';
  const [deleteHovered, setDeleteHovered] = useState(false);
  const [archiveHovered, setArchiveHovered] = useState(false);
  const [editHovered, setEditHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);
  

  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowing(contentRef.current.scrollHeight > contentRef.current.clientHeight);
    }
  }, [note.Content, expanded]);

  // Handle archive button hover state
  const handleArchiveHover = () => {
    setArchiveHovered(true);
  };

  const handleArchiveLeave = () => {
    setArchiveHovered(false);
  };

  // Handle delete button hover state
  const handleDeleteHover = () => {
    setDeleteHovered(true);
  };

  const handleDeleteLeave = () => {
    setDeleteHovered(false);
  };

  // Handle edit button hover state
  const handleEditHover = () => {
    setEditHovered(true);
  };

  const handleEditLeave = () => {
    setEditHovered(false);
  };

  const formattedDate = new Date(note.UpdatedAt || note.CreatedAt).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <>
      <div
        className={`flex content-between bg-slate-100 p-4 cursor-pointer ${borderBottomClass} ${deleteHovered
          ? 'hover:bg-red-400'
          : archiveHovered
            ? note.Archived
              ? 'hover:opacity-100'
              : 'opacity-50'
            : editHovered
              ? 'hover:bg-yellow-100'
              : 'hover:bg-teal-100'
          } text-black transition duration-500 ease-in-out ${note.Archived ? 'opacity-50 hover:bg-slate-50' : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className='w-full'>
          <h2
            className={`font-black text-xl text-teal-900 ${deleteHovered
              ? 'text-white'
              : archiveHovered
                ? note.Archived
                  ? 'text-teal-700'
                  : 'text-slate-400'
                : ''
              } transition duration-500 ease-in-out`}
          >
            {note.Title}
          </h2>
          <div className="relative">
            <p
              ref={contentRef}
              className={`${deleteHovered
                ? 'text-white'
                : archiveHovered
                  ? note.Archived
                    ? 'text-slate-800'
                    : 'text-slate-300'
                  : ''
                } transition duration-500 ease-in-out ${expanded ? 'max-h-full' : 'max-h-12 overflow-hidden'}`}
            >
              {note.Content}
            </p>
            {!expanded && isOverflowing && (
              <span
                className={`${deleteHovered
                  ? 'text-white'
                  : archiveHovered
                    ? note.Archived
                      ? 'text-slate-500'
                      : 'text-slate-300'
                    : 'text-slate-500'
                  } transition duration-500 ease-in-out font-bold`}
                onClick={() => setExpanded(true)}
              >
                See more...
              </span>
            )}
          </div>
          <p
            className={`${deleteHovered
              ? 'text-white'
              : archiveHovered
                ? note.Archived
                  ? 'text-slate-500'
                  : 'text-slate-300'
                : 'text-slate-500'
              } transition duration-500 ease-in-out`}
          >
            Last Updated: {formattedDate}
          </p>
        </div>
        <NoteButtonsComponent
        handleArchiveHover={handleArchiveHover}
        handleArchiveLeave={handleArchiveLeave}
        handleDeleteHover={handleDeleteHover}
        handleDeleteLeave={handleDeleteLeave}
        handleEditHover={handleEditHover}
        handleEditLeave={handleEditLeave}
        note={note}
        />
      </div>
    </>
  );
}
