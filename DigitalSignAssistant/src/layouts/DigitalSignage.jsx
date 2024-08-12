import Styled from 'styled-components';

const FlexContainer = Styled("div")`
  display: flex;
  justify-content: flex-start;
  background-color: transparent; 
  padding: 3.5rem 15px 60px 15px; 
  width: 100%; 
  height: calc(100% - 3.5rem);
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
  flex-grow: 8;
`; 

// Define the FlexContainer styled-component
const FlexContainerColumn = Styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: transparent;
  height: 100%;
  padding: 15px; 
`;
  
const Results = Styled(FlexContainerColumn)`
  flex-grow: 2;
  flex-shrink: 0;
`;
 
const Chat = Styled(FlexContainerColumn)`
  flex-grow: 1;
  flex-shrink: 1;
`;
 
 

export const DigitalSignage = ({fileUpload, inferredResults, chat, progress})=><>  
    <FlexContainer>
        <div className="progress-bar" style={ { position: "fixed", top: 0, left: 0, height: "4px", width: `${progress}%` } }></div>
        <FileUpload>{fileUpload() ?? "File Upload Here"}</FileUpload>
        <RightDiv>
            
            <FlexContainerColumn>
                <Results>{inferredResults ?? "Inferred Results Here"}</Results>
                <Chat>{chat() ?? "Chat Here"}</Chat>
            </FlexContainerColumn>

        </RightDiv>
    </FlexContainer>
</>

