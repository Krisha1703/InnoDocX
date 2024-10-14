import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

// Styling for the search bar
const Search = styled('div')(({ theme, focused }) => ({
    position: 'relative',
    boxShadow: focused ? '0px 4px 12px rgba(0, 0, 0, 0.2)' : 'none',
    marginLeft: 0,
    backgroundColor: focused ? 'white' : '',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));


// Styling for the search icon wrapper
const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
  // Styling for the input base in the search bar
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '20ch',
        '&:focus': {
          width: '30ch',
        },
      },
    },
  }));
  

// Export all components
export { Search, SearchIconWrapper, StyledInputBase };