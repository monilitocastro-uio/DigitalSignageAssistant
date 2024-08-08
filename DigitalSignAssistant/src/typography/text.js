import  Styled from "styled-components"; 

export const PrimaryText = Styled.span`
    color: rgba(0, 0, 0, .9);
    font-size: 1rem;
    display: block;
    padding: .5rem 1rem;
    text-decoration: none;     
    list-style: none;
    background-color: transparent;    
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    font-weight: 400;
    line-height: 1.5;
`;

export const PrimaryTextAlt = Styled(PrimaryText)`
    color: rgba(255, 255, 255, 1); 
`;

export const SecondaryText = Styled(PrimaryText)`
    color: rgba(0, 0, 0, .5); 
`;


export const SecondaryTextAlt = Styled(SecondaryText)`
    color: rgba(255, 255, 255, 1); 
`;

export const PrimaryLargeText = Styled(PrimaryText)`
    font-size: 1.25rem;
`;


export const PrimaryLargeTextAlt = Styled(PrimaryLargeText)`
    color: rgba(255, 255, 255, 1); 
`;