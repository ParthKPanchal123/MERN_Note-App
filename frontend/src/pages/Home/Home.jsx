import React, { useEffect, useState } from 'react';
import NoteCard from '../../components/Card/NoteCard';
import { MdAdd } from 'react-icons/md';
import Modal from 'react-modal';
import AddEdit from '../Home/AddEdit'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import Empty from '../../components/emptycrd/Empty';


Modal.setAppElement('#root');

function Home() {

  const {currentUser} = useSelector(state => state.user)

  const [userInfo, setUserInfo] = useState(null)
  const [allNotes, setAllNotes] = useState([])

  

  const navigate = useNavigate()

  const [openEditModal, setOpenEditModal] = useState({
    isShown: false,
    type: 'add',
    data: null,
  });

  useEffect(()=>{
    if(currentUser === null || !currentUser){
      navigate('/login')
    }else{
      setUserInfo(currentUser?.rest)
      getAllNotes()
    }
  }, [currentUser, navigate])

  // Get All Notes Api Methods

  const getAllNotes = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/note/all", { withCredentials: true })

      if (res.data.success === false) {
        console.log(res.data);
        return
      }

      setAllNotes(res.data.notes)

    } catch (error) {
      console.log(error);
    }
  }

  const handleEdit = (noteDetails) => {
    setOpenEditModal({ isShown: true, type: 'edit', data: noteDetails })
  }

  // Delete a note Api

  const deleteNote = async (data) => {
    const noteId = data._id
    
    try {
      const res = await axios.delete("http://localhost:3001/api/note/delete/" + noteId, { withCredentials: true })

      if (res.data.success === false) {
        toast.error(res.data.message)
        return
      }

      toast.success(res.data.message)
      getAllNotes()
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Search Api for notes
  const onSearch = async (query) => {
    try {
      const res = await axios.get("http://localhost:3001/api/note/search/", {params: {query}, withCredentials: true })

      if (res.data.success === false) {
        toast.error(res.data.message)
        return
      }
      
      setAllNotes(res.data.notes)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleClearSearch = () => {
    getAllNotes()
  }

  const updatePinned = async (noteData) => {
    const noteId = noteData._id

    try {
      const res = await axios.put("http://localhost:3001/api/note/update-note-pinned/" + noteId, { isPinned: !noteData.isPinned }, { withCredentials: true })

      if (res.data.success === false) {
        toast.error(res.data.message)
        return
      }

      toast.success(res.data.message)
      getAllNotes()
    } catch (error) {
      toast.error(error.message)
      console.log(error.message);
      
    }
  }
  

    return (
    <>
    <Navbar userInfo={userInfo} onSearch={onSearch} handleClearSearch={handleClearSearch}/>
      <div className="container mx-auto">
       {allNotes?.length > 0 ? ( <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 max-md:m-5">
          {allNotes?.map((note, index) => (
            <NoteCard
              key={note._id}
              title={note.title}
              date={note.date}
              content={note.content}
              tags={note.tags}
              isPinned={note.isPinned}
              onPinNote={() => {updatePinned(note)}}
              onEdit={() => {handleEdit(note)}}
              onDelete={() => {deleteNote(note)}}
            />
          ))}
        </div>
        ) : (
          <Empty imgSrc={"https://img.freepik.com/free-vector/blank-paper-note-template_1308-26554.jpg"} message="No notes found. create a new note" />
         )}
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-[#000000] hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => setOpenEditModal({ isShown: true, type: 'add', data: null })}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openEditModal.isShown}
        onRequestClose={() => setOpenEditModal({ ...openEditModal, isShown: false })}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.2)',
          },
        }}
        contentLabel=""
        className="w-[40%] max-md:w-[60%] max-sm:w-[70%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
        >
          <AddEdit 
          onClose={() =>
            setOpenEditModal({ isShown: false, type: "add", data: null })
          } 
          noteData={openEditModal.data}
          type={openEditModal.type}
          getAllNotes={getAllNotes}
          />
        </Modal>
        

    </>
  );
}

export default Home;
