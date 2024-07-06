import React, { useEffect, useState } from 'react'
import { Button, Modal, Popconfirm } from 'antd';
import './Home.css'
import { DeleteOutlined, EditOutlined, } from '@ant-design/icons';
import "react-toastify/dist/ReactToastify.css";
import { toast } from 'react-toastify';

export default function Home() {

  //get method
  const [data, setData] = useState([]);
  const getApi = () => {
    fetch('https://autoapi.dezinfeksiyatashkent.uz/api/categories')
      .then((res) => res.json())
      .then((item) => setData(item.data))
  }
  useEffect(() => {
    getApi()
  }, []);

  //post
  const [nameEn, setNameEn] = useState();
  const [nameRu, setNameRu] = useState();
  const [art, setArt] = useState();
  const token = localStorage.getItem("access_token");

  const Suvonov = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name_en", nameEn);
    formData.append("name_ru", nameRu);
    formData.append("images", art);

    fetch("https://autoapi.dezinfeksiyatashkent.uz/api/categories", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((javohir) => {
        if (javohir.success === true) {
          getApi();
          setIsModalOpen(false);
          toast.success(javohir.message);
        } else {
          toast.error(javohir.message);
        }
      })
  }

  // delate method
  const [ochir, setOchir] = useState();

  const deleteButton = (e) => {
    e.preventDefault();

    fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/categories/${ochir}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then((res) => res.json())
      .then((resposible) => {
        if (resposible.success === true) {
          getApi();
          setIsModalOpen(false);
          toast.success(resposible.message);
        } else {
          toast.error(resposible.message);
        }
      })
  }

  //put method
  const [bosil, setBosil] = useState(false)
  const [edit, setEdit] = useState()
  const getData = data?.filter((data)=>data.id===edit)

  const [editNameEn, setEditNameEn] = useState();
  const [editNameRu, setEditNameRu] = useState();
  const [editArt, setEditArt] = useState();

  const tahrirla = (e) =>{
    e.preventDefault()

    const formData = new FormData();
    formData.append("name_en", editNameEn);
    formData.append("name_ru", editNameRu);
    formData.append("images", editArt);

    fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/categories/${edit}`, {
      method: 'PUT',
      headers:{
        Authorization: `Bearer ${token}`,
      },
      body:formData,
    })
    .then((resp)=>resp.json())
    .then((asrorbek)=>{
      if (asrorbek.success === true) {
        getApi();
        setIsModalOpen(false);
        toast.success(asrorbek.message);
      } else {
        toast.error(asrorbek.message);
      }
    })
  }

  //modal js
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = (id) => {
    setEdit(id)
    setIsModalOpen(true);
    setBosil(false) 
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className='container'>
      <table id="customers">
        <thead>
          <tr>
            <th>name en</th>
            <th>name ru</th>
            <th>img</th>
            {/* modal */}
            <th>
              <Button type="primary" onClick={showModal}>
                Add Categories
              </Button>
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={index} onClick={() => setBosil(true)}>
              <td>{item.name_en}</td>
              <td>{item.name_ru}</td>
              <td><img className='img' src={`https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/${item.image_src}`} alt="" /></td>
              <td className='put_buttons' onClick={(e) => setOchir(item.id)}  >
            <span>
              <Popconfirm
                  title="Delete the task"
                  description="Are you sure to delete this task?"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={deleteButton}
                >
                  <Button danger type='primary'><DeleteOutlined /></Button>
                </Popconfirm>
            </span>
            <span>
               <Button type="primary" onClick={()=>showModal(item.id)}>
                  <EditOutlined />
                </Button>
            </span>
                
              </td>
            </tr>
          )
          )}
        </tbody>

      </table>
      <Modal title="Basic Modals" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>{
        bosil===true
          ?
          <form> 
            <h1>Tahrirlash uchun</h1>
            <input onChange={(e) => setEditNameEn(e.target.value)} type="text" defaultValue={getData[0]?.name_en} placeholder='nameEn' required />
            <input onChange={(e) => setEditNameRu(e.target.value)} type="text" defaultValue={getData[0]?.name_ru} placeholder='nameRu' required />
            <input onChange={(e) => setEditArt(e.target.files[0])} type="file"  accept='images/*' />
            <button onClick={tahrirla}>Tahrirla</button>
          </form>
          :
          <form>
          <h1>Qoshish uchun</h1>
          <input onChange={(e) => setNameEn(e.target.value)} type="text" placeholder='nameEn' required />
          <input onChange={(e) => setNameRu(e.target.value)} type="text" placeholder='nameRu' required />
          <input onChange={(e) => setArt(e.target.files[0])} type="file" accept='images/*' />
          <button onClick={Suvonov}>qoshilsin</button>
        </form>
        }


      </Modal>
    </div>
  )
}
