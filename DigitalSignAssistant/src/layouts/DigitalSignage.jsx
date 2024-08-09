import Styled from 'styled-components';

const FlexContainer = Styled("div")`
  display: flex;
  justify-content: flex-start;
  background-color: transparent;
  height: 100%;
  padding: 15px;
  gap: 5px;
  width: 100%;
  height: 100%;
`;

const FlexItem =  Styled("div")`
  background: transparent; 
  border-radius: 5px;
  padding: 8px;
`;

const FileUpload = Styled(FlexItem)`
  flex-grow: 1;
`;

const RightDiv = Styled(FlexItem)`
  flex-grow: 2;
`; 

// Define the FlexContainer styled-component
const FlexContainerColumn = Styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: transparent;
  height: 100%;
  padding: 15px;
  gap: 5px;
`;
  
const Results = Styled(FlexContainerColumn)`
  flex-grow: 2;
`;
 
const Chat = Styled(FlexContainerColumn)`
  flex-grow: 1;
`;
 
 

export const DigitalSignage = ({fileUpload, inferredResults, chat, progress})=><>  
    <FlexContainer>
        <div classname="progress-bar" style={ { position: "fixed", top: 0, left: 0, height: "4px", width: `${progress}%` } }></div>
        <FileUpload>{fileUpload() ?? "File Upload Here"}</FileUpload>
        <RightDiv>
            
            <FlexContainerColumn>
                <Results>{inferredResults ?? "Inferred Results Here"}</Results>
                <Chat>{chat ?? "Chat Here"}</Chat>
            </FlexContainerColumn>

        </RightDiv>
    </FlexContainer>
</>

