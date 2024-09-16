import { useEffect, useState } from 'react';
import { NoteItem } from '../types';
import { getAllUserNotes } from '../services/noteService';
import NoteItemComponent from './NoteItemComponent';
import { useAuth } from '../context/AuthProvider';

type NoteListComponentProps = {
  nameFilter: string;
  dateFilter: Date | null;
  archivedFilter: boolean;
  categoryFilter: number;
  sortOrder: string;
};

export default function NoteListComponent({
  nameFilter,
  dateFilter,
  archivedFilter,
  categoryFilter,
  sortOrder,
}: NoteListComponentProps) {
  const auth = useAuth();
  const userId = auth?.authState.id;
  const loggedIn = auth?.authState.loggedIn;

  const [noteItems, setNoteItems] = useState<NoteItem[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const allNotes = await getAllUserNotes(userId);
  
        // Filter notes according to the provided filters
        const filteredNotes = allNotes.filter((note: NoteItem) => {
          const nameMatches = nameFilter
            ? note.Title?.toLowerCase().includes(nameFilter.toLowerCase())
            : true;
          const dateMatches = dateFilter
            ? new Date(note.UpdatedAt || note.CreatedAt).toDateString() === dateFilter.toDateString()
            : true;
          const statusMatches = archivedFilter !== undefined ? note.Archived === archivedFilter : true;
          const categoryMatches = categoryFilter ? note.CategoryID === categoryFilter : true;
  
          return nameMatches && dateMatches && statusMatches && categoryMatches;
        });
  
        // Sort the notes according to sortOrder
        const sortedNotes = filteredNotes.sort((a: { UpdatedAt: any; CreatedAt: any; Title: any; }, b: { UpdatedAt: any; CreatedAt: any; Title: any; }) => {
          const dateA = new Date(a.UpdatedAt || a.CreatedAt).getTime();
          const dateB = new Date(b.UpdatedAt || b.CreatedAt).getTime();
  
          switch (sortOrder) {
            case 'date-asc':
              return dateA - dateB;
            case 'date-desc':
              return dateB - dateA;
            case 'title-asc':
              return (a.Title || '').localeCompare(b.Title || '');
            case 'title-desc':
              return (b.Title || '').localeCompare(a.Title || '');
            default:
              return 0;
          }
        });
  
        setNoteItems(sortedNotes);
      } catch (error) {
        console.error('Error fetching notes:', error);
        // Handle API call errors here if needed
      }
    };
  
    // Only fetch notes if the user is logged in
    if (loggedIn) {
      fetchNotes();
    } else {
      // Clear the note list if the user is not logged in
      setNoteItems([]);
    }
  }, [nameFilter, dateFilter, archivedFilter, categoryFilter, sortOrder, loggedIn, userId]);
  

  return (
    <div className='overflow-y-scroll max-h-[29rem]'>
      {noteItems.map((note, index) => (
        <NoteItemComponent
          key={note.ID}
          note={note}
          isLast={index === noteItems.length - 1} // Check if it is the last item
        />
      ))}
    </div>
  );
}
