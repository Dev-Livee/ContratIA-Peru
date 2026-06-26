import { Box, Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '@/context/AuthContext';

export default function MainLayout() {
  const { user } = useAuth();
  const showSidebar = user?.role === 'entity' || user?.role === 'company' || user?.role === 'citizen';

  return (
    <Flex direction="column" minH="100vh">
      <Header />
      <Flex flex={1}>
        {showSidebar && <Sidebar />}
        <Box flex={1} p={{ base: 4, md: 6 }} maxW={showSidebar ? undefined : '1280px'} mx={showSidebar ? undefined : 'auto'} w="100%">
          <Outlet />
        </Box>
      </Flex>
      <Footer />
    </Flex>
  );
}
