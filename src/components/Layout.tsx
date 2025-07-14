import React from 'react'
import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ThemeToggle from './ThemeToggle'

const LayoutContainer = styled.div`
  min-height: 100vh;
  background-color: var(--bg-primary);
  transition: background-color 0.3s ease;
`

const Header = styled.header`
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(8px);
`

const HeaderContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
`

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: between;
  height: 72px;
`

const Brand = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 12px;
`

const Logo = styled.div`
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const BrandText = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
`

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 640px) {
    gap: 4px;
  }
`

const NavLink = styled(Link)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
  
  ${({ $isActive }) =>
    $isActive
      ? `
        background-color: var(--color-primary);
        color: white;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
      `
      : `
        color: var(--text-secondary);
        
        &:hover {
          color: var(--text-primary);
          background-color: var(--bg-tertiary);
          transform: translateY(-1px);
        }
      `}
  
  @media (max-width: 640px) {
    padding: 8px 12px;
    font-size: 13px;
  }
`

const NavIcon = styled.span`
  font-size: 16px;
  
  @media (max-width: 640px) {
    font-size: 14px;
  }
`

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const Main = styled.main`
  flex: 1;
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 24px;
  
  @media (max-width: 640px) {
    padding: 20px 16px;
  }
`

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()

  return (
    <LayoutContainer>
      <Header>
        <HeaderContainer>
          <Nav>
            <Brand
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Logo>⚡</Logo>
              <BrandText>Dashboard Pro</BrandText>
            </Brand>
            
            <NavLinks>
              <NavLink
                to="/kanban"
                $isActive={location.pathname === '/kanban'}
              >
                <NavIcon>📋</NavIcon>
                <span>Kanban</span>
              </NavLink>
              <NavLink
                to="/products"
                $isActive={location.pathname === '/products'}
              >
                <NavIcon>🛍️</NavIcon>
                <span>Productos</span>
              </NavLink>
            </NavLinks>
            
            <HeaderActions>
              <ThemeToggle />
            </HeaderActions>
          </Nav>
        </HeaderContainer>
      </Header>
      
      <Main>
        {children}
      </Main>
    </LayoutContainer>
  )
}

export default Layout