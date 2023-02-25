import { createStyles, Navbar, Group, Code, ScrollArea, Text } from '@mantine/core'
import { LinksGroup } from './LinksGroup';
import { useViewportSize } from '@mantine/hooks';
import { IconListDetails } from '@tabler/icons-react';

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    // backgroundImage: `linear-gradient(-60deg, ${theme.colors[theme.primaryColor][4]} 0%, ${theme.colors[theme.primaryColor][7]} 100%)`,
    paddingBottom: 0,
  },

  header: {
    padding: theme.spacing.md,
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
      }`,
    backgroundImage: `linear-gradient(-60deg, ${theme.colors[theme.primaryColor][4]} 0%, ${theme.colors[theme.primaryColor][7]} 100%)`,

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

  links: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
  },

  linksInner: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },

  footer: {
    padding: theme.spacing.md,
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
      }`,
    backgroundImage: `linear-gradient(-60deg, ${theme.colors[theme.primaryColor][4]} 0%, ${theme.colors[theme.primaryColor][7]} 100%)`,
  },
}));

export function NavbarColored({ data, version }) {
  const { classes, cx } = useStyles()
  const { height } = useViewportSize();
  const links = data.map((item) => <LinksGroup {...item} key={item.label} />);

  return (
    <Navbar mih={height} width={{ sm: 300 }} p='md' className={classes.navbar}>
      <Navbar.Section className={classes.header}>
        <Group position="apart">
          <IconListDetails color="white" />
          <Text className={classes.text}>My Work Panel</Text>
        </Group>
      </Navbar.Section>

      <Navbar.Section grow className={classes.links} component={ScrollArea}>
        <div className={classes.linksInner}>{links}</div>
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <Group position="apart">
          <Code className={classes.version}>{version}</Code>
          <Text className={classes.text}>Powered by Ficus.</Text>
        </Group>
      </Navbar.Section>
    </Navbar>
  )
}

export default NavbarColored
