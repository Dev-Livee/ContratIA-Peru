import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  colors: {
    brand: {
      50: '#F0FDF4',
      100: '#DCFCE7',
      200: '#BBF7D0',
      300: '#86EFAC',
      400: '#4ADE80',
      500: '#22C55E',
      600: '#16A34A',
      700: '#047857',
      800: '#065F46',
      900: '#064E3B',
    },
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: '#F9FAFB',
        color: '#1F2937',
      },
    },
  },
  components: {
    Button: {
      defaultProps: { colorScheme: 'brand' },
      variants: {
        solid: {
          bg: 'brand.700',
          color: 'white',
          _hover: { bg: 'brand.800' },
          _active: { bg: 'brand.900' },
        },
        outline: {
          borderColor: 'brand.700',
          color: 'brand.700',
          _hover: { bg: 'brand.50' },
        },
        ghost: {
          color: 'brand.700',
          _hover: { bg: 'brand.50' },
        },
      },
    },
    Input: {
      defaultProps: { focusBorderColor: 'brand.700' },
    },
    Select: {
      defaultProps: { focusBorderColor: 'brand.700' },
    },
    Textarea: {
      defaultProps: { focusBorderColor: 'brand.700' },
    },
    NumberInput: {
      defaultProps: { focusBorderColor: 'brand.700' },
    },
  },
});
