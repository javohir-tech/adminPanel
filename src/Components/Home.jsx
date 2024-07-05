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

  const deleteButton = (e) =>{
    e.preventDefault();

    fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/categories/${ochir}`, {
      method:'DELETE',
      headers:{
        Authorization: `Bearer ${token}`,
      }
    })
    .then((res)=>res.json())
    .then((resposible)=>{
      if (resposible.success === true) {
        getApi();
        setIsModalOpen(false);
        toast.success(resposible.message);
      } else {
        toast.error(resposible.message);
      }
    })
  }
 
  //modal js
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
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
            <tr key={index}>
              <td>{item.name_en}</td>
              <td>{item.name_ru}</td>
              <td><img className='img' src={`https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/${item.image_src}`} alt="" /></td>
              <td className='put_buttons' onClick={(e)=>setOchir(item.id)}  >
                <span >
                  <Popconfirm
                    title="Delete the task"
                    description="Are you sure to delete this task?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={deleteButton}
                  >
                    <Button danger type='primary'><DeleteOutlined/></Button>
                  </Popconfirm>
                </span>
              </td>
            </tr>
          )
          )}
        </tbody>

      </table>
      <Modal title="Basic Modals" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <form>
          <input onChange={(e) => setNameEn(e.target.value)} type="text" placeholder='nameEn' required />
          <input onChange={(e) => setNameRu(e.target.value)} type="text" placeholder='nameRu' required />
          <input onChange={(e) => setArt(e.target.files[0])} type="file" accept='images/*' />
          <button onClick={Suvonov}>qoshilsin</button>
        </form>
      </Modal>
    </div>
  )
}
