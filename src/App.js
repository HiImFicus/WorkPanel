import { Container, Flex, createStyles } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

import HeaderSearch from './components/struct/HeaderSearch'
import NavbarColored from './components/struct/NavbarColored'

import './App.css'

const useStyles = createStyles(theme => ({
  content: {
    width: '100%',
  },
}))

//fake data def
const headerLinks = [
  { link: '', label: 'headerLink1' }
];

const navbarLinks = [
  { link: '', label: 'Notifications' },
  { link: '', label: 'Billing' },
  { link: '', label: 'Security' },
  { link: '', label: 'SSH Keys' },
  { link: '', label: 'Databases' },
  { link: '', label: 'Authentication' },
];

const navbarBottomLinks = [
  { link: '', label: 'Settings' },
];

const searchConent = [
  'React',
  'Angular',
  'Vue',
  'Next.js',
  'Riot.js',
  'Svelte',
  'Blitz.js'
];

const version = 'v0.0.1';

function App() {
  const [navIsShowing, navToggle] = useDisclosure(true);
  const { classes } = useStyles()

  return (
    <Container fluid>
      <Flex>
        {navIsShowing && (<NavbarColored data={navbarLinks} bottomData={navbarBottomLinks} version={version} />)}
        <Flex direction="column" className={classes.content}>
          <HeaderSearch links={headerLinks} searchConent={searchConent} navbarState={navIsShowing} navbarToggle={() => { navToggle.toggle() }} />
        </Flex>
      </Flex>
    </Container>
  )
}

export default App
