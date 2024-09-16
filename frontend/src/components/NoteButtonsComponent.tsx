import React, { useState } from 'react'
import ToolTipComponent from './ToolTipComponent'
import { archiveNote, deleteNote } from '../services/noteService';
import { NoteItem } from '../types';
import ModalComponent from './ModalComponent';
import NoteFormComponent from './NoteFormComponent';
import RegisterComponent from './RegisterComponent';
import LoginComponent from './LoginComponent';
import { useAuth } from '../context/AuthProvider';

type NoteButtonsProps = {
    handleArchiveHover: () => void,
    handleArchiveLeave: () => void,
    handleDeleteHover: () => void,
    handleDeleteLeave: () => void,
    handleEditHover: () => void,
    handleEditLeave: () => void,
    note: NoteItem
}

export default function NoteButtonsComponent({ handleArchiveHover, handleArchiveLeave, handleDeleteHover, handleDeleteLeave, handleEditHover, handleEditLeave, note }: NoteButtonsProps) {
    const [open, setOpen] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const auth = useAuth();
    const isLogged = auth?.authState.loggedIn;

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
        const confirmed = window.confirm('Are you sure you want to ' + (note.Archived ? 'unarchive' : 'archive') + ' this item?');

        if (confirmed) {
            await archiveNote(note.ID);
            window.location.reload();
        } else {
            console.log('Canceled by user');
        }
    };

    return (
        <>
            <div className="flex items-center space-x-3 pl-5 pr-8">
                <ToolTipComponent tooltip='Archive'>
                    <button
                        className={`shadow-md rounded-full bg-slate-600 w-8 h-8 text-white font-black hover:bg-white hover:text-black transition duration-500 ease-in-out p-1 ${note.Archived ? 'opacity-100' : 'opacity-100'}`}
                        onMouseEnter={handleArchiveHover}
                        onMouseLeave={handleArchiveLeave}
                        onClick={handleArchive}
                        style={{ opacity: note.Archived ? 1 : 1 }}
                    >
                        {note.Archived ? (
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

                {!note.Archived && (
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
    )
}
