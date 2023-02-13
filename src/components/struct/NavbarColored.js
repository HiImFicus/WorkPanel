import { useState } from 'react'
import { createStyles, Navbar, Group, Code, Text } from '@mantine/core'

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('icon')
  return {
    navbar: {
      backgroundColor: theme.fn.variant({
        variant: 'filled',
        color: theme.primaryColor
      }).background
    },

    text: {
      color: theme.white,
    },

    version: {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: 'filled', color: theme.primaryColor })
          .background,
        0.1
      ),
      color: theme.white,
      fontWeight: 700
    },

    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${theme.fn.lighten(
        theme.fn.variant({ variant: 'filled', color: theme.primaryColor })
          .background,
        0.1
      )}`
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${theme.fn.lighten(
        theme.fn.variant({ variant: 'filled', color: theme.primaryColor })
          .background,
        0.1
      )}`
    },

    link: {
      ...theme.fn.focusStyles(),
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      fontSize: theme.fontSizes.sm,
      color: theme.white,
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      '&:hover': {
        backgroundColor: theme.fn.lighten(
          theme.fn.variant({ variant: 'filled', color: theme.primaryColor })
            .background,
          0.1
        )
      }
    },

    linkIcon: {
      ref: icon,
      color: theme.white,
      opacity: 0.75,
      marginRight: theme.spacing.sm
    },

    linkActive: {
      '&, &:hover': {
        backgroundColor: theme.fn.lighten(
          theme.fn.variant({ variant: 'filled', color: theme.primaryColor })
            .background,
          0.15
        ),
        [`& .${icon}`]: {
          opacity: 0.9
        }
      }
    }
  }
})

export function NavbarColored({ data, bottomData, version }) {
  const { classes, cx } = useStyles()
  // const [active, setActive] = useState('Billing')
  const [active, setActive] = useState('')

  const links = data.map(item => (
    <a
      className={cx(classes.link, {
        [classes.linkActive]: item.label === active
      })}
      href={item.link}
      key={item.label}
      onClick={event => {
        event.preventDefault()
        setActive(item.label)
      }}
    >
      <span>{item.label}</span>
    </a>
  ))

  const bottomLinks = bottomData.map(item => (
    <a
      href={item.link}
      key={item.label}
      className={classes.link}
      onClick={event => event.preventDefault()}
    >
      <span>{item.label}</span>
    </a>
  ))

  return (
    <Navbar height='100vh' width={{ sm: 300 }} p='md' className={classes.navbar}>
      <Navbar.Section grow>
        <Group className={classes.header} position='apart'>
          <Text className={classes.text}>My Work Panel</Text>
          <Code className={classes.version}>{version}</Code>
        </Group>
        {links}
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        {bottomLinks}
      </Navbar.Section>
    </Navbar>
  )
}

export default NavbarColored
