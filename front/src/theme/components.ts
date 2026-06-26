export const componentTheme = {
  Button: {
    variants: {
      primary: {
        bg: 'brand.primaryDark',
        color: 'white',
        _hover: { bg: 'brand.800' },
        _active: { bg: 'brand.900' },
        borderRadius: 'md',
      },
      secondary: {
        bg: 'white',
        color: 'brand.primaryDark',
        border: '1.5px solid',
        borderColor: 'brand.primaryDark',
        _hover: { bg: 'brand.light' },
        borderRadius: 'md',
      },
    },
    defaultProps: { variant: 'primary' },
  },
  Input: {
    variants: {
      outline: {
        field: {
          borderColor: 'gray.300',
          _focus: { borderColor: 'brand.primary', boxShadow: '0 0 0 1px #047857' },
        },
      },
    },
  },
  Select: {
    variants: {
      outline: {
        field: {
          borderColor: 'gray.300',
          _focus: { borderColor: 'brand.primary', boxShadow: '0 0 0 1px #047857' },
        },
      },
    },
  },
};
