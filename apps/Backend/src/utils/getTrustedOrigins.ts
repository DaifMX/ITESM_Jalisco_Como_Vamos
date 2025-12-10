const getTrustedOrigins = () => {
    return process.env.BETTER_AUTH_TRUSTED_ORIGINS_ARRAY?.split(';');
};

export default getTrustedOrigins;