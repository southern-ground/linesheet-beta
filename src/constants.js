/**
 * Created by fst on 2/2/17.
 */

/* API */

export const API = "http://shellybrown.com/linesheets/api/";
export const API_GATEWAYS = {
    action_get_inventory: "?action=get_inventory",
    action_get_categories: "?action=get_categories",
    action_add_category: "?action=add_category"
};

/* ERRORS */

export const ERROR_CATEGORY = "invalid category name";

/* ACTIONS */

// Categories:
export const ADD_CATEGORY = "action_add_category";
export const ADD_CATEGORY_RESPONSE = "action_add_category_response";
export const GET_CATEGORIES = "action_get_categories";
export const GET_CATEGORIES_RESPONSE = "action_get_categories_response";

// Inventory:
export const GET_INVENTORY = "action_get_inventory";
export const GET_INVENTORY_RESPONSE = "action_get_inventory_response";

/* COOKIES */
export const COOKIE_NAME = "com.shellybrown.linesheets";
export const LOAD_COOKIE = "action_load_cookie";
export const LOAD_COOKIE_RESPONSE = "action_load_cookie_response";