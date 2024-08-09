import { useEffect, useState } from "react";
import { DigitalSignage } from "../../layouts/DigitalSignage";
import axios from 'axios';
import { FileList } from "../FileList";


export const Dashboard = props =>
{
   const [progress, setProgress] = useState(0);
   
   // TODO: trigger status polling and give to FileUploadTarget. this function should update progress until progress is 100% and then it should put progress back to 0;
    
    return (
       <><DigitalSignage progress={progress} fileUpload={()=><><FileUploadTarget/></>} /></>
    );
}


const FileUploadTarget = () => {
    const [file, setFile] = useState(null);
    const [filesOnRemote, setFilesOnRemote] = useState([]);

    var fetchAsync = async ()=>{
      try{
        var responseFiles = await axios.get("/files");
        setFilesOnRemote(responseFiles.data);
      }catch(ex){
        console.error("File list not retrieved");
      }

      
    }

    useEffect(()=>{
      fetchAsync();
    }, [])
  
    const handleFileChange = (event) => {
      setFile(event.target.files[0]);
    };
  
    const handleUpload = async () => {
      if (!file) {
        alert('Please select a file first!');
        return;
      }
  
      const formData = new FormData();
      formData.append('file', file);
  
      try {
        const response = await axios.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('File uploaded successfully:', response.data);

        const filesListResponse = await axios.get("/files");
        console.log("Files list:", filesListResponse.data);
        setFilesOnRemote(filesListResponse.data);

      } catch (error) {
        console.error('Error uploading file:', error);
      }
    };
  
    return (
      <div>
        <h2>File Upload</h2>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
        <FileList files={filesOnRemote} updateFilesList={fetchAsync}/>
      </div>
    );
  };