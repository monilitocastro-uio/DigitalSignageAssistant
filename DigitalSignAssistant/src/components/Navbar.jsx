import styled from 'styled-components';
import { PrimaryLargeText, SecondaryText } from '../typography/text';
import { useEffect } from 'react';

// Define your styled components

const NavbarWrapper = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between; 
  background-color: #f8f9fa; 
  height: 3.5rem;
  width: 100%;
  position: absolute;
`;
 

const NavbarCollapse = styled.div`
  display: flex;
  justify-content: flex-end; 
`;

const NavItem = styled.li`
  margin-left: 1rem;
`;

const NavLink = styled.a`
  display: block;
  border: 0;
  outline: 0;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 400;
  color: #212529;
  background: transparent;
  text-decoration: none;
  &:hover {
    color: #0056b3;
    background-color: #e9ecef;
    cursor: pointer;
  }
    &:focus {
    border: 0;
  }
`;

export const Navbar = () => {
    useEffect(()=>{
        var getMeAsync = async ()=>{
            try {
                var response = await fetch('/me', { method: 'GET', credentials: 'include' });
                console.log("RESPONSE", response)
                if(response.status!==200){
                    window.location.href="/";
                }
                // Additional logic to handle post-logout UI changes
            } catch (error) {
                window.location.href="/error/signin";
            }
        }
        getMeAsync();

    }, []);

    const handleLogout = async () => {
      try {
          await fetch('/logout', { method: 'POST', credentials: 'include' });
          window.location.href="/";
          // Additional logic to handle post-logout UI changes
      } catch (error) {
          console.error('Logout failed', error);
      }
    };
  return (
    <NavbarWrapper>
      <a href="/"><PrimaryLargeText>AI Signage Assistant</PrimaryLargeText></a> 
      <NavbarCollapse id="navbarNav">
        <ul>
          <NavItem>
            <NavLink onClick={()=>handleLogout()}><SecondaryText>Sign out</SecondaryText></NavLink>
          </NavItem>
        </ul>
      </NavbarCollapse>
    </NavbarWrapper>
  );
}; 