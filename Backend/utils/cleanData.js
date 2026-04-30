export const cleanUser = (user) => {
    const { password, is_deleted, last_login, created_at, updated_at, ...rest } = user.dataValues;
    return rest;
}