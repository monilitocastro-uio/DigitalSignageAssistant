import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faFileAlt, faFileImage, faFilePdf, faFileWord } from '@fortawesome/free-solid-svg-icons';
import { PrimaryLargeTextAlt, SecondaryTextAlt } from '../typography/text'; // Assuming these are the custom typography components
import axios from "axios";

// Define styled components
const FileListContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;
  width: 20vw;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
`;

const FileName = styled(SecondaryTextAlt)`
  margin-left: 10px;
`;

// You can define more icons for different file types
const getIconForFileType = (fileName) => {
    if(!fileName)
    {
        return faFileAlt;
    }
    // BUG
  const extension = fileName.split('.').pop().toLowerCase();
  switch (extension) {
    case 'pdf':
      return faFilePdf;
    case 'jpg':
    case 'jpeg':
    case 'png':
      return faFileImage;
    case 'doc':
    case 'docx':
      return faFileWord;
    default:
      return faFileAlt;
  }
};

const DeleteButton = styled(FontAwesomeIcon)`
     color: red;
     cursor: pointer;
     margin-left: 10px;
   `;
   const FileItemContainer = styled.div`
     display: flex;
     justify-content: space-between;
     align-items: center;
     margin: 10px 0;
   `;

   const handleDelete = async (fileName, done) => {
     try {
       const response = await axios.delete(`/files/${fileName}`);
       if(response.status === 200){
         // Handle successful deletion, maybe remove the file from the local state
         if(done){
            done();
         }
       }
     } catch (error) {
       console.error('Error deleting file:', error);
     }
   };

export const FileList = ({ files, updateFilesList }) => (
     <FileListContainer>
       {files.map((file, index) => (
         <FileItemContainer key={index}>
           <FileItem>
             <FontAwesomeIcon icon={getIconForFileType(file)} />
             <FileName>{file}</FileName>
           </FileItem>
           <DeleteButton icon={faTrashAlt} onClick={() => handleDelete(file, updateFilesList)} />
         </FileItemContainer>
       ))}
     </FileListContainer>
   );
   