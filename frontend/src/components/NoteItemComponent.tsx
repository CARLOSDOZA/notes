import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { NoteItem } from '../types';
import ModalComponent from './ModalComponent';
import NoteFormComponent from './NoteFormComponent';
import LoginComponent from './LoginComponent';
import RegisterComponent from './RegisterComponent';
import { archiveNote, deleteNote } from '../services/noteService';
import ToolTipComponent from './ToolTipComponent';

type NoteItemComponentProps = {
  note: NoteItem;
  isLast: boolean;
};

export default function NoteItemComponent({ note, isLast }: NoteItemComponentProps) {
  const borderBottomClass = isLast ? '' : 'border-b border-dashed';
  const [deleteHovered, setDeleteHovered] = useState(false);
  const [archiveHovered, setArchiveHovered] = useState(false);
  const [editHovered, setEditHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const auth = useAuth();
  const isLogged = auth?.authState.loggedIn;

  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowing(contentRef.current.scrollHeight > contentRef.current.clientHeight);
    }
  }, [note.content, expanded]);

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

  // Handle delete action
  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const confirmed = window.confirm('Are you sure you want to delete this item?');

    if (confirmed) {
      await deleteNote(note.ID);
      window.location.reload();
    } else {
      console.log('Canceled by user');
    }
  };

  // Handle archive action
  const handleArchive = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const confirmed = window.confirm('Are you sure you want to ' + (note.archived ? 'unarchive' : 'archive') + ' this item?');

    if (confirmed) {
      await archiveNote(note.ID);
      window.location.reload();
    } else {
      console.log('Canceled by user');
    }
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
            ? note.archived
              ? 'hover:opacity-100'
              : 'opacity-50'
            : editHovered
              ? 'hover:bg-yellow-100'
              : 'hover:bg-teal-100'
          } text-black transition duration-500 ease-in-out ${note.archived ? 'opacity-50 hover:bg-slate-50' : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className='w-full'>
          <h2
            className={`font-black text-xl text-teal-900 ${deleteHovered
              ? 'text-white'
              : archiveHovered
                ? note.archived
                  ? 'text-teal-700'
                  : 'text-slate-400'
                : ''
              } transition duration-500 ease-in-out`}
          >
            {note.title}
          </h2>
          <div className="relative">
            <p
              ref={contentRef}
              className={`${deleteHovered
                ? 'text-white'
                : archiveHovered
                  ? note.archived
                    ? 'text-slate-800'
                    : 'text-slate-300'
                  : ''
                } transition duration-500 ease-in-out ${expanded ? 'max-h-full' : 'max-h-12 overflow-hidden'}`}
            >
              {note.content}
            </p>
            {!expanded && isOverflowing && (
              <span
                className={`${deleteHovered
                  ? 'text-white'
                  : archiveHovered
                    ? note.archived
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
                ? note.archived
                  ? 'text-slate-500'
                  : 'text-slate-300'
                : 'text-slate-500'
              } transition duration-500 ease-in-out`}
          >
            Last Updated: {formattedDate}
          </p>
        </div>
        <div className="flex items-center space-x-3 pl-5 pr-8">
          <ToolTipComponent tooltip='Archive'>
            <button
              className={`shadow-md rounded-full bg-slate-600 w-8 h-8 text-white font-black hover:bg-white hover:text-black transition duration-500 ease-in-out p-1 ${note.archived ? 'opacity-100' : 'opacity-100'}`}
              onMouseEnter={handleArchiveHover}
              onMouseLeave={handleArchiveLeave}
              onClick={handleArchive}
              style={{ opacity: note.archived ? 1 : 1 }}
            >
              {note.archived ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                  />
                </svg>
              )}
            </button>
          </ToolTipComponent>

          {!note.archived && (
            <>
              <ToolTipComponent tooltip='Edit'>
                <button
                  className="shadow-md rounded-full bg-yellow-500 w-8 h-8 text-white font-black hover:bg-white hover:text-black transition duration-500 ease-in-out p-1"
                  onMouseEnter={handleEditHover}
                  onMouseLeave={handleEditLeave}
                  onClick={() => setOpen(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                    />
                  </svg>
                </button>
              </ToolTipComponent>
              <ToolTipComponent tooltip='Delete'>
                <button
                  className="shadow-md rounded-full bg-red-600 w-8 h-8 text-white font-black hover:bg-white hover:text-black transition duration-500 ease-in-out"
                  onMouseEnter={handleDeleteHover}
                  onMouseLeave={handleDeleteLeave}
                  onClick={handleDelete}
                >
                  X
                </button>
              </ToolTipComponent>
            </>
          )}
        </div>
      </div>
      <ModalComponent
        open={open}
        onClose={() => {
          setOpen(false);
          setShowRegister(false);
        }}>
        {isLogged ? (
          <NoteFormComponent isUpdate={true} note={note} />
        ) : showRegister ? (
          <RegisterComponent setShowRegister={setShowRegister} />
        ) : (
          <LoginComponent setShowRegister={setShowRegister} />
        )}
      </ModalComponent>
    </>
  );
}
