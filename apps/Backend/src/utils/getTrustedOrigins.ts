const getTrustedOrigins = () => {
    process.env.BETTER_AUTH_TRUSTED_ORIGINS_ARRAY?.split(';').forEach((t) => console.log(t))
    return process.env.BETTER_AUTH_TRUSTED_ORIGINS_ARRAY?.split(';');
};

export default getTrustedOrigins;