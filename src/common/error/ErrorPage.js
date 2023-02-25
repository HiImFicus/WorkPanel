import { createStyles, Title, Text, Button, Container, Group } from '@mantine/core';
import { useRouteError } from "react-router-dom";
import { NavLink } from "react-router-dom";

const useStyles = createStyles((theme) => ({
    root: {
        paddingTop: 80,
        paddingBottom: 80,
    },

    label: {
        textAlign: 'center',
        fontWeight: 900,
        fontSize: 220,
        lineHeight: 1,
        marginBottom: theme.spacing.xl * 1.5,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2],

        [theme.fn.smallerThan('sm')]: {
            fontSize: 120,
        },
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        textAlign: 'center',
        fontWeight: 900,
        fontSize: 38,

        [theme.fn.smallerThan('sm')]: {
            fontSize: 32,
        },
    },

    description: {
        maxWidth: 500,
        margin: 'auto',
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.xl * 1.5,
    },

    link: {
        textDecoration: 'none',
        color: theme.primaryColor,
    },
}));

export function ErrorPage() {
    const { classes } = useStyles();
    const error = useRouteError();
    console.error(error);

    return (
        <Container className={classes.root}>
            <div className={classes.label}>{error.status}</div>
            <Title className={classes.title}>Sorry, an unexpected error has occurred.</Title>
            <Text color="dimmed" size="lg" align="center" className={classes.description}>
                {error.statusText || error.message}
            </Text>
            <Group position="center">
                <Button variant="subtle" size="md">
                    <NavLink className={classes.link} to={`/`}>Take me back to home page</NavLink>
                </Button>
            </Group>
        </Container>
    );
}

export default ErrorPage
