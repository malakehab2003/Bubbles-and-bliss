export const cleanUser = (user) => {
    const { password, is_deleted, last_login, created_at, updated_at, ...rest } = user.dataValues;
    return rest;
}

export const cleanAddress = (address) => {
    const {  created_at, updated_at, ...rest } = address.dataValues;
    return rest;
};


export const cleanAddresses = (addresses) => {
  return addresses.map(address => {
    const { created_at, updated_at, ...rest } = address.dataValues;
    return rest;
  });
};