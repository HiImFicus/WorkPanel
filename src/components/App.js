import { Container, Flex, createStyles } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

import HeaderSearch from './layouts/HeaderSearch'
import NavbarColored from './layouts/NavbarColored'
import { Outlet } from "react-router-dom";

import {
  IconHeartRateMonitor,
  IconGauge,
} from '@tabler/icons-react';

const useStyles = createStyles(theme => ({
  content: {
    width: '100%',
  },
}))

//fake data def
const headerLinks = [
  // { link: '', label: 'headerLink1' }
];

const navbarLinks = [
  {
    label: 'Home', icon: IconGauge,
    initiallyOpened: true,
    links: [
      { label: 'Dashboard', link: '/' },
    ]
  },
  {
    label: 'GPU management',
    icon: IconHeartRateMonitor,
    links: [
      { label: 'Overview', link: '/gpu' },
      { label: 'List', link: '/gpu/list' },
      { label: 'Add', link: '/gpu/add' },
      { label: 'Setting', link: '/gpu/setting' },
    ],
  },
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
    <Container fluid px={0}>
      <Flex>
        {navIsShowing && (<NavbarColored data={navbarLinks} version={version} />)}
        <Flex direction="column" className={classes.content}>
          <HeaderSearch links={headerLinks} searchConent={searchConent} navbarState={navIsShowing} navbarToggle={() => { navToggle.toggle() }} />
          <Outlet />
        </Flex>
      </Flex>
    </Container>
  )
}

export default App
