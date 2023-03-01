import {
    createStyles,
    Text,
    Title,
} from '@mantine/core';

const useStyles = createStyles((theme) => ({
    wrapper: {
        boxSizing: 'border-box',
        backgroundImage: `linear-gradient(-60deg, ${theme.colors[theme.primaryColor][4]} 0%, ${theme.colors[theme.primaryColor][7]
            } 100%)`,
        padding: theme.spacing.xl * 2.5,

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            padding: theme.spacing.xl * 1.5,
        },
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        color: theme.white,
        lineHeight: 1,
    },

    description: {
        color: theme.colors[theme.primaryColor][0],

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            maxWidth: '100%',
        },
    },
}));

export function Welcome() {
    const { classes } = useStyles();

    return (
        <>
            <div className={classes.wrapper}>
                <div>
                    <Title className={classes.title}>Hello, Ficus!</Title>
                    <Text className={classes.description} mt="sm">
                        Welcome to work panel.
                    </Text>
                </div>
                <div className=""></div>
            </div>
        </>
    );
}

export default Welcome
