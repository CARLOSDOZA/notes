import { Menu } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthProvider";
import { Auth } from "./services/authService";
import HeaderComponent from "./components/HeaderComponent";
import FilterComponent from "./components/FilterComponent";
import ModalComponent from "./components/ModalComponent";
import NoteFormComponent from "./components/NoteFormComponent";
import NoteListComponent from "./components/NoteListComponent";
import FooterComponent from "./components/FooterComponent";
import ToolTipComponent from "./components/ToolTipComponent";

type SortOrder = 'date-asc' | 'date-desc' | 'title-asc' | 'title-desc';

function App() {

  const auth = useAuth();
  const loggedIn = auth?.authState.loggedIn;
  const [open, setOpen] = useState(false);
  const [nameFilter, setJobNameFilter] = useState('');
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [categoryFilter, setCategoryFilter] = useState(0);
  const [archivedFilter, setArchivedFilter] = useState(false);
  const [, setShowNoteForm] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>('date-asc'); 
  const [authLoaded, setAuthLoaded] = useState(false);
  if (!auth) {
    return <div>Error: Contexto de autenticación no disponible</div>;
  }

  const { dispatch } = auth;

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const username = localStorage.getItem('username');
        const token = localStorage.getItem('token');
        const idString = localStorage.getItem("id");
        var id = 0;
        if (idString == null) {
          id = 0;
        } else {
          id = parseInt(idString, 10);
        }
        const isAdminResponse = await Auth(token);
        const isAdmin = isAdminResponse.isAdmin;
        if (username && token) {
          dispatch({ type: 'LOGIN_SUCCESS', payload: { username, id, token, isAdmin } });
        }
        setAuthLoaded(true);
      } catch (error) {
        console.error('Error al cargar datos de autenticación:', error);
        setAuthLoaded(true);
      }
    };

    loadAuthData();
  }, [dispatch]);

  const handleSortOrderChange = (order: SortOrder) => {
    setSortOrder(order);
  };
  if (!authLoaded) {
    return <div>Cargando autenticación...</div>;
  }
  return (
    <>
      <HeaderComponent />

      <main className="max-w-7xl mx-auto py-10 grid md:grid-cols-3">
        <div className="m-8  rounded-lg space-y-5 shadow-md bg-slate-100 h-min pb-14">
          <h2 className="font-black text-3xl text-teal-900 pl-5 pt-5">Filter</h2>
          <FilterComponent
            setJobNameFilter={setJobNameFilter}
            setDateFilter={setDateFilter}
            setArchivedFilter={setArchivedFilter}
            setCategoryFilter={setCategoryFilter}
          />
        </div>
        <div className="m-8 rounded-lg space-y-5 shadow-md md:col-span-2 bg-slate-100 h-min pb-2">
          <div className=" flex justify-between">
            <h2 className="font-black text-3xl text-teal-900 pl-5 pt-5">Notes</h2>
            {loggedIn ? (
              <>
                <div className="pr-5">

                  <Menu as="div" className="relative inline-block text-left mt-6 mr-6 rounded">
                    <ToolTipComponent tooltip="Order by">
                      <Menu.Button className="w-8 h-8 text-slate-800 font-black hover:text-slate-400 transition duration-500 ease-in-out">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-7">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                        </svg>
                      </Menu.Button>
                      <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-none shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                        <div>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`${active ? 'bg-gray-400 text-white' : 'text-gray-900'} group flex rounded-none items-center w-full px-2 py-2 text-sm`}
                                onClick={() => handleSortOrderChange('date-asc')}
                              >
                                Fecha Ascendente
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`${active ? 'bg-gray-400 text-white' : 'text-gray-900'} group flex rounded-none items-center w-full px-2 py-2 text-sm`}
                                onClick={() => handleSortOrderChange('date-desc')}
                              >
                                Fecha Descendente
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`${active ? 'bg-gray-400 text-white' : 'text-gray-900'} group flex rounded-none items-center w-full px-2 py-2 text-sm`}
                                onClick={() => handleSortOrderChange('title-asc')}
                              >
                                Título A-Z
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`${active ? 'bg-gray-400 text-white' : 'text-gray-900'} group flex rounded-none items-center w-full px-2 py-2 text-sm`}
                                onClick={() => handleSortOrderChange('title-desc')}
                              >
                                Título Z-A
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </ToolTipComponent>
                  </Menu>

                  <ToolTipComponent tooltip="Add">
                    <button
                      className="font- mt-6 mr-6 shadow-md rounded-full bg-teal-500 w-8 h-8 text-white font-black hover:bg-white hover:text-black transition duration-500 ease-in-out"
                      onClick={() => setOpen(true)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>
                  </ToolTipComponent>

                </div>

                <ModalComponent open={open} onClose={() => {
                  setOpen(false);
                  setShowNoteForm(false);
                }}>
                  <NoteFormComponent isUpdate={false} />
                </ModalComponent>
              </>
            ) : (
              <div className="font-black text-xl text-slate-300 pr-5 pt-7">
                <h2>
                  Log in to manage your notes
                </h2>
              </div>
            )}
          </div>
          <NoteListComponent
            nameFilter={nameFilter}
            dateFilter={dateFilter}
            archivedFilter={archivedFilter}
            categoryFilter={categoryFilter}
            sortOrder={sortOrder}
          />
        </div>
      </main>
      <FooterComponent />
    </>
  )
}

export default App;
