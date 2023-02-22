import { useState } from 'react'
import { createStyles, Navbar, Group, Code, Text } from '@mantine/core'
import { Link } from "react-router-dom";
import { useViewportSize } from '@mantine/hooks';


const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('icon')
  return {
    navbar: {
      // backgroundColor: theme.fn.variant({
      //   variant: 'filled',
      //   color: theme.primaryColor
      // }).background,
      backgroundImage: `linear-gradient(-60deg, ${theme.colors[theme.primaryColor][4]} 0%, ${theme.colors[theme.primaryColor][7]
        } 100%)`,
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
  const { height } = useViewportSize();

  // const [active, setActive] = useState('Billing')
  const [active, setActive] = useState(data[0].label)

  const links = data.map(item => (
    <Link
      //todo refresh bug
      className={cx(classes.link, {
        [classes.linkActive]: item.label === active
      })}
      to={item.link}
      key={item.label}
      onClick={() => {
        setActive(item.label)
      }}
    >
      <span>{item.label}</span>
    </Link>
  ))

  const bottomLinks = bottomData.map(item => (
    <Link
      to={item.link}
      key={item.label}
      className={classes.link}
    >
      <span>{item.label}</span>
    </Link>
  ))

  return (
    <Navbar mih={height} width={{ sm: 300 }} p='md' className={classes.navbar}>
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
