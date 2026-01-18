export const ROLES = {
    ADMIN: "ADMIN",
    SHOP_OWNER: "SHOP_OWNER",
    CUSTOMER: "USER", // "USER" as per requirements, mapped from "customer" in authStore
};

export const ROLE_DASHBOARD_MAP = {
    [ROLES.ADMIN]: "/admin",
    [ROLES.SHOP_OWNER]: "/shop",
    [ROLES.CUSTOMER]: "/dashboard",
};
